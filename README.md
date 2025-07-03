# Emergency Services System

A comprehensive emergency services management system built with Next.js, featuring real-time request tracking and responder coordination.

## Features

- **Client Interface**: Request emergency services with priority levels
- **Responder Dashboard**: Manage and respond to emergency requests
- **Real-time Tracking**: Live location tracking and status updates
- **Service Types**: Fire, Police, and Medical emergency services
- **Database Integration**: Neon PostgreSQL for data persistence

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. Configure your Neon database URL in `.env.local`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

## Database Setup

The system automatically initializes the database with demo users:

### Demo Accounts

**Clients:**
- Username: `JohnDoe` / Password: `JohnDoe`
- Username: `JaneSmith` / Password: `JaneSmith`
- Username: `MikeJohnson` / Password: `MikeJohnson`

**Responders:**
- Username: `MarkMaina` / Password: `MarkMaina` (Fire)
- Username: `SashaMunene` / Password: `SashaMunene` (Police)
- Username: `AliHassan` / Password: `AliHassan` (Medical)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- shadcn/ui Components
