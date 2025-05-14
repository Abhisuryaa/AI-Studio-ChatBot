<<<<<<< HEAD
# AI Content Generator Platform

A modern web application for generating high-quality content using AI technology. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🤖 ChatGPT-style AI Assistant
- 📝 SEO Blog/Article Generator
- 🎨 Image Generation
- 👤 User Dashboard
- 💳 Subscription & Billing

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, ShadCN/UI
- **Authentication**: Supabase Auth (Free Tier)
- **Database**: Supabase (Free Tier)
- **AI Integration**: Hugging Face API (Free Tier)
- **Payment**: Stripe (Free Tier for development)
- **Deployment**: Vercel (Free Tier)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-content-generator.git
cd ai-content-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Get your free API keys:
   - [Hugging Face](https://huggingface.co/): Sign up for a free account and get your API key
   - [Supabase](https://supabase.com/): Create a free project
   - [Stripe](https://stripe.com/): Sign up for a free developer account

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/         # React components
│   ├── ui/            # UI components
│   └── features/      # Feature-specific components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

## Free API Usage Limits

- **Hugging Face API**: 
  - Free tier includes access to many models
  - Rate limits apply based on your account type
  - No credit card required

- **Supabase**:
  - Free tier includes:
    - 500MB database
    - 50,000 monthly active users
    - 2GB file storage
    - 2GB database egress

- **Stripe**:
  - Free developer account
  - Test mode available
  - No charges in test mode

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aicontentgenerator.com or join our Discord community. 
=======
"# AI-Studio-" 
>>>>>>> 3965a414c351a43335f86c0537301d598981ba49
