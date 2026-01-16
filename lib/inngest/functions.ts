import {inngest} from "@/lib/inngest/client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { sendWelcomeEmail } from "../nodemailer";
import { getAllUsersForNewsEmail } from "../actions/users.actions";


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
    [{event: 'app/send.daily.news'}, {cron: '0 12 * * *'}],
    async ({step}) => {
        const users = await step.run('get-all-users', getAllUsersForNewsEmail)
        if(!users || users.length ===0) return {success : false, message : 'No users Found for news Email'}
        // step 2 send the personalised news to the users 
        // step 3 summarize them with the help of the ai present in the inngest
        // step 4 send the emails to the new users
    }
 )
    
 