import React from 'react';
import ShieldIcon from './icons/ShieldIcon';
import ZapIcon from './icons/ZapIcon';
import GiftIcon from './icons/GiftIcon';

// Fix: Make children optional to satisfy TypeScript, resolving the error.
const FeatureCard = ({ icon: Icon, title, children }: { icon: React.FC<{className?: string}>, title: string, children?: React.ReactNode }) => (
  <div className="text-center p-6 bg-neutral-light dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="flex justify-center items-center mb-4">
      <div className="bg-brand-accent/20 text-brand-primary dark:text-brand-accent p-4 rounded-full">
        <Icon className="w-8 h-8" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
      {children}
    </p>
  </div>
);

const Features: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900/50 py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Why Choose OnlineSarv?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Simple, fast, and secure tools to make your life easier.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={ShieldIcon} title="100% Secure">
            All files are processed in your browser and never uploaded to our servers. Your privacy is guaranteed.
          </FeatureCard>
          <FeatureCard icon={ZapIcon} title="Fast Processing">
            Our tools use advanced algorithms to process your files quickly without compromising quality.
          </FeatureCard>
          <FeatureCard icon={GiftIcon} title="Free Forever">
            All basic tools are completely free to use with no hidden charges or watermarks.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default Features;