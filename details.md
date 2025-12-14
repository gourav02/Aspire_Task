CSS Challenge
Design Fidelity:
Status: ✅ Completed
Brief: Implemented pixel-perfect layouts using Tailwind CSS. The design includes the specific sidebar navigation, the card visualization with the "Aspire" logo and Visa branding, and the two-column grid layout for the dashboard on desktop screens. Custom colors (primary-blue, primary-green) and fonts (Open Sans) match the design specs.
Desktop View Only:
Status: ✅ Completed
Brief: The application is fully responsive but optimized for Desktop. It utilizes a Sidebar layout for desktop (md breakpoint and up) and hides mobile specific elements like the bottom navigation and the draggable sheet when on larger screens.
Code Challenge
API Architecture:
Status: ✅ Completed
Brief: Created a services/api.ts module that acts as a mock API. It handles data fetching (getCards, getTransactions) and data mutation (addCard) separate from the UI components.
Data Persistence & State:
Status: ✅ Completed
Brief: Data is persisted using the browser's localStorage. New cards added survive page reloads. React State (useState, useEffect) is used for managing active UI data.
Startup Data:
Status: ✅ Completed
Brief: The application initializes with a mock user "Mark Henry" if no data is found in local storage, ensuring the UI is never empty on first load.
Interactions (Add New Card):
Status: ✅ Completed
Brief: Implemented a NewCardModal using accessible Dialog components. Users enter a name, and the system automatically generates a 16-digit card number, CVV, and expiry date via utility functions in utils.ts before appending it to the list.
TypeScript:
Status: ✅ Completed
Brief: The entire project is written in TypeScript with strict typing. Interfaces for Card, Transaction, and ActionItem are defined in types.ts.
Modern JS Framework:
Status: ✅ Completed
Brief: Built with React 18 using Functional Components and Hooks. We integrated Radix UI (via Shadcn-like components) for accessible, headless UI primitives.
Code Style:
Status: ✅ Completed
Brief: Followed a modular architecture: components/ for features, components/ui/ for reusable atoms, and services/ for logic. Used tailwind-merge and clsx for clean class management.
README.md:
Status: ⚠️ Added below
Brief: I have generated the README.md file below to fulfill the final requirement.