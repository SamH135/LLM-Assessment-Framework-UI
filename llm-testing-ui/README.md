# LLM Assessment Framework UI

A modern React + Vite application providing a user interface for the LLM Assessment Framework. This frontend allows users to configure, test, and evaluate Language Models through an intuitive interface.

[![Node.js Version](https://img.shields.io/node/v/vite.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite Version](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Development](#development)
  - [Production](#production)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

### Model Management
- Select and configure language models
- Set model parameters like max length
- Real-time model response testing

### Prompt Testing
- Load prompts from files
- Organize prompts by categories
- Test prompts against selected models

### Test Evaluation
- Select multiple evaluators
- View test results and model responses
- Analyze model performance

## Prerequisites

- Node.js (version specified in package.json)
- Framework + API server running on `http://localhost:8000`
- Modern web browser with JavaScript enabled

## Technology Stack

| Technology    | Version | Purpose                  |
|--------------|---------|--------------------------|
| React        | 18.3    | UI Framework            |
| Vite         | 5.4     | Build Tool              |
| TypeScript   | 5.6     | Type Safety             |
| Tailwind CSS | 3.4     | Styling                 |
| Radix UI     | Latest  | Component Library       |

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/samh135/llm-assessment-framework-ui.git
cd llm-testing-ui
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Development

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Usage Guide

1. **Initial Setup**
   - Ensure the API server is running
   - Configure the API endpoint in `.env`
   - Start the development server

2. **Basic Workflow**
   - Navigate to the "Run Tests" page
   - Enter prompt file path or select from examples
   - Choose prompt category and specific prompt
   - Configure model settings
   - Select evaluation tests
   - Submit and view results

## Project Structure

```
llm-testing-ui/
├── src/
│   ├── components/
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.jsx
│   │   │   └── TestPage.jsx
│   │   └── ui/             # Reusable UI components
│   │       ├── alert.jsx
│   │       └── card.jsx
│   ├── lib/                # Utility functions
│   │   └── utils.js
│   ├── App.jsx            # Main application component
│   └── index.css          # Global styles
├── vite.config.js         # Vite configuration
└── package.json           # Project dependencies
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API server endpoint | `http://localhost:8000/api` |

### Build Configuration

The Vite configuration (`vite.config.js`) includes:

```javascript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## Development Guide

### Component Guidelines
- Use functional components with hooks
- Follow existing component structure in `/components`
- Utilize provided UI components from `/components/ui`
- Implement proper error handling for API calls

### Styling
- Use Tailwind CSS utility classes
- Follow design system in `index.css`
- Support light/dark modes via classes

### API Integration
The application connects to the following key endpoints:

| Endpoint | Method | Purpose |
|----------|---------|---------|
| `/api/prompts` | POST | Load prompts from file |
| `/api/test` | POST | Execute model tests |

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| API Connection Failed | Verify API server is running at configured URL |
| Prompt Loading Error | Check file path and permissions |
| Invalid Model Config | Review model parameters in configuration |
| Build Failures | Clear `node_modules` and reinstall dependencies |

### Debug Steps
1. Check browser console for error messages
2. Verify API server status
3. Confirm environment variables
4. Review network requests in browser tools

