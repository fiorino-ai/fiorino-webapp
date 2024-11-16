# Fiorino.AI Frontend

This is the frontend application for Fiorino.AI, an open-source solution for tracking, managing, and billing LLM usage in SaaS applications. Built with React, TypeScript, and Vite.

## Features

- **Cost Dashboard**: Real-time visualization of LLM usage costs and trends
- **Usage Analytics**: Detailed metrics and charts for token consumption
- **Multi-Model Support**: Track costs across different LLM providers and models
- **Bill Management**: Set and manage billing limits and overhead costs
- **API Key Management**: Create and manage API keys for integration
- **Developer Tools**: Monitor API usage and debug integration issues
- **Dark Mode**: Built-in dark theme support
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui
- Recharts
- Zustand
- React Router
- Axios

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/fiorino-ai/fiorino-webapp.git
   cd fiorino-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your backend API URL.

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Page components
├── stores/        # Zustand state management
├── lib/           # Utilities and helpers
├── types/         # TypeScript type definitions
└── styles/        # Global styles and themes
```

## Integration

To integrate Fiorino.AI with your application:

1. Create a new realm in the dashboard
2. Generate an API key
3. Use the provided endpoint to track LLM usage:
   ```bash
   curl -X POST https://api.yourdomain.com/api/v1/usage/track \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your_api_key_here" \
     -d '{
       "external_id": "user123",
       "input_tokens": 100,
       "output_tokens": 50,
       "provider_name": "openai",
       "model_name": "gpt-4"
     }'
   ```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Related Projects

- [Fiorino.AI Backend](https://github.com/fiorino-ai/fiorino-ai) - The backend API service
- [Fiorino.AI Documentation](https://github.com/fiorino-ai/fiorino-ai/wiki) - Full documentation

## License

This project is licensed under the GPL-V3 License - see the [LICENSE](LICENSE) file for details.
