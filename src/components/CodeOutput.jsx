import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiCode, FiExternalLink } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { generateWidgetHTML, generateIframeCode } from '../utils/codeGenerator';

const CodeOutput = ({ widgetData }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);
  
  const htmlCode = generateWidgetHTML(widgetData);
  const iframeCode = generateIframeCode(widgetData);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    // Update iframe content when showPreview changes
    if (showPreview && previewRef.current) {
      previewRef.current.srcdoc = `
        <!DOCTYPE html>
        <html lang="${widgetData.language || 'da'}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Widget Preview</title>
          <style>
            body { margin: 0; padding: 10px; background: transparent; font-family: sans-serif; }
          </style>
        </head>
        <body>
          ${htmlCode}
        </body>
        </html>
      `;
    }
  }, [showPreview, htmlCode, widgetData.language]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {widgetData.language === 'da' ? 'Genereret kode' : 'Generert kode'}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPreview(!showPreview)}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          <SafeIcon icon={FiExternalLink} className="mr-1" />
          {showPreview 
            ? (widgetData.language === 'da' ? 'Skjul live preview' : 'Skjul live forhåndsvisning')
            : (widgetData.language === 'da' ? 'Vis live preview' : 'Vis live forhåndsvisning')
          }
        </motion.button>
      </div>

      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
          style={{ height: '450px' }}
        >
          <iframe
            ref={previewRef}
            title="Live Widget Preview"
            className="w-full h-full"
            frameBorder="0"
          ></iframe>
        </motion.div>
      )}

      <div className="flex space-x-1 mb-4">
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setActiveTab('html')}
          className={`px-4 py-2 rounded-t-lg font-medium flex items-center ${
            activeTab === 'html'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <SafeIcon icon={FiCode} className="mr-2" />
          HTML Code
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setActiveTab('iframe')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === 'iframe'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          iframe Embed
        </motion.button>
      </div>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(activeTab === 'html' ? htmlCode : iframeCode)}
          className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 z-10 flex items-center"
        >
          <SafeIcon icon={copied ? FiCheck : FiCopy} className="mr-1" />
          {copied
            ? widgetData.language === 'da' ? 'Kopieret!' : 'Kopiert!'
            : widgetData.language === 'da' ? 'Kopier' : 'Kopier'}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
            <code>{activeTab === 'html' ? htmlCode : iframeCode}</code>
          </pre>

          {/* Add a gradient fade effect at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100"
      >
        <p className="text-sm text-blue-800">
          <strong>{widgetData.language === 'da' ? 'Anvendelse:' : 'Bruk:'}</strong>{' '}
          {activeTab === 'html'
            ? widgetData.language === 'da'
              ? 'Kopier HTML-koden og indsæt den direkte i din artikel eller webside.'
              : 'Kopier HTML-koden og lim den direkte inn i artikkelen eller nettsiden din.'
            : widgetData.language === 'da'
            ? 'Brug denne iframe-kode til at indlejre widgeten. Iframe-metoden giver bedre isolering, men kan have nogle begrænsninger med responsivt design.'
            : 'Bruk denne iframe-koden for å bygge inn widgeten. Iframe-metoden gir bedre isolasjon, men kan ha noen begrensninger med responsivt design.'}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CodeOutput;