import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// ============================================
// COMPONENTS
// ============================================
import { Sidebar, Header } from './components';

// ============================================
// PAGES
// ============================================
import { 
  Dashboard, 
  Trading, 
  Portfolio, 
  BotConfig, 
  Settings, 
  Profile 
} from './pages';

// ============================================
// STYLES
// ============================================
import './index.css';

// ============================================
// APP COMPONENT
// ============================================
function App() {
  // Sidebar state management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handlers
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleSidebarToggle = () => setSidebarCollapsed(!sidebarCollapsed);

  // Dynamic margin based on sidebar state
  const mainContentMargin = sidebarCollapsed ? 'lg:ml-24' : 'lg:ml-72';

  return (
    <BrowserRouter>
      {/* ====== ROOT CONTAINER ====== */}
      <div className="min-h-screen bg-[var(--bg-primary)]">
        
        {/* ====== SIDEBAR ====== */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose} 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />
        
        {/* ====== MAIN CONTENT WRAPPER ====== */}
        <div className={`
          flex flex-col min-h-screen
          transition-all duration-300 ease-in-out
          ${mainContentMargin}
        `}>
          
          {/* ====== HEADER ====== */}
          <Header onMenuClick={handleSidebarOpen} />
          
          {/* ====== PAGE CONTENT ====== */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto">
              
              {/* ====== ROUTES ====== */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/bots" element={<BotConfig />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
              
            </div>
          </main>
          
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
