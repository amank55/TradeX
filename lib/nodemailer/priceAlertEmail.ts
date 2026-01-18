import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface PriceAlertEmailData {
  userEmail: string;
  alertName: string;
  symbol: string;
  companyName: string;
  currentPrice: number;
  targetPrice: number;
  condition: string;
  alertStatus: 'Price Above Reached' | 'Price Below Hit';
}

export async function sendPriceAlertEmail(data: PriceAlertEmailData) {
  try {
    const {
      userEmail,
      alertName,
      symbol,
      companyName,
      currentPrice,
      targetPrice,
      condition,
      alertStatus,
    } = data;

    // Determine badge color and opportunity text based on alert status
    const isBullish = alertStatus === 'Price Above Reached';
    const badgeColor = isBullish
      ? 'background-color: #10b981; color: #ffffff;'
      : 'background-color: #ef4444; color: #ffffff;';

    const opportunityBgColor = isBullish ? '#064e3b' : '#7f1d1d';
    const opportunityBorderColor = isBullish ? '#10b981' : '#ef4444';

    const opportunityText = isBullish
      ? `${companyName} has reached your target price! This could be a good time to review your position and consider taking profits or adjusting your strategy.`
      : `${companyName} dropped below your target price! This might be a good time to buy.`;

    let conditionText = condition;
    if (condition === 'greater-than') {
      conditionText = `Price > $${targetPrice}`;
    } else if (condition === 'less-than') {
      conditionText = `Price < $${targetPrice}`;
    } else {
      conditionText = `Price = $${targetPrice}`;
    }

    const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Price Alert - Signalist</title>
    <style type="text/css">
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #141414 !important;
                border: 1px solid #30333A !important;
            }
            .dark-text {
                color: #ffffff !important;
            }
            .dark-text-secondary {
                color: #9ca3af !important;
            }
            .dark-text-muted {
                color: #6b7280 !important;
            }
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
            }
            .mobile-padding {
                padding: 20px !important;
            }
            .mobile-header-padding {
                padding: 20px 20px 12px 20px !important;
            }
            .mobile-text {
                font-size: 14px !important;
                line-height: 1.5 !important;
            }
            .mobile-title {
                font-size: 22px !important;
                line-height: 1.3 !important;
            }
            .mobile-outer-padding {
                padding: 20px 10px !important;
            }
            .alert-badge {
                font-size: 14px !important;
                padding: 8px 12px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
        <tr>
            <td align="center" class="mobile-outer-padding" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 12px; border: 1px solid #30333A;">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td align="left" class="mobile-header-padding" style="padding: 30px 30px 15px 30px;">
                            <img src="https://ik.imagekit.io/a6fkjou7d/logo.png?updatedAt=1756378431634" alt="Signalist Logo" width="130" style="max-width: 100%; height: auto; display: block;">
                        </td>
                    </tr>

                    <!-- Alert Badge -->
                    <tr>
                        <td align="center" style="padding: 0 30px 20px 30px;">
                            <span class="alert-badge" style="display: inline-block; padding: 10px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; ${badgeColor}">
                                ⚠️ ${alertStatus}
                            </span>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 0 30px 30px 30px;">
                            
                            <!-- Alert Title -->
                            <h1 class="mobile-title dark-text" style="margin: 0 0 10px 0; font-size: 26px; font-weight: 700; color: #ffffff; line-height: 1.2;">
                                ${alertStatus}
                            </h1>

                            <!-- Stock Info -->
                            <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #9ca3af;">
                                ${companyName} — ${symbol}
                            </h2>

                            <!-- Alert Details Box -->
                            <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                
                                <!-- Current Price -->
                                <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 14px; color: #9ca3af; font-weight: 500;">Current Price</span>
                                    <span style="font-size: 20px; font-weight: 700; color: #10b981;">$${currentPrice.toFixed(2)}</span>
                                </div>

                                <!-- Divider -->
                                <div style="height: 1px; background-color: #334155; margin: 15px 0;"></div>

                                <!-- Trigger Condition -->
                                <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 14px; color: #9ca3af; font-weight: 500;">Alert Condition</span>
                                    <span style="font-size: 14px; font-weight: 600; color: #ffffff;">${conditionText}</span>
                                </div>

                                <!-- Target Price -->
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 14px; color: #9ca3af; font-weight: 500;">Target Price</span>
                                    <span style="font-size: 18px; font-weight: 700; color: #fbbf24;">$${targetPrice.toFixed(2)}</span>
                                </div>

                            </div>

                            <!-- Opportunity Text -->
                            <div style="background-color: ${opportunityBgColor}; border-left: 4px solid ${opportunityBorderColor}; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin: 0; font-size: 14px; font-weight: 500; line-height: 1.6; color: #ffffff;">
                                    ${opportunityText}
                                </p>
                            </div>

                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0 0 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://signalist.app'}/watchlist" style="display: inline-block; padding: 14px 32px; background-color: #fbbf24; color: #000000; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; transition: all 0.3s ease;">
                                            View Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alert Name -->
                            <p style="margin: 20px 0 10px 0; font-size: 13px; color: #6b7280; text-align: center;">
                                Alert: <span style="color: #9ca3af; font-weight: 600;">${alertName}</span>
                            </p>

                            <!-- Footer -->
                            <div style="text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #30333A;">
                                <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
                                    You're receiving this because you set up a price alert on Signalist.
                                </p>
                                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
                                    © 2025 Signalist
                                </p>
                            </div>

                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `⚠️ ${alertStatus}: ${companyName} (${symbol})`,
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Price alert email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending price alert email:', error);
    return { success: false, error };
  }
}
