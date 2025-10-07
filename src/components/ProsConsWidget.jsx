import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiCheck, FiX, FiThumbsUp, FiThumbsDown, FiSave, FiCopy, FiEye, FiEyeOff, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const ProsConsWidget = () => {
  const [widgetData, setWidgetData] = useState({
    productTitle: 'iPhone 15 Pro',
    productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484426d3?w=400&h=400&fit=crop',
    price: '7.499',
    showPrice: true,
    currency: 'kr',
    pros: ['Utrolig kamerakvalitet', 'Hurtig A17 Pro processor', 'Fantastisk batterilevetid'],
    cons: ['Høj pris', 'Ingen oplader i æsken', 'Sårbar over for ridser'],
    conclusion: 'iPhone 15 Pro er en fremragende smartphone med toppræstationer, men prisen er høj.',
    backgroundColor: '#ffffff',
    accentColor: '#2563eb',
    textColor: '#1f2937',
    language: 'da',
    buttonText: 'Læs fuld anmeldelse',
    buttonLink: 'https://example.com/review',
  });
  
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedList, setDraggedList] = useState(null);
  const [presetThemes, setPresetThemes] = useState([
    { name: 'Standard', backgroundColor: '#ffffff', accentColor: '#2563eb', textColor: '#1f2937' },
    { name: 'Mørk', backgroundColor: '#1f2937', accentColor: '#3b82f6', textColor: '#f9fafb' },
    { name: 'Minimalistisk', backgroundColor: '#f8fafc', accentColor: '#0f172a', textColor: '#334155' },
    { name: 'Farverig', backgroundColor: '#ffffff', accentColor: '#ec4899', textColor: '#0f172a' },
  ]);
  
  const handleInputChange = (field, value) => {
    setWidgetData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const addPro = () => {
    if (newPro.trim()) {
      setWidgetData(prev => ({
        ...prev,
        pros: [...prev.pros, newPro.trim()]
      }));
      setNewPro('');
    }
  };
  
  const addCon = () => {
    if (newCon.trim()) {
      setWidgetData(prev => ({
        ...prev,
        cons: [...prev.cons, newCon.trim()]
      }));
      setNewCon('');
    }
  };
  
  const removePro = (index) => {
    setWidgetData(prev => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index)
    }));
  };
  
  const removeCon = (index) => {
    setWidgetData(prev => ({
      ...prev,
      cons: prev.cons.filter((_, i) => i !== index)
    }));
  };

  const handleDragStart = (e, item, list) => {
    setDraggedItem(item);
    setDraggedList(list);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex, targetList) => {
    e.preventDefault();
    
    if (draggedList === targetList) {
      // Reordering within the same list
      const items = draggedList === 'pros' ? [...widgetData.pros] : [...widgetData.cons];
      const draggedItemIndex = items.indexOf(draggedItem);
      
      if (draggedItemIndex !== -1) {
        items.splice(draggedItemIndex, 1);
        items.splice(targetIndex, 0, draggedItem);
        
        setWidgetData(prev => ({
          ...prev,
          [draggedList]: items
        }));
      }
    } else {
      // Moving between lists
      const sourceItems = draggedList === 'pros' ? [...widgetData.pros] : [...widgetData.cons];
      const targetItems = targetList === 'pros' ? [...widgetData.pros] : [...widgetData.cons];
      
      const draggedItemIndex = sourceItems.indexOf(draggedItem);
      
      if (draggedItemIndex !== -1) {
        sourceItems.splice(draggedItemIndex, 1);
        targetItems.splice(targetIndex, 0, draggedItem);
        
        setWidgetData(prev => ({
          ...prev,
          pros: draggedList === 'pros' ? sourceItems : targetItems,
          cons: draggedList === 'cons' ? sourceItems : targetItems
        }));
      }
    }
    
    setDraggedItem(null);
    setDraggedList(null);
  };

  const applyTheme = (theme) => {
    setWidgetData(prev => ({
      ...prev,
      backgroundColor: theme.backgroundColor,
      accentColor: theme.accentColor,
      textColor: theme.textColor
    }));
  };
  
  const generateWidgetHTML = () => {
    const html = `<!-- Pros & Cons Review Widget -->
<div style="
  max-width: 500px;
  margin: 20px auto;
  background-color: ${widgetData.backgroundColor};
  color: ${widgetData.textColor};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
">
  <div style="display: flex; align-items: center; padding: 16px;">
    <img src="${widgetData.productImage}" alt="${widgetData.productTitle}" style="
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 16px;
    " onerror="this.src='https://via.placeholder.com/80'">
    <div>
      <h3 style="
        font-weight: bold;
        font-size: 18px;
        margin: 0 0 8px 0;
      ">${widgetData.productTitle}</h3>
      ${widgetData.showPrice ? `
      <div style="
        color: ${widgetData.accentColor};
        font-size: 16px;
        font-weight: bold;
      ">${widgetData.price} ${widgetData.currency}</div>
      ` : ''}
    </div>
  </div>
  
  <div style="padding: 0 16px;">
    <div style="
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    ">
      <!-- Pros -->
      <div style="
        flex: 1;
        min-width: 200px;
      ">
        <h4 style="
          color: #22c55e;
          display: flex;
          align-items: center;
          font-size: 16px;
          margin-bottom: 8px;
          border-bottom: 2px solid #22c55e;
          padding-bottom: 4px;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
          ${widgetData.language === 'da' ? 'Fordele' : 'Pros'}
        </h4>
        <ul style="
          list-style: none;
          padding: 0;
          margin: 0;
        ">
          ${widgetData.pros.map(pro => `
            <li style="
              display: flex;
              align-items: flex-start;
              margin-bottom: 8px;
              font-size: 14px;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; min-width: 16px; margin-top: 3px;">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              ${pro}
            </li>
          `).join('')}
        </ul>
      </div>
      
      <!-- Cons -->
      <div style="
        flex: 1;
        min-width: 200px;
      ">
        <h4 style="
          color: #ef4444;
          display: flex;
          align-items: center;
          font-size: 16px;
          margin-bottom: 8px;
          border-bottom: 2px solid #ef4444;
          padding-bottom: 4px;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
          </svg>
          ${widgetData.language === 'da' ? 'Ulemper' : 'Cons'}
        </h4>
        <ul style="
          list-style: none;
          padding: 0;
          margin: 0;
        ">
          ${widgetData.cons.map(con => `
            <li style="
              display: flex;
              align-items: flex-start;
              margin-bottom: 8px;
              font-size: 14px;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; min-width: 16px; margin-top: 3px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              ${con}
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
    
    <!-- Conclusion -->
    <div style="
      margin-top: 16px;
      padding: 12px;
      background-color: ${widgetData.accentColor}10;
      border-radius: 6px;
      font-style: italic;
      font-size: 14px;
      margin-bottom: 16px;
    ">
      "${widgetData.conclusion}"
    </div>
  </div>
  
  <!-- Button -->
  <a href="${widgetData.buttonLink}" target="_blank" rel="noopener noreferrer" style="
    display: block;
    background-color: ${widgetData.accentColor};
    color: white;
    text-align: center;
    padding: 12px 16px;
    text-decoration: none;
    font-weight: bold;
    transition: opacity 0.2s;
  " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
    ${widgetData.buttonText}
  </a>
</div>`;
    
    return html;
  };
  
  const generateIframeCode = () => {
    const htmlContent = generateWidgetHTML();
    const encodedHTML = encodeURIComponent(`
      <!DOCTYPE html>
      <html lang="${widgetData.language || 'da'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pros & Cons Widget</title>
        <style>
          body {
            margin: 0;
            padding: 10px;
            background: transparent;
          }
          @media (max-width: 480px) {
            .widget-container {
              max-width: 100% !important;
            }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    
    // Calculate appropriate iframe height
    const baseHeight = 400;
    const prosCount = widgetData.pros.length * 30;
    const consCount = widgetData.cons.length * 30;
    const conclusionHeight = widgetData.conclusion ? 100 : 0;
    const totalHeight = baseHeight + prosCount + consCount + conclusionHeight;
    
    return `<iframe src="data:text/html;charset=utf-8,${encodedHTML}" width="100%" height="${totalHeight}" frameborder="0" scrolling="no" style="max-width: 520px; margin: 20px auto; display: block;" title="Product Review Widget"></iframe>`;
  };
  
  const handleGenerateCode = () => {
    const htmlCode = generateWidgetHTML();
    const iframeCode = generateIframeCode();
    
    setGeneratedCode({
      html: htmlCode,
      iframe: iframeCode
    });
    setShowCode(true);
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fordele & Ulemper Widget Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Widget konfiguration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sprog
              </label>
              <select
                value={widgetData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="da">Dansk</option>
                <option value="no">Norsk</option>
                <option value="en">Engelsk</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produkt navn
              </label>
              <input
                type="text"
                value={widgetData.productTitle}
                onChange={(e) => handleInputChange('productTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="f.eks. iPhone 15 Pro"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produkt billede URL
              </label>
              <input
                type="url"
                value={widgetData.productImage}
                onChange={(e) => handleInputChange('productImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="showPrice"
                checked={widgetData.showPrice}
                onChange={(e) => handleInputChange('showPrice', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showPrice" className="text-sm font-medium text-gray-700">
                Vis pris
              </label>
            </div>
            
            {widgetData.showPrice && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pris
                  </label>
                  <input
                    type="text"
                    value={widgetData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="7.499"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valuta
                  </label>
                  <input
                    type="text"
                    value={widgetData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="kr"
                  />
                </div>
              </div>
            )}
            
            {/* Fordele */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fordele
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tilføj en fordel..."
                  onKeyPress={(e) => e.key === 'Enter' && addPro()}
                />
                <button
                  onClick={addPro}
                  className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
                >
                  <SafeIcon icon={FiPlus} />
                </button>
              </div>
              <div className="space-y-2 mt-2">
                {widgetData.pros.map((pro, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between bg-gray-50 p-2 rounded-md ${draggedItem === pro ? 'opacity-50' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, pro, 'pros')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'pros')}
                  >
                    <div className="flex items-center">
                      <div className="cursor-move mr-2 text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor" />
                        </svg>
                      </div>
                      <SafeIcon icon={FiThumbsUp} className="text-green-500 mr-2" />
                      <span className="text-sm">{pro}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => removePro(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <SafeIcon icon={FiX} />
                      </button>
                      <button
                        onClick={() => {
                          // Move to cons
                          const newPros = [...widgetData.pros];
                          const [item] = newPros.splice(index, 1);
                          setWidgetData(prev => ({
                            ...prev,
                            pros: newPros,
                            cons: [...prev.cons, item]
                          }));
                        }}
                        title="Flyt til ulemper"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <SafeIcon icon={FiThumbsDown} />
                      </button>
                    </div>
                  </div>
                ))}
                {widgetData.pros.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 0, 'pros')}
                  >
                    Træk fordele hertil
                  </div>
                )}
              </div>
            </div>
            
            {/* Ulemper */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ulemper
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tilføj en ulempe..."
                  onKeyPress={(e) => e.key === 'Enter' && addCon()}
                />
                <button
                  onClick={addCon}
                  className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700"
                >
                  <SafeIcon icon={FiPlus} />
                </button>
              </div>
              <div className="space-y-2 mt-2">
                {widgetData.cons.map((con, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between bg-gray-50 p-2 rounded-md ${draggedItem === con ? 'opacity-50' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, con, 'cons')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'cons')}
                  >
                    <div className="flex items-center">
                      <div className="cursor-move mr-2 text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor" />
                        </svg>
                      </div>
                      <SafeIcon icon={FiThumbsDown} className="text-red-500 mr-2" />
                      <span className="text-sm">{con}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => removeCon(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <SafeIcon icon={FiX} />
                      </button>
                      <button
                        onClick={() => {
                          // Move to pros
                          const newCons = [...widgetData.cons];
                          const [item] = newCons.splice(index, 1);
                          setWidgetData(prev => ({
                            ...prev,
                            cons: newCons,
                            pros: [...prev.pros, item]
                          }));
                        }}
                        title="Flyt til fordele"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <SafeIcon icon={FiThumbsUp} />
                      </button>
                    </div>
                  </div>
                ))}
                {widgetData.cons.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 0, 'cons')}
                  >
                    Træk ulemper hertil
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konklusion
              </label>
              <textarea
                value={widgetData.conclusion}
                onChange={(e) => handleInputChange('conclusion', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Skriv en kort konklusion..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Knaptekst
              </label>
              <input
                type="text"
                value={widgetData.buttonText}
                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="f.eks. Læs fuld anmeldelse"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Knap link
              </label>
              <input
                type="url"
                value={widgetData.buttonLink}
                onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/review"
              />
            </div>

            {/* Themes */}
            <div className="border-t border-gray-200 pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Forudindstillede temaer
              </label>
              <div className="grid grid-cols-4 gap-2">
                {presetThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => applyTheme(theme)}
                    className="p-2 border border-gray-200 rounded-md hover:border-blue-500 transition-colors"
                    style={{ backgroundColor: theme.backgroundColor }}
                  >
                    <div className="h-8 rounded-md mb-1" style={{ backgroundColor: theme.accentColor }}></div>
                    <div className="text-xs font-medium text-center" style={{ color: theme.textColor }}>
                      {theme.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setAdvancedMode(!advancedMode)} 
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                {advancedMode ? (
                  <>
                    <SafeIcon icon={FiChevronUp} className="mr-1" />
                    Skjul avancerede indstillinger
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiChevronDown} className="mr-1" />
                    Vis avancerede indstillinger
                  </>
                )}
              </button>
            </div>
            
            {advancedMode && (
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baggrundsfarve
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={widgetData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={widgetData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accentfarve
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={widgetData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={widgetData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tekstfarve
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={widgetData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={widgetData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-4 mt-6 border-t border-gray-200">
              <button
                onClick={handleGenerateCode}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <SafeIcon icon={FiSave} />
                Generer widget kode
              </button>
            </div>
          </div>
        </div>
        
        {/* Preview Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Forhåndsvisning</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div style={{
                backgroundColor: widgetData.backgroundColor,
                color: widgetData.textColor,
                maxWidth: '500px',
                margin: '0 auto',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                  <img 
                    src={widgetData.productImage} 
                    alt={widgetData.productTitle}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginRight: '16px',
                    }}
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/80'}}
                  />
                  <div>
                    <h3 style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      margin: '0 0 8px 0',
                    }}>{widgetData.productTitle}</h3>
                    {widgetData.showPrice && (
                      <div style={{
                        color: widgetData.accentColor,
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}>
                        {widgetData.price} {widgetData.currency}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ padding: '0 16px' }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Pros */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{
                        color: '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '16px',
                        marginBottom: '8px',
                        borderBottom: '2px solid #22c55e',
                        paddingBottom: '4px',
                      }}>
                        <SafeIcon icon={FiThumbsUp} className="mr-2" />
                        {widgetData.language === 'da' ? 'Fordele' : widgetData.language === 'no' ? 'Fordeler' : 'Pros'}
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {widgetData.pros.map((pro, index) => (
                          <li key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            marginBottom: '8px',
                            fontSize: '14px',
                          }}>
                            <SafeIcon icon={FiCheck} className="text-green-500 mr-2 mt-1 min-w-4" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Cons */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '16px',
                        marginBottom: '8px',
                        borderBottom: '2px solid #ef4444',
                        paddingBottom: '4px',
                      }}>
                        <SafeIcon icon={FiThumbsDown} className="mr-2" />
                        {widgetData.language === 'da' ? 'Ulemper' : widgetData.language === 'no' ? 'Ulemper' : 'Cons'}
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {widgetData.cons.map((con, index) => (
                          <li key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            marginBottom: '8px',
                            fontSize: '14px',
                          }}>
                            <SafeIcon icon={FiX} className="text-red-500 mr-2 mt-1 min-w-4" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Conclusion */}
                  {widgetData.conclusion && (
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: `${widgetData.accentColor}10`,
                      borderRadius: '6px',
                      fontStyle: 'italic',
                      fontSize: '14px',
                      marginBottom: '16px',
                    }}>
                      "{widgetData.conclusion}"
                    </div>
                  )}
                </div>
                
                {/* Button */}
                <button style={{
                  display: 'block',
                  width: '100%',
                  backgroundColor: widgetData.accentColor,
                  color: 'white',
                  textAlign: 'center',
                  padding: '12px 16px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                  {widgetData.buttonText}
                </button>
              </div>
            </div>
          </div>
          
          {showCode && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Genereret kode</h2>
              
              <div className="flex space-x-1 mb-4">
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'html' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  HTML Code
                </button>
                <button
                  onClick={() => setActiveTab('iframe')}
                  className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === 'iframe' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  iframe Embed
                </button>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(activeTab === 'html' ? generatedCode.html : generatedCode.iframe)}
                  className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 z-10 flex items-center"
                >
                  <SafeIcon icon={copied ? FiCheck : FiCopy} className="mr-1" />
                  {copied ? 'Kopieret!' : 'Kopier'}
                </button>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                  <code>{activeTab === 'html' ? generatedCode.html : generatedCode.iframe}</code>
                </pre>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Anvendelse:</strong>{' '}
                  {activeTab === 'html'
                    ? 'Kopier HTML-koden og indsæt den direkte i din artikel eller webside.'
                    : 'Brug denne iframe-kode til at indlejre widgeten. Iframe-metoden giver bedre isolering, men kan have nogle begrænsninger med responsivt design.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProsConsWidget;