# NovaWire

A responsive React.js news aggregator dashboard built with reusable components and modern CSS.

## Features
- Multi-category newsroom layout
- Responsive dashboard design
- Reusable component structure
- React Hooks-based state and category switching
- Ready for API integration with MySQL-backed backend

## Run locally

1. Install dependencies:
   ```bash
   npm install --prefix server
   npm install --prefix client
   ```
2. Start backend and frontend together:
   ```bash
   cd /home/mathan/Desktop/aswanth/koiyya
   npm run dev
   ```
3. Open the frontend at http://localhost:5173

## MySQL config
Copy `.env.example` to `.env` and update database values:

```bash
cp .env.example .env
```

For Railway, add a `DATABASE_URL` variable or set your DB values in the deployment environment.

## Railway deployment notes
- Install the CLI: `npm i -g @railway/cli`
- Log in: `railway login`
- Link the project: `railway link`
- Add variables from `.env.example`
- Deploy the service using the Railway UI or CLI

## Technical stack
- React.js
- JavaScript (ES6+)
- CSS3
- Reusable components
- React Hooks
- Responsive design
