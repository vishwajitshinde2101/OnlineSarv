import React, { useState, useEffect } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { TOOLS } from './constants';
import { Tool } from './types';
import { slugify } from './utils/slugify';
import HomePage from './pages/HomePage';
// Fix: Import ToolPage from the newly created module.
import ToolPage from './pages/ToolPage';
import AboutPage from './pages/AboutPage';
import { navigate } from './utils/navigation';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const renderContent = () => {
    const path = route.replace(/^#\/?/, '');
    const toolMatch = path.match(/^tool\/(.*)$/);

    if (path === 'about') {
      return <AboutPage />;
    }

    if (toolMatch) {
      const toolSlug = toolMatch[1];
      const foundTool = TOOLS.find(t => slugify(t.name) === toolSlug);
      if (foundTool) {
        return (
          <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
            <ToolPage tool={foundTool} />
          </main>
        );
      } else {
        return (
          <main className="flex-grow container mx-auto px-4 sm:px-6 py-20 text-center">
             <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404 - Not Found</h1>
             <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">The tool you are looking for does not exist.</p>
             <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary transition-colors">
              Go to Homepage
            </a>
          </main>
        );
      }
    }
    
    // Default to HomePage
    return <HomePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-light dark:bg-neutral-dark font-sans">
      <Navbar />
      {renderContent()}
      <Footer />
    </div>
  );
};

export default App;