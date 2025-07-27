import React, { useState } from 'react';
import { generateWidgetHTML, generateIframeCode } from '../utils/codeGenerator';

const CodeOutput = ({ widgetData }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  const htmlCode = generateWidgetHTML(widgetData);
  const iframeCode = generateIframeCode(widgetData);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {widgetData.language === 'da' ? 'Genereret kode' : 'Generert kode'}
      </h2>
      
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setActiveTab('html')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === 'html' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          HTML Code
        </button>
        <button
          onClick={() => setActiveTab('iframe')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === 'iframe' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          iframe Embed
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => copyToClipboard(activeTab === 'html' ? htmlCode : iframeCode)}
          className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 z-10"
        >
          {copied
            ? (widgetData.language === 'da' ? 'Kopieret!' : 'Kopiert!')
            : (widgetData.language === 'da' ? 'Kopier' : 'Kopier')}
        </button>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
          <code>{activeTab === 'html' ? htmlCode : iframeCode}</code>
        </pre>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>{widgetData.language === 'da' ? 'Anvendelse:' : 'Bruk:'}</strong>{' '}
          {activeTab === 'html'
            ? (widgetData.language === 'da'
                ? 'Kopier HTML-koden og indsæt den direkte i din artikel eller webside.'
                : 'Kopier HTML-koden og lim den direkte inn i artikkelen eller nettsiden din.')
            : (widgetData.language === 'da'
                ? 'Brug denne iframe-kode til at indlejre widgeten. Iframe-metoden giver bedre isolering, men kan have nogle begrænsninger med responsivt design.'
                : 'Bruk denne iframe-koden for å bygge inn widgeten. Iframe-metoden gir bedre isolasjon, men kan ha noen begrensninger med responsivt design.')}
        </p>
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <strong>{widgetData.language === 'da' ? 'Auto-opdatering:' : 'Auto-oppdatering:'}</strong>{' '}
            {widgetData.language === 'da'
              ? 'Denne widget vil automatisk opdateres, når du redigerer den.'
              : 'Denne widgeten vil automatisk oppdateres når du redigerer den.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodeOutput;