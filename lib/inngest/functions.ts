import {inngest} from "@/lib/inngest/client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { sendWelcomeEmail, sendNewsSummaryEmail } from "../nodemailer";
import { getAllUsersForNewsEmail } from "../actions/users.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews, getStocksDetails } from "../actions/finnhub.actions";
import { sendPriceAlertEmail } from "../nodemailer/priceAlertEmail";
import { connectToDatabase } from "@/database/mongoose";
import { Alert } from "@/database/models/alert.model";


export const sendSignUpEmail = inngest.createFunction(
    { id: 'sign-up-email' },
    { event: 'app/user.created'},
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }]
            }
        })

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) ||'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.'

            const { data: { email, name } } = event;

        
            return await sendWelcomeEmail({ email, name, intro: introText });
        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
    {id : 'daily-news-summary'},
    [{event: 'app/send.daily.news'}, {cron: 'TZ=Asia/Kolkata 0 9 * * *'}],
    async ({step}) => {
        console.log(`[daily-news] Cron triggered at ${new Date().toISOString()}`);
        const users = await step.run('get-all-users', getAllUsersForNewsEmail) as UserForNewsEmail[];
        
        console.log(`[daily-news] Found ${users?.length || 0} users for news email`);
        
        if(!users || users.length === 0) {
            console.log('[daily-news] No users found, returning');
            return {success : false, message : 'No users Found for news Email'}
        }

        // Fetch general market news for all users
        const results = await step.run('fetch-news', async () => {
            try {
                console.log('[daily-news] Fetching general market news for all users');
                let articles = await getNews();
                articles = (articles || []).slice(0, 6);
                console.log(`[daily-news] Got ${articles?.length || 0} articles`);
                
                // Return same news for all users
                return users.map(user => ({ user, articles }));
            } catch (e) {
                console.error('daily-news: error fetching news', e);
                return users.map(user => ({ user, articles: [] }));
            }
        });

        const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

        for (const { user, articles } of results) {
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                    body: {
                        contents: [{ role: 'user', parts: [{ text: prompt }]}]
                    }
                });

                const part = response.candidates?.[0]?.content?.parts?.[0];
                const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

                userNewsSummaries.push({ user, newsContent });
            } catch (e) {
                console.error('Failed to summarize news for : ', user.email, e);
                userNewsSummaries.push({ user, newsContent: null });
            }
        }

        // Send news emails to all users
        await step.run('send-news-emails', async () => {
            const today = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            for (const { user, newsContent } of userNewsSummaries) {
                try {
                    await sendNewsSummaryEmail({ 
                        email: user.email, 
                        date: today,
                        newsContent: newsContent || 'No market news available today.' 
                    });
                    console.log(`[daily-news] Sent email to ${user.email}`);
                } catch (e) {
                    console.error('Failed to send news email to:', user.email, e);
                }
            }
        });

        return {
            success: true,
            message: `News emails sent to ${userNewsSummaries.length} users`
        }
    }
)

export const checkPriceAlerts = inngest.createFunction(
    { id: 'check-price-alerts' },
    { cron: 'TZ=Asia/Kolkata */5 * * * *' }, // Every 5 minutes
    async ({ step }) => {
        try {
            await connectToDatabase();

            // Fetch all active alerts
            const activeAlerts = await step.run('fetch-active-alerts', async () => {
                return await Alert.find({ isActive: true }).lean();
            });

            console.log(`[check-price-alerts] Found ${activeAlerts.length} active alerts`);

            if (activeAlerts.length === 0) {
                return { success: true, message: 'No active alerts to check' };
            }

            // Get all unique symbols and their current prices
            const symbols = [...new Set(activeAlerts.map(a => a.symbol))];
            const stockPrices: Record<string, number> = {};

            await step.run('fetch-stock-prices', async () => {
                for (const symbol of symbols) {
                    try {
                        const stockData = await getStocksDetails(symbol);
                        if (stockData?.currentPrice) {
                            stockPrices[symbol] = stockData.currentPrice;
                        }
                    } catch (error) {
                        console.error(`Failed to fetch price for ${symbol}:`, error);
                    }
                }
            });

            // Check each alert and send emails if triggered
            const triggeredAlerts: typeof activeAlerts = [];

            await step.run('check-alert-conditions', async () => {
                for (const alert of activeAlerts) {
                    const currentPrice = stockPrices[alert.symbol];
                    if (!currentPrice) continue;

                    let isTriggered = false;
                    let alertStatus: 'Price Above Reached' | 'Price Below Hit' = 'Price Above Reached';

                    if (alert.condition === 'greater-than') {
                        isTriggered = currentPrice >= alert.thresholdValue;
                        alertStatus = 'Price Above Reached';
                    } else if (alert.condition === 'less-than') {
                        isTriggered = currentPrice <= alert.thresholdValue;
                        alertStatus = 'Price Below Hit';
                    } else if (alert.condition === 'equals') {
                        isTriggered = Math.abs(currentPrice - alert.thresholdValue) < 0.01;
                        alertStatus = 'Price Above Reached';
                    }

                    if (isTriggered) {
                        triggeredAlerts.push({ ...alert, alertStatus });
                    }
                }
            });

            // Send alert emails
            await step.run('send-alert-emails', async () => {
                for (const alert of triggeredAlerts) {
                    try {
                        // Get user email
                        const mongoose = await connectToDatabase();
                        const db = mongoose.connection.db;
                        
                        if (!db) {
                            console.error('Database connection not available');
                            continue;
                        }
                        
                        const user = await db.collection('user').findOne({ id: alert.userId });

                        if (!user?.email) {
                            console.error(`User not found for alert ${alert._id}`);
                            continue;
                        }

                        const currentPrice = stockPrices[alert.symbol] || 0;

                        await sendPriceAlertEmail({
                            userEmail: user.email,
                            alertName: alert.alertName,
                            symbol: alert.symbol,
                            companyName: alert.company,
                            currentPrice,
                            targetPrice: alert.thresholdValue,
                            condition: alert.condition,
                            alertStatus: (alert as any).alertStatus || 'Price Above Reached',
                        });

                        console.log(`[check-price-alerts] Sent alert email for ${alert.symbol} to ${user.email}`);

                        // Update alert based on frequency
                        if (alert.frequency === 'once') {
                            // Deactivate the alert after sending
                            await Alert.updateOne(
                                { _id: alert._id },
                                { isActive: false }
                            );
                        }
                    } catch (error) {
                        console.error(`Failed to send alert email:`, error);
                    }
                }
            });

            return {
                success: true,
                message: `Checked ${activeAlerts.length} alerts, triggered ${triggeredAlerts.length} emails`,
            };
        } catch (error) {
            console.error('[check-price-alerts] Error:', error);
            throw error;
        }
    }
)