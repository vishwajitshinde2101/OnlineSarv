import React from 'react';
import LogoIcon from './icons/LogoIcon';
import TwitterIcon from './icons/TwitterIcon';
import GithubIcon from './icons/GithubIcon';
import FacebookIcon from './icons/FacebookIcon';
import { navigate } from '../utils/navigation';

const Footer: React.FC = () => {

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-neutral-light dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 mt-auto text-gray-600 dark:text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <LogoIcon className="w-8 h-8 text-brand-primary dark:text-brand-accent" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">OnlineSarv</span>
            </div>
            <p className="text-sm leading-relaxed mb-2">
              Founded in 2023, OnlineSarv is dedicated to providing simple, powerful, and accessible online tools. Our mission is to boost your productivity by offering high-quality utilities that work right in your browser, saving you the hassle of software installation.
            </p>
             <p className="text-sm leading-relaxed">
              <strong>Your privacy is our priority.</strong> All tools are browser-based, require no registration, and we do not store your files. Your data is automatically deleted after processing, guaranteeing a secure experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#/" onClick={(e) => handleNav(e, '/')} className="hover:text-brand-accent transition-colors">Home</a></li>
              <li><a href="#/" onClick={(e) => handleNav(e, '/')} className="hover:text-brand-accent transition-colors">All Tools</a></li>
              <li><a href="#/about" onClick={(e) => handleNav(e, '/about')} className="hover:text-brand-accent transition-colors">About Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
            All trademarks are owned by their respective holders.<br />
            All rights reserved © 2025 TheMultiNiche.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#/" onClick={(e) => handleNav(e, '/')} aria-label="Twitter" className="text-gray-500 hover:text-brand-accent transition-colors">
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a href="#/" onClick={(e) => handleNav(e, '/')} aria-label="GitHub" className="text-gray-500 hover:text-brand-accent transition-colors">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href="#/" onClick={(e) => handleNav(e, '/')} aria-label="Facebook" className="text-gray-500 hover:text-brand-accent transition-colors">
              <FacebookIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;