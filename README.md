# HackaCode API

API endpoints for HackaCode platform.

## Environment Setup

To run this application, you need to set up the required environment variables:

1. Create a `.env` file in the root directory with the following variables:

```
PORT=3000

# Supabase configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

2. Replace the placeholder values with your actual Supabase project URL and anonymous key.

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm run start:dev

# Build for production
pnpm run build

# Run in production mode
pnpm run start:prod
```

## API Endpoints

- `/auth` - Authentication endpoints
- `/problems` - Problem management endpoints

api-dev.hackacode.xyz
api.hackacode.xyz


