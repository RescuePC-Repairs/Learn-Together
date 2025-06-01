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

3. Create a `.env` file in the project root with your Supabase credentials:
   ```
   PUBLIC_SUPABASE_URL=your-supabase-url
   PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Development

Start the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building for Production

To create a production build:

```bash
npm run build

# Preview the production build
npm run preview
```

## Deployment

This project is configured for deployment to GitHub Pages. To deploy:

1. Update the `homepage` field in `package.json` with your GitHub username:
   ```json
   "homepage": "https://rescuepc-repairs.github.io/Learn-Together"
   ```

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
