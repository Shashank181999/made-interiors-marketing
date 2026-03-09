// Logo and website URLs
const WEBSITE_URL = 'https://madeinteriorsdemo.web.app';
// For local dev, use localhost. For production, use your deployed URL.
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const BOOKING_URL = `${BASE_URL}/book`;
// Brand colors from logo
const BRAND_RED = '#ea1515';
const BRAND_BLACK = '#000000';
// For emails, we need a hosted PNG/JPG version of the logo
// Using a placeholder that will show the brand name beautifully
const LOGO_HTML = `<a href="${WEBSITE_URL}" style="display: inline-block; padding: 10px 20px; text-decoration: none;">
  <span style="font-size: 24px; font-weight: 300; letter-spacing: 4px; color: ${BRAND_RED};">MADE</span>
  <span style="font-size: 24px; font-weight: 300; letter-spacing: 4px; color: #ffffff; margin-left: 5px;">INTERIORS</span>
</a>`;

const LOGO_HTML_DARK = `<a href="${WEBSITE_URL}" style="display: inline-block; padding: 10px 20px; text-decoration: none;">
  <span style="font-size: 24px; font-weight: 300; letter-spacing: 4px; color: ${BRAND_RED};">MADE</span>
  <span style="font-size: 24px; font-weight: 300; letter-spacing: 4px; color: ${BRAND_BLACK}; margin-left: 5px;">INTERIORS</span>
</a>`;

const LOGO_HTML_SMALL = `<a href="${WEBSITE_URL}" style="display: inline-block; text-decoration: none;">
  <span style="font-size: 16px; font-weight: 300; letter-spacing: 3px; color: ${BRAND_RED};">MADE</span>
  <span style="font-size: 16px; font-weight: 300; letter-spacing: 3px; color: #888888; margin-left: 3px;">INTERIORS</span>
</a>`;

export const defaultTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    type: 'welcome' as const,
    subject: 'Transform Your Space with Made Interiors Dubai',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Made Interiors</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 30px 20px !important; }
      .service-cell { display: block !important; width: 100% !important; padding: 10px 0 !important; }
      .hero-title { font-size: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 20px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #000000; padding: 35px 20px; text-align: center; border-radius: 16px 16px 0 0;">
              ${LOGO_HTML}
              <p style="margin: 12px 0 0; font-size: 10px; color: #666666; letter-spacing: 2px; text-transform: uppercase;">Dubai's Premier Design Studio</p>
            </td>
          </tr>

          <!-- Hero Image -->
          <tr>
            <td style="padding: 0;">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=300&fit=crop" alt="Luxury Interior" style="width: 100%; height: auto; display: block;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="email-content" style="padding: 50px 40px;">
              <h2 class="hero-title" style="margin: 0 0 20px; font-size: 28px; color: #000000; font-weight: 400;">Hello {{name}},</h2>

              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.8; color: #555555;">
                Thank you for connecting with <strong>Made Interiors</strong>. We're thrilled to have the opportunity to help transform your space into something extraordinary.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.8; color: #555555;">
                For over a decade, we've been crafting bespoke interiors for discerning clients across Dubai — from luxurious penthouses to world-class hospitality spaces.
              </p>

              <!-- Services -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td class="service-cell" width="50%" style="padding: 15px; vertical-align: top;">
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; text-align: center; ">
                      <div style="font-size: 32px; margin-bottom: 10px;">🏠</div>
                      <h4 style="margin: 0 0 8px; color: #000000; font-size: 14px; font-weight: 600;">RESIDENTIAL</h4>
                      <p style="margin: 0; color: #777; font-size: 12px;">Villas, Apartments & Penthouses</p>
                    </div>
                  </td>
                  <td class="service-cell" width="50%" style="padding: 15px; vertical-align: top;">
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; text-align: center; ">
                      <div style="font-size: 32px; margin-bottom: 10px;">🏢</div>
                      <h4 style="margin: 0 0 8px; color: #000000; font-size: 14px; font-weight: 600;">COMMERCIAL</h4>
                      <p style="margin: 0; color: #777; font-size: 12px;">Offices, Retail & Hospitality</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${BOOKING_URL}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_RED} 0%, #c91010 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 30px; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px;">
                      Book Free Consultation
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 0 0 20px;">
                    <a href="${WEBSITE_URL}" style="display: inline-block; background: transparent; color: #333333; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-size: 13px; font-weight: 500; letter-spacing: 1px; border: 2px solid #dddddd;">
                      View Our Portfolio
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px 20px; text-align: center; border-radius: 0 0 16px 16px;">
              ${LOGO_HTML_SMALL}
              <p style="margin: 15px 0 8px; color: #666666; font-size: 12px;">Dubai Design District, Dubai, UAE</p>
              <p style="margin: 0 0 12px; color: #444444; font-size: 11px;">© 2024 Made Interiors. All rights reserved.</p>
              <a href="${WEBSITE_URL}/unsubscribe" style="color: #ea1515; font-size: 11px; text-decoration: none;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Showcase',
    type: 'portfolio' as const,
    subject: 'Our Latest Design Projects in Dubai',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 30px 20px !important; }
      .hero-title { font-size: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 20px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #000000; padding: 35px 20px; text-align: center; border-radius: 16px 16px 0 0;">
              ${LOGO_HTML}
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="email-content" style="padding: 50px 40px 30px;">
              <h2 class="hero-title" style="margin: 0 0 20px; font-size: 28px; color: #1a1a1a; font-weight: 400;">Hi {{name}},</h2>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.8; color: #555555;">
                I wanted to share some of our recent interior design projects that I thought might inspire your own vision.
              </p>
            </td>
          </tr>

          <!-- Project 1 -->
          <tr>
            <td style="padding: 0 20px 30px;">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=520&h=280&fit=crop" alt="Downtown Penthouse" style="width: 100%; border-radius: 12px; display: block;">
              <h3 style="margin: 20px 0 10px; font-size: 18px; color: #1a1a1a;">Downtown Dubai Penthouse</h3>
              <p style="margin: 0; font-size: 14px; color: #777; line-height: 1.6;">4,000 sq ft of contemporary luxury featuring custom Italian furniture, marble finishes, and panoramic city views.</p>
            </td>
          </tr>

          <!-- Project 2 -->
          <tr>
            <td style="padding: 0 20px 30px;">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=520&h=280&fit=crop" alt="Business Bay Office" style="width: 100%; border-radius: 12px; display: block;">
              <h3 style="margin: 20px 0 10px; font-size: 18px; color: #1a1a1a;">Business Bay Corporate Office</h3>
              <p style="margin: 0; font-size: 14px; color: #777; line-height: 1.6;">Modern workspace featuring collaborative areas, acoustic solutions, and biophilic design elements.</p>
            </td>
          </tr>

          <!-- Project 3 -->
          <tr>
            <td style="padding: 0 20px 30px;">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=520&h=280&fit=crop" alt="Palm Villa" style="width: 100%; border-radius: 12px; display: block;">
              <h3 style="margin: 20px 0 10px; font-size: 18px; color: #1a1a1a;">Palm Jumeirah Villa</h3>
              <p style="margin: 0; font-size: 14px; color: #777; line-height: 1.6;">Mediterranean-inspired beach villa with custom millwork, imported natural stones, and smart home integration.</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 20px 20px 50px; text-align: center;">
              <p style="margin: 0 0 25px; font-size: 16px; color: #555;">Would any of these styles work for your space?</p>
              <a href="${BOOKING_URL}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_RED} 0%, #c91010 100%); color: #ffffff; text-decoration: none; padding: 16px 45px; border-radius: 30px; font-size: 14px; font-weight: 600; letter-spacing: 1px; margin-bottom: 15px;">
                Book Free Consultation
              </a>
              <br><br>
              <a href="${WEBSITE_URL}" style="display: inline-block; color: #333333; text-decoration: none; padding: 12px 35px; border-radius: 30px; font-size: 13px; font-weight: 500; border: 2px solid #dddddd;">
                View Full Portfolio
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px 20px; text-align: center; border-radius: 0 0 16px 16px;">
              ${LOGO_HTML_SMALL}
              <p style="margin: 15px 0; color: #888888; font-size: 12px;">Made Interiors | Dubai, UAE</p>
              <a href="${WEBSITE_URL}/unsubscribe" style="color: #ea1515; font-size: 11px; text-decoration: none;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },
  {
    id: 'follow_up_1',
    name: 'Follow Up #1',
    type: 'follow_up' as const,
    subject: 'Quick question about your interior project',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 30px 20px !important; }
      .hero-title { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 20px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #000000; padding: 35px 20px; text-align: center; border-radius: 16px 16px 0 0;">
              ${LOGO_HTML}
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="email-content" style="padding: 40px;">
              <h2 class="hero-title" style="margin: 0 0 25px; font-size: 26px; color: #1a1a1a; font-weight: 400;">Hi {{name}},</h2>

              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.8; color: #555555;">
                I reached out a few days ago about Made Interiors. I wanted to follow up and see if you have any questions about our design services.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.8; color: #555555;">
                Are you currently:
              </p>

              <!-- Options -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px;">
                <tr>
                  <td style="padding: 15px 20px; background: #f8f9fa; border-radius: 10px; ">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 15px; font-size: 20px;">🏗️</td>
                        <td style="font-size: 15px; color: #333;">Planning a renovation or new build?</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px 20px; background: #f8f9fa; border-radius: 10px; ">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 15px; font-size: 20px;">🏠</td>
                        <td style="font-size: 15px; color: #333;">Moving to a new home or office?</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px 20px; background: #f8f9fa; border-radius: 10px; ">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 15px; font-size: 20px;">✨</td>
                        <td style="font-size: 15px; color: #333;">Looking to refresh your current space?</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.8; color: #555555;">
                I'd love to understand your needs and see how we can help bring your vision to life.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${BOOKING_URL}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_RED} 0%, #c91010 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-size: 14px; font-weight: 600; letter-spacing: 1px;">
                      Book Free Consultation
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 35px 0 0; font-size: 15px; color: #555555;">
                Best regards,<br>
                <strong style="color: #1a1a1a;">Made Interiors Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px 20px; text-align: center; border-radius: 0 0 16px 16px;">
              <p style="margin: 0 0 10px; color: #888888; font-size: 12px;">Made Interiors | Dubai Design District, UAE</p>
              <a href="${WEBSITE_URL}/unsubscribe" style="color: #ea1515; font-size: 11px; text-decoration: none;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },
  {
    id: 'follow_up_2',
    name: 'Follow Up #2 (Final)',
    type: 'follow_up' as const,
    subject: 'One last thing...',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 30px 20px !important; }
      .hero-title { font-size: 22px !important; }
      .offer-title { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 20px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #000000; padding: 35px 20px; text-align: center; border-radius: 16px 16px 0 0;">
              ${LOGO_HTML}
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="email-content" style="padding: 40px;">
              <h2 class="hero-title" style="margin: 0 0 25px; font-size: 26px; color: #1a1a1a; font-weight: 400;">Hi {{name}},</h2>

              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.8; color: #555555;">
                I don't want to keep filling your inbox, so this will be my last message.
              </p>

              <!-- Offer Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 30px 20px; text-align: center;">
                    <p style="margin: 0 0 10px; color: #c9a962; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Our Offer Still Stands</p>
                    <h3 class="offer-title" style="margin: 0 0 15px; color: #ffffff; font-size: 24px; font-weight: 400;">Free 30-Minute Design Consultation</h3>
                    <p style="margin: 0; color: #aaaaaa; font-size: 14px; line-height: 1.6;">
                      Discuss your space, style preferences, and budget.<br>Get actionable ideas you can use — no obligations.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.8; color: #555555;">
                If now isn't the right time, no worries at all. Keep our contact for when you're ready to transform your space.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${BOOKING_URL}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_RED} 0%, #c91010 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-size: 14px; font-weight: 600;">
                      Claim Free Consultation
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 35px 0 0; font-size: 15px; color: #555555;">
                Wishing you well,<br>
                <strong style="color: #1a1a1a;">Made Interiors Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px 20px; text-align: center; border-radius: 0 0 16px 16px;">
              <p style="margin: 0 0 5px; color: #888888; font-size: 11px;">We won't email you again unless you reach out.</p>
              <p style="margin: 0 0 10px; color: #666666; font-size: 11px;">Made Interiors | Dubai, UAE</p>
              <a href="${WEBSITE_URL}/unsubscribe" style="color: #ea1515; font-size: 11px; text-decoration: none;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },
  {
    id: 'special_offer',
    name: 'Special Offer',
    type: 'offer' as const,
    subject: 'Exclusive: 15% Off Interior Design Services',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-content { padding: 30px 20px !important; }
      .hero-title { font-size: 22px !important; }
      .discount-number { font-size: 56px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 20px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #000000; padding: 35px 20px; text-align: center; border-radius: 16px 16px 0 0;">
              <p style="margin: 0 0 15px; font-size: 11px; letter-spacing: 3px; color: #c9a962; text-transform: uppercase;">Exclusive Offer</p>
              ${LOGO_HTML}
            </td>
          </tr>

          <!-- Offer Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #c9a962 0%, #b8944d 100%); padding: 40px 20px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #ffffff; letter-spacing: 2px;">LIMITED TIME</p>
              <h2 class="discount-number" style="margin: 0; font-size: 72px; font-weight: 700; color: #ffffff;">15%</h2>
              <p style="margin: 10px 0 0; font-size: 16px; color: #ffffff; font-weight: 500;">OFF ALL DESIGN SERVICES</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="email-content" style="padding: 50px 40px;">
              <h2 class="hero-title" style="margin: 0 0 20px; font-size: 24px; color: #1a1a1a; font-weight: 400;">Hi {{name}},</h2>

              <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.8; color: #555555;">
                As a valued connection, we're excited to offer you an exclusive <strong>15% discount</strong> on all our interior design and fit-out services this month.
              </p>

              <!-- What's Included -->
              <h3 style="margin: 30px 0 20px; font-size: 16px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1px;">This Includes:</h3>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px;">
                <tr>
                  <td style="padding: 12px 0; ">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 15px; color: #c9a962; font-size: 18px;">✓</td>
                        <td style="font-size: 15px; color: #555;">Full interior design packages</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; ">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 15px; color: #c9a962; font-size: 18px;">✓</td>
                        <td style="font-size: 15px; color: #555;">Commercial & residential fit-outs</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; ">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 15px; color: #c9a962; font-size: 18px;">✓</td>
                        <td style="font-size: 15px; color: #555;">Furniture procurement & custom pieces</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 15px; color: #c9a962; font-size: 18px;">✓</td>
                        <td style="font-size: 15px; color: #555;">Complete project management</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 30px; font-size: 14px; color: #999; text-align: center; font-style: italic;">
                Offer valid until end of month. Terms apply.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${BOOKING_URL}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_RED} 0%, #c91010 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 30px; font-size: 14px; font-weight: 600; letter-spacing: 1px;">
                      BOOK &amp; CLAIM DISCOUNT
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px 20px; text-align: center; border-radius: 0 0 16px 16px;">
              ${LOGO_HTML_SMALL}
              <p style="margin: 15px 0; color: #888888; font-size: 11px;">Dubai Design District, Dubai, UAE</p>
              <a href="${WEBSITE_URL}/unsubscribe" style="color: #ea1515; font-size: 11px; text-decoration: none;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  },
];
