import React, { useState, useMemo } from 'react';

const UTMLinkBuilder: React.FC = () => {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const generatedUrl = useMemo(() => {
    if (!url) return '';
    try {
        const urlObject = new URL(url);
        if(source) urlObject.searchParams.set('utm_source', source);
        if(medium) urlObject.searchParams.set('utm_medium', medium);
        if(campaign) urlObject.searchParams.set('utm_campaign', campaign);
        if(term) urlObject.searchParams.set('utm_term', term);
        if(content) urlObject.searchParams.set('utm_content', content);
        return urlObject.toString();
    } catch (e) {
        return 'Invalid URL';
    }
  }, [url, source, medium, campaign, term, content]);
  
  const handleCopy = () => {
      if(generatedUrl && generatedUrl !== 'Invalid URL') {
          navigator.clipboard.writeText(generatedUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  }

  const InputField = ({label, value, onChange, placeholder, required = false}: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" required={required}/>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <InputField label="Website URL" value={url} onChange={setUrl} placeholder="https://www.example.com" required />
          <InputField label="Campaign Source" value={source} onChange={setSource} placeholder="e.g., google, newsletter" required />
          <InputField label="Campaign Medium" value={medium} onChange={setMedium} placeholder="e.g., cpc, email" required />
          <InputField label="Campaign Name" value={campaign} onChange={setCampaign} placeholder="e.g., summer_sale" required />
          <InputField label="Campaign Term" value={term} onChange={setTerm} placeholder="e.g., running+shoes (for paid keywords)" />
          <InputField label="Campaign Content" value={content} onChange={setContent} placeholder="e.g., logo_link, text_link (A/B testing)" />
        </div>
        
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Generated Campaign URL</label>
            <div className="relative">
                <textarea readOnly value={generatedUrl} className="w-full h-24 p-2 pr-24 border rounded-md dark:bg-gray-800 dark:text-white" />
                <button onClick={handleCopy} className="absolute top-2 right-2 px-4 py-1 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-md">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UTMLinkBuilder;