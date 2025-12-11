import React from 'react';
import Features from '../components/Features';
import LogoIcon from '../components/icons/LogoIcon';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-neutral-light dark:bg-neutral-dark text-gray-800 dark:text-gray-200">
      {/* Header Section */}
      <header className="bg-brand-primary dark:bg-neutral-dark py-16 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center items-center gap-4 mb-4">
            <LogoIcon className="w-12 h-12 md:w-14 md:h-14 text-brand-accent" />
            <h1 className="text-4xl md:text-5xl font-extrabold">About OnlineSarv</h1>
          </div>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
            Your One-Stop Destination for Free and Secure Online Utilities.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-16">
        {/* Our Story Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Story</h2>
            <p className="text-lg leading-relaxed mb-4 text-gray-600 dark:text-gray-400">
              Founded in 2023, OnlineSarv was born from a simple idea: to create a single, reliable place where anyone could access high-quality online tools without the clutter of ads, invasive tracking, or the need for software installations. We saw a need for a user-friendly platform that prioritizes privacy and efficiency.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Our journey started with a small set of image and PDF utilities, and thanks to the support of our users, we've grown into a comprehensive suite of tools designed to boost productivity for students, professionals, developers, and content creators alike.
            </p>
          </div>
        </section>

        {/* Reusing the Features component for "Why Choose Us?" */}
        <Features />

      </main>
    </div>
  );
};

export default AboutPage;