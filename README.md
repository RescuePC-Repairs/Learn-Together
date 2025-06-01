# Learn Together

A platform for collaborative learning where users can share tutorials, learn from each other, and connect with like-minded learners.

## Features

- User authentication and profiles
- Tutorial sharing with video uploads
- Interactive learning environment
- Community engagement features

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account for the backend

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RescuePC-Repairs/Learn-Together.git
   cd Learn-Together/learntogether
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Or use the setup script
   npm run setup
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npm run migrate:dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=your_google_oauth_redirect_uri

# Google Calendar API
GOOGLE_API_KEY=your_google_api_key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run type checking
- `npm run lint` - Run linter
- `npm run format` - Format code
- `npm run migrate` - Run database migrations
- `npm run setup` - Interactive setup for environment variables

## Project Structure

```
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable components
│   │   ├── stores/         # Svelte stores
│   │   └── utils/          # Utility functions
│   ├── routes/             # Application routes
│   └── app.html            # Main HTML template
├── static/                 # Static assets
├── supabase/
│   └── migrations/       # Database migrations
├── .env.example           # Example environment variables
├── package.json
└── README.md
```

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Flearntogether&env=SUPABASE_URL,SUPABASE_ANON_KEY,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_REDIRECT_URI,GOOGLE_API_KEY&project-name=learntogether&repository-name=learntogether)

### Manual Deployment
2. Install gh-pages if not already installed:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

4. Alternatively, push to the `main` branch and let GitHub Actions handle the deployment.

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [GitHub Pages](https://pages.github.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
