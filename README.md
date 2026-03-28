# Lifeline Core 🚨

**Universal Bridge from Chaos to Structured Action**

> Gemini-powered AI triage system that converts messy, unstructured emergency input into structured, life-saving action plans.

## 🏗️ Architecture

```
├── app/
│   ├── api/analyze/route.js   # Secure server-side AI endpoint
│   ├── layout.js              # Root layout with SEO & accessibility
│   ├── page.js                # Main dashboard page
│   ├── globals.css            # Design system & animations
│   └── components.module.css  # Scoped component styles
├── components/
│   ├── InputBridge.js         # Multi-modal input interface
│   └── ActionDashboard.js     # Structured output renderer
├── utils/
│   ├── payloadParser.js       # AI response validation & parsing
│   └── inputValidator.js      # Input sanitization & security
├── middleware.js               # OWASP security headers
├── __tests__/                  # Test suites (38 tests)
└── Dockerfile                  # Multi-stage production build
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OPENROUTER_API_KEY to .env

# Run development server
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Production build
npm run build && npm start
```

## 🔒 Security Features

- **Server-side API calls** — API keys never reach the client
- **Input sanitization** — Text length limits, MIME type validation, image size caps
- **OWASP headers** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- **Request timeouts** — AbortController-based 15s timeout prevents hanging
- **No-store caching** — Sensitive emergency data is never cached

## ♿ Accessibility

- Skip-to-content navigation link
- ARIA landmark regions (`nav`, `main`, `footer`)
- `aria-live` regions for dynamic content updates
- `role="alert"` on error messages
- `role="meter"` on crisis severity gauge
- Full keyboard navigability
- High contrast color scheme (WCAG AA)

## 🧪 Testing

```bash
npm test        # Run all 38 tests
npm run test:watch  # Watch mode
```

Test coverage includes:
- `payloadParser` — 29 tests (clamping, type safety, edge cases, fallbacks)
- `inputValidator` — 9 tests (security validation, MIME types, size limits)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI**: Google Gemini 2.0 Flash via OpenRouter
- **Styling**: Vanilla CSS Modules (glassmorphism dark theme)
- **Testing**: Vitest
- **Deployment**: Docker → Google Cloud Run

## 📄 License

MIT
