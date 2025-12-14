import React from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="flex h-screen bg-white md:bg-gray-bg font-sans overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile, visible on tablet/desktop */}
      <div className="hidden md:block h-full shadow-lg z-10">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden">
        <Dashboard />
      </main>

      {/* Mobile Bottom Navigation - Hidden on tablet/desktop */}
      <MobileNav />
    </div>
  );
}

export default App;