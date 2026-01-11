# Propelting Frontend

React + TypeScript + Vite frontend for the Propelting AI meeting intelligence platform.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components (Button, Card, etc.)
│   │   ├── Layout.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # Redux store and slices
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── lib/            # Library configurations
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🎨 Tech Stack

- **React 18.2** - UI library
- **TypeScript 5.0** - Type safety
- **Vite 5.0** - Build tool
- **Tailwind CSS 3.4** - Styling
- **Redux Toolkit 2.0** - Global state
- **TanStack Query** - Server state
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hook Form + Zod** - Forms
- **Lucide React** - Icons

## 🎯 Key Features

- 📁 File upload with drag-and-drop
- 📊 Dashboard with meeting stats
- ✅ Action items management
- 🔄 Real-time processing status
- 🎨 Beautiful, accessible UI
- 📱 Mobile-responsive design
- 🌓 Dark mode support (coming soon)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 🤝 Contributing

1. Follow the TypeScript strict mode guidelines
2. Use the existing component patterns
3. Maintain accessibility standards (WCAG 2.1 AA)
4. Write clean, documented code
5. Test thoroughly before committing

## 📄 License

MIT License - see LICENSE file for details
