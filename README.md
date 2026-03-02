# Made Interiors - Marketing Automation System

Automated marketing system for Made Interiors Dubai. This system acts as your virtual marketing team - collecting leads, sending emails, and following up automatically.

## Features

- **Lead Management**: Import from CSV (LinkedIn exports), manual entry
- **Email Campaigns**: Pre-built templates for interior design business
- **Automation**: Auto welcome emails, follow-ups, cold lead marking
- **Tracking**: Email opens, clicks, replies
- **Analytics**: Conversion funnel, performance metrics
- **Dashboard**: Real-time overview of all marketing activities

## Quick Start

### 1. Install Dependencies

```bash
cd ~/Desktop/made-interiors-marketing
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Free Services Setup (Optional - for full functionality)

### Supabase (Database) - Free Tier

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings → API and copy:
   - Project URL
   - Anon/Public key
4. Run the SQL from Settings page to create tables

### Resend (Email) - Free Tier (100 emails/day)

1. Go to [resend.com](https://resend.com) and create account
2. Add and verify your domain (or use their test domain)
3. Create API key
4. Add to `.env` file

### Environment Variables

Create `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
FROM_EMAIL=marketing@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=random_secret_string
```

## Deploying to Vercel (Free)

```bash
npm install -g vercel
vercel
```

## How It Works

### Automation Flow

```
New Lead → Welcome Email → Wait 3 days → Follow-up #1 → Wait 5 days → Follow-up #2 → Mark Cold/Reply
```

### Lead Sources

- **LinkedIn**: Export connections as CSV, upload
- **Google Maps**: (Future) Auto-scrape Dubai businesses
- **Website**: Contact form submissions
- **Manual**: Add leads directly

### Email Templates Included

1. **Welcome Email** - Introduction to Made Interiors
2. **Portfolio Showcase** - Recent projects
3. **Follow-up #1** - Check interest
4. **Follow-up #2** - Final follow-up with offer
5. **Special Offer** - 15% discount campaign

## Project Structure

```
/app
  /dashboard        # Main overview
  /leads            # Lead management
  /campaigns        # Email campaigns
  /templates        # Email templates
  /automation       # Automation rules
  /analytics        # Performance metrics
  /settings         # Configuration
  /api
    /leads          # Lead CRUD
    /send-email     # Email sending
    /cron           # Automated tasks
    /track          # Open/click tracking
/components
  Sidebar.tsx       # Navigation
/lib
  supabase.ts       # Database client
  email.ts          # Email functions
  templates.ts      # Email templates
/types
  index.ts          # TypeScript types
```

## Demo Mode

The app works in demo mode without any external services. It includes:
- Sample leads data
- Sample campaign data
- All UI features

To enable real functionality, add the API keys in Settings or `.env`.

## Support

For Made Interiors Dubai
Website: https://madeinteriorsdemo.web.app
