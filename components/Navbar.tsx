import React, { useState } from 'react';
import LogoIcon from './icons/LogoIcon';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import { navigate } from '../utils/navigation';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = "text-gray-200 hover:bg-brand-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const mobileNavLinkClasses = "block text-gray-200 hover:bg-brand-secondary hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors";

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-brand-primary dark:bg-neutral-dark shadow-lg sticky top-0 z-20 border-b border-brand-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#/" onClick={(e) => handleNav(e, '/')} className="flex-shrink-0 flex items-center space-x-3 text-white">
            <LogoIcon className="w-8 h-8 text-brand-accent" />
            <span className="text-xl font-bold">OnlineSarv</span>
          </a>
          
          <div className="hidden md:flex md:items-center md:space-x-2">
              <a href="#/" onClick={(e) => handleNav(e, '/')} className={navLinkClasses}>Home</a>
              <a href="#/about" onClick={(e) => handleNav(e, '/about')} className={navLinkClasses}>About</a>
              <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-2">
             <ThemeToggle />
             <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-brand-secondary focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
            >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                <CloseIcon className="block h-6 w-6" />
                ) : (
                <MenuIcon className="block h-6 w-6" />
                )}
            </button>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#/" onClick={(e) => handleNav(e, '/')} className={mobileNavLinkClasses}>Home</a>
            <a href="#/about" onClick={(e) => handleNav(e, '/about')} className={mobileNavLinkClasses}>About</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;