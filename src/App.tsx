import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Components
import { Sidebar, Header } from './components';

// Pages
import { 
  Dashboard, 
  Trading, 
  Portfolio, 
  BotConfig, 
  Settings, 
  Profile 
} from './pages';

// Styles
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content Area */}
        <div className={`flex-1 min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page Content */}
          <main className="p-5 sm:p-6 lg:p-8 xl:p-10">
            <div className="max-w-[1800px] mx-auto">
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
