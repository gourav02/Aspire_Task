## Features

- **Responsive Design**: Mobile-first approach that scales to a dual-column desktop layout with a sidebar.
- **Card Management**: 
  - View all active debit and company cards.
  - "Show Card Number" toggle functionality.
  - Add new cards with auto-generated card numbers and CVV.
- **Transactions**: View recent transaction history with category-based icons.
- **Persistence**: Card data is saved to `localStorage` and persists across reloads.
- **Accessibility**: Built using Radix UI primitives (Dialog, Accordion, Tabs) for robust accessibility.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Primitives**: shadcn UI
- **Icons**: Lucide React
- **Build/Run**: ESM (Browser-native modules via importmap) & `serve` for local development.

## Project Structure

```
/
├── components/         # React components
│   ├── ui/             # Reusable UI atoms (Button, Input, Dialog, etc.)
│   ├── Dashboard.tsx   # Main view controller
│   ├── Sidebar.tsx     # Desktop navigation
│   └── ...
├── services/           # Mock API and storage logic
├── types.ts            # TypeScript interfaces
├── utils.ts            # Helper functions (Currency formatting, Generators)
├── index.html          # Entry point & Tailwind config
└── package.json        # Dependencies and scripts
```

## How to Run

You can run this application using the standard Node.js CLI commands.

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation & Execution

1. Open your terminal in the project directory.
2. Install the dependencies (a simple static server):
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. The terminal will display the local URL (usually `http://localhost:3000`). Open this URL in your browser.

