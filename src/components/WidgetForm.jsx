import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiX, FiCheck, FiClock, FiUser, FiEye, FiEyeOff, FiChevronUp, FiChevronDown, FiRefreshCw, FiShuffle } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

const WidgetForm = ({ widgetData, setWidgetData, saveWidget, showCode }) => {
  const [newCustomUsp, setNewCustomUsp] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const [colorPalettes, setColorPalettes] = useState([
    { name: 'Classic', backgroundColor: '#ffffff', buttonColor: '#3b82f6', textColor: '#1f2937' },
    { name: 'Dark', backgroundColor: '#1f2937', buttonColor: '#4ade80', textColor: '#f9fafb' },
    { name: 'Warm', backgroundColor: '#fffbeb', buttonColor: '#f59e0b', textColor: '#78350f' },
    { name: 'Cool', backgroundColor: '#ecfeff', buttonColor: '#06b6d4', textColor: '#0e7490' },
    { name: 'Bold', backgroundColor: '#ffffff', buttonColor: '#ec4899', textColor: '#1e1b4b' },
    { name: 'Minimal', backgroundColor: '#f8fafc', buttonColor: '#0f172a', textColor: '#334155' },
  ]);
  const [draggedUsp, setDraggedUsp] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const handleInputChange = (field, value) => {
    if (field === 'productImage' && value !== widgetData.productImage) {
      setPreviewLoading(true);
    }
    
    setWidgetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Simulate image loading when the product image changes
  useEffect(() => {
    if (previewLoading) {
      const timer = setTimeout(() => {
        setPreviewLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [previewLoading]);

  const handleUspChange = (usp) => {
    setWidgetData(prev => {
      const currentUsps = [...prev.usps];
      if (currentUsps.includes(usp)) {
        return { ...prev, usps: currentUsps.filter(item => item !== usp) };
      } else {
        return { ...prev, usps: [...currentUsps, usp] };
      }
    });
  };

  const addCustomUsp = () => {
    if (newCustomUsp.trim()) {
      setWidgetData(prev => ({
        ...prev,
        customUsps: [...prev.customUsps, newCustomUsp.trim()]
      }));
      setNewCustomUsp('');
    }
  };

  const removeCustomUsp = (index) => {
    setWidgetData(prev => ({
      ...prev,
      customUsps: prev.customUsps.filter((_, i) => i !== index)
    }));
  };

  const reorderCustomUsps = (startIndex, endIndex) => {
    const result = Array.from(widgetData.customUsps);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setWidgetData(prev => ({
      ...prev,
      customUsps: result
    }));
  };

  const handleDragStart = (e, index) => {
    setDraggedUsp(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      // For Firefox compatibility
      e.dataTransfer.setData('text/html', e.target.parentNode);
      e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    } catch (err) {
      // Fallback for other browsers
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = e.currentTarget;
    draggedOverItem.classList.add('bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-blue-50');
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    if (draggedUsp !== null) {
      reorderCustomUsps(draggedUsp, index);
      setDraggedUsp(null);
    }
  };

  const applyColorPalette = (palette) => {
    setWidgetData(prev => ({
      ...prev,
      backgroundColor: palette.backgroundColor,
      buttonColor: palette.buttonColor,
      textColor: palette.textColor
    }));
  };

  const generateRandomProduct = () => {
    const products = [
      {
        title: 'Premium Wireless Headphones',
        description: 'Experience crystal clear sound with 20+ hours of battery life and active noise cancellation.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        originalPrice: '249,99',
        discountedPrice: '199,99',
        customUsps: ['Active noise cancellation', 'Bluetooth 5.0', '20+ hours battery life']
      },
      {
        title: 'Ultra HD Smart TV 55"',
        description: 'Immerse yourself in stunning 4K resolution with this sleek, modern smart TV with voice control.',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
        originalPrice: '5.999,00',
        discountedPrice: '4.499,00',
        customUsps: ['4K Ultra HD resolution', 'Smart TV features', 'Voice control']
      },
      {
        title: 'Professional Chef Knife Set',
        description: 'Precision-crafted kitchen knives for the culinary enthusiast. Made from premium German steel.',
        image: 'https://images.unsplash.com/photo-1566454419290-57a64afe30ac?w=400&h=400&fit=crop',
        originalPrice: '899,99',
        discountedPrice: '649,99',
        customUsps: ['Premium German steel', 'Ergonomic handles', 'Full tang construction']
      },
      {
        title: 'Organic Skincare Gift Set',
        description: 'Natural, cruelty-free skincare collection with moisturizer, cleanser, and serum for radiant skin.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop',
        originalPrice: '349,99',
        discountedPrice: '279,99',
        customUsps: ['100% organic ingredients', 'Cruelty-free', 'Suitable for sensitive skin']
      },
      {
        title: 'Smart Fitness Watch',
        description: 'Track your health and fitness with this advanced smartwatch featuring heart rate monitoring and GPS.',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
        originalPrice: '199,99',
        discountedPrice: '149,99',
        customUsps: ['Heart rate monitoring', 'GPS tracking', '7-day battery life']
      }
    ];

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    
    setPreviewLoading(true);
    setWidgetData(prev => ({
      ...prev,
      productTitle: randomProduct.title,
      productDescription: randomProduct.description,
      productImage: randomProduct.image,
      originalPrice: randomProduct.originalPrice,
      discountedPrice: randomProduct.discountedPrice,
      customUsps: randomProduct.customUsps,
      backgroundColor: randomPalette.backgroundColor,
      buttonColor: randomPalette.buttonColor,
      textColor: randomPalette.textColor
    }));
  };

  const getUspsForLanguage = () => {
    switch (widgetData.language) {
      case 'da':
        return [
          'Fri fragt',
          'Mulighed for fri fragt',
          'Fuld tilfredshed eller pengene tilbage',
          'E-mærket webshop',
          'Tryghedsmærket webshop'
        ];
      case 'no':
        return [
          'Fri frakt',
          'Mulighet for fri frakt',
          'Full tilfredshet eller pengene tilbake',
          'Trygg nettbutikk',
          'Sikker betaling'
        ];
      default:
        return [];
    }
  };

  const getStockStatusLabel = () => {
    return widgetData.language === 'da' ? 'Lagerstatus' : 'Lagerstatus';
  };

  const getStockStatusOptions = () => {
    if (widgetData.language === 'da') {
      return [
        { value: 'none', label: 'Vis ikke lagerstatus' },
        { value: 'inStock', label: 'På lager' },
        { value: 'lowStock', label: 'Få på lager' }
      ];
    } else {
      return [
        { value: 'none', label: 'Ikke vis lagerstatus' },
        { value: 'inStock', label: 'På lager' },
        { value: 'lowStock', label: 'Få på lager' }
      ];
    }
  };

  const getButtonTextPlaceholder = () => {
    return widgetData.language === 'da' ? 'Køb nu' : 'Kjøp nå';
  };

  const getProductTitleLabel = () => {
    return widgetData.language === 'da' ? 'Produkttitel' : 'Produkttittel';
  };

  const getProductDescriptionLabel = () => {
    return widgetData.language === 'da' ? 'Produktbeskrivelse' : 'Produktbeskrivelse';
  };

  const getOriginalPriceLabel = () => {
    return widgetData.language === 'da' ? 'Oprindelig pris (DKK)' : 'Opprinnelig pris (NOK)';
  };

  const getSalePriceLabel = () => {
    return widgetData.language === 'da' ? 'Tilbudspris (DKK)' : 'Tilbudspris (NOK)';
  };

  const getButtonTextLabel = () => {
    return widgetData.language === 'da' ? 'Knaptekst' : 'Knappetekst';
  };

  const getAffiliateLinkLabel = () => {
    return widgetData.language === 'da' ? 'Affiliate link' : 'Affiliate lenke';
  };

  const getCustomUspPlaceholder = () => {
    return widgetData.language === 'da' ? 'Tilføj din egen USP...' : 'Legg til din egen USP...';
  };

  const getAddButtonText = () => {
    return widgetData.language === 'da' ? 'Tilføj' : 'Legg til';
  };

  const getSaveButtonText = () => {
    return widgetData.language === 'da' ? 'Gem widget' : 'Lagre widget';
  };

  const getShippingCountdownLabel = () => {
    return widgetData.language === 'da' ? 'Vis forsendelsesnedtælling' : 'Vis forsendelsesnedtelling';
  };

  const getShippingTimeLabel = () => {
    return widgetData.language === 'da' ? 'Afsendes i dag, hvis du bestiller inden...' : 'Sendes i dag hvis du bestiller før...';
  };

  const getTestimonialLabel = () => {
    return widgetData.language === 'da' ? 'Kundeudtalelse' : 'Kundevurdering';
  };

  const getTestimonialPlaceholder = () => {
    return widgetData.language === 'da' ? 'Dette produkt har ændret mit liv! Fantastisk kvalitet og service...' : 'Dette produktet har endret livet mitt! Fantastisk kvalitet og service...';
  };

  const getTestimonialNameLabel = () => {
    return widgetData.language === 'da' ? 'Kundenavn' : 'Kundenavn';
  };

  const getTestimonialImageLabel = () => {
    return widgetData.language === 'da' ? 'Kundebillede URL (valgfrit)' : 'Kundebilde URL (valgfritt)';
  };

  const getShowTestimonialLabel = () => {
    return widgetData.language === 'da' ? 'Vis kundeudtalelse' : 'Vis kundevurdering';
  };

  const sectionTabStyle = (section) => 
    `px-4 py-2 font-medium rounded-t-lg text-sm transition-colors ${
      activeSection === section 
        ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Widget konfiguration</h2>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowImagePreview(!showImagePreview)}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
            title={showImagePreview ? "Skjul billedvisning" : "Vis billedvisning"}
          >
            <SafeIcon icon={showImagePreview ? FiEyeOff : FiEye} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateRandomProduct}
            className="flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200 py-2 px-3 rounded-md"
            title="Generer tilfældigt produkt"
          >
            <SafeIcon icon={FiShuffle} />
            <span className="hidden sm:inline">Tilfældigt produkt</span>
          </motion.button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex px-6 pt-2">
          <button
            className={sectionTabStyle('basic')}
            onClick={() => setActiveSection('basic')}
          >
            Grundlæggende
          </button>
          <button
            className={sectionTabStyle('content')}
            onClick={() => setActiveSection('content')}
          >
            Indhold
          </button>
          <button
            className={sectionTabStyle('design')}
            onClick={() => setActiveSection('design')}
          >
            Design
          </button>
          <button
            className={sectionTabStyle('extras')}
            onClick={() => setActiveSection('extras')}
          >
            Ekstra
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {activeSection === 'basic' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
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
                </select>
              </div>

              {showImagePreview && (
                <div className="relative">
                  {previewLoading ? (
                    <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={widgetData.productImage}
                      alt="Product preview"
                      className="w-full h-40 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop';
                      }}
                    />
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {widgetData.language === 'da' ? 'Produkt billede URL' : 'Produkt bilde URL'} (støtter GIF)
                </label>
                <input
                  type="url"
                  value={widgetData.productImage}
                  onChange={(e) => handleInputChange('productImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg eller .gif"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getProductTitleLabel()}
                </label>
                <input
                  type="text"
                  value={widgetData.productTitle}
                  onChange={(e) => handleInputChange('productTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={widgetData.language === 'da' ? 'Produktnavn' : 'Produktnavn'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getOriginalPriceLabel()}
                  </label>
                  <input
                    type="text"
                    value={widgetData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="129,99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getSalePriceLabel()}
                  </label>
                  <input
                    type="text"
                    value={widgetData.discountedPrice}
                    onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="89,99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getStockStatusLabel()}
                </label>
                <select
                  value={widgetData.stockStatus || 'none'}
                  onChange={(e) => handleInputChange('stockStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {getStockStatusOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {activeSection === 'content' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getProductDescriptionLabel()}
                </label>
                <textarea
                  value={widgetData.productDescription}
                  onChange={(e) => handleInputChange('productDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={widgetData.language === 'da' ? 'Kort produktbeskrivelse...' : 'Kort produktbeskrivelse...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {widgetData.language === 'da' ? 'Egne USP punkter' : 'Egne USP punkter'}
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  {widgetData.language === 'da' ? 'Disse vil blive vist i produktbeskrivelsen med grønne flueben' : 'Disse vil bli vist i produktbeskrivelsen med grønne haker'}
                </p>
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={newCustomUsp}
                    onChange={(e) => setNewCustomUsp(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={getCustomUspPlaceholder()}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomUsp()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addCustomUsp}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                  >
                    {getAddButtonText()}
                  </motion.button>
                </div>
                <div className="space-y-2 mt-2">
                  {widgetData.customUsps.map((usp, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="flex items-center">
                        <div className="cursor-move mr-2 text-gray-400">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor" />
                          </svg>
                        </div>
                        <SafeIcon icon={FiCheck} className="text-green-500 mr-2" />
                        <span className="text-sm">{usp}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeCustomUsp(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <SafeIcon icon={FiX} />
                      </motion.button>
                    </motion.div>
                  ))}
                  {widgetData.customUsps.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                      {widgetData.language === 'da' ? 'Ingen USP punkter tilføjet endnu' : 'Ingen USP-punkter lagt til ennå'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getButtonTextLabel()}
                </label>
                <input
                  type="text"
                  value={widgetData.ctaText}
                  onChange={(e) => handleInputChange('ctaText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={getButtonTextPlaceholder()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getAffiliateLinkLabel()}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={widgetData.affiliateLink}
                  onChange={(e) => handleInputChange('affiliateLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://affiliate-link.com"
                  required
                />
                <p className="text-xs text-red-500 mt-1">
                  {widgetData.language === 'da' ? 'Dette felt er påkrævet' : 'Dette feltet er påkrevd'}
                </p>
              </div>
            </motion.div>
          )}

          {activeSection === 'design' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {widgetData.language === 'da' ? 'Farveskemaer' : 'Fargepalett'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {colorPalettes.map((palette, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ y: -3, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ y: 0 }}
                      onClick={() => applyColorPalette(palette)}
                      className="p-2 border border-gray-200 rounded-md transition-all"
                      style={{ backgroundColor: palette.backgroundColor }}
                    >
                      <div 
                        className="h-8 rounded-md mb-1"
                        style={{ backgroundColor: palette.buttonColor }}
                      ></div>
                      <div 
                        className="text-xs font-medium text-center"
                        style={{ color: palette.textColor }}
                      >
                        {palette.name}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {widgetData.language === 'da' ? 'Baggrundsfarve' : 'Bakgrunnsfarge'}
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
                    {widgetData.language === 'da' ? 'Knapfarve' : 'Knappfarge'}
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={widgetData.buttonColor}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={widgetData.buttonColor}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {widgetData.language === 'da' ? 'Tekstfarve' : 'Tekstfarge'}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  USPs
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  {widgetData.language === 'da' ? 'Disse vil blive vist under køb-knappen' : 'Disse vil bli vist under kjøp-knappen'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getUspsForLanguage().map((usp, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`usp-${index}`}
                        checked={widgetData.usps.includes(usp)}
                        onChange={() => handleUspChange(usp)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`usp-${index}`} className="text-sm text-gray-700">
                        {usp}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'extras' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Shipping Countdown Option */}
              <div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="showShippingCountdown"
                    checked={widgetData.showShippingCountdown || false}
                    onChange={(e) => handleInputChange('showShippingCountdown', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showShippingCountdown" className="text-sm font-medium text-gray-700 flex items-center">
                    <SafeIcon icon={FiClock} className="mr-2 text-blue-500" />
                    {getShippingCountdownLabel()}
                  </label>
                </div>
                {widgetData.showShippingCountdown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="pl-6"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {widgetData.language === 'da' ? 'Afsendelses deadline (HH:MM)' : 'Forsendelse deadline (HH:MM)'}
                    </label>
                    <input
                      type="time"
                      value={widgetData.shippingDeadline || '15:00'}
                      onChange={(e) => handleInputChange('shippingDeadline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {widgetData.language === 'da' ? 'Viser: "Afsendes i dag, hvis du bestiller inden [tid]"' : 'Viser: "Sendes i dag hvis du bestiller før [tid]"'}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Customer Testimonial */}
              <div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="showTestimonial"
                    checked={widgetData.showTestimonial || false}
                    onChange={(e) => handleInputChange('showTestimonial', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showTestimonial" className="text-sm font-medium text-gray-700 flex items-center">
                    <SafeIcon icon={FiUser} className="mr-2 text-blue-500" />
                    {getShowTestimonialLabel()}
                  </label>
                </div>
                {widgetData.showTestimonial && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 pl-6 pt-2"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTestimonialLabel()}
                      </label>
                      <textarea
                        value={widgetData.testimonialText || ''}
                        onChange={(e) => handleInputChange('testimonialText', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={getTestimonialPlaceholder()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTestimonialNameLabel()}
                      </label>
                      <input
                        type="text"
                        value={widgetData.testimonialName || ''}
                        onChange={(e) => handleInputChange('testimonialName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTestimonialImageLabel()}
                      </label>
                      <input
                        type="url"
                        value={widgetData.testimonialImage || ''}
                        onChange={(e) => handleInputChange('testimonialImage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/customer-image.jpg"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Payment Icons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {widgetData.language === 'da' ? 'Betalingsikoner' : 'Betalingsikoner'}
                </label>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showApplePay"
                      checked={widgetData.showApplePay || false}
                      onChange={(e) => handleInputChange('showApplePay', e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showApplePay" className="text-sm text-gray-700 flex items-center">
                      <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650976581-apple%20pay.jpg" alt="Apple Pay" className="h-6 mr-1" />
                      Apple Pay
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showGooglePay"
                      checked={widgetData.showGooglePay || false}
                      onChange={(e) => handleInputChange('showGooglePay', e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showGooglePay" className="text-sm text-gray-700 flex items-center">
                      <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650984809-google%20pay.png" alt="Google Pay" className="h-6 mr-1" />
                      Google Pay
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showMobilePay"
                      checked={widgetData.showMobilePay || false}
                      onChange={(e) => handleInputChange('showMobilePay', e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showMobilePay" className="text-sm text-gray-700 flex items-center">
                      <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650992093-mobilepay.webp" alt="MobilePay" className="h-6 mr-1" />
                      MobilePay
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  {showAdvancedOptions ? (
                    <>
                      <SafeIcon icon={FiChevronUp} className="mr-1" />
                      {widgetData.language === 'da' ? 'Skjul avancerede indstillinger' : 'Skjul avanserte innstillinger'}
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiChevronDown} className="mr-1" />
                      {widgetData.language === 'da' ? 'Vis avancerede indstillinger' : 'Vis avanserte innstillinger'}
                    </>
                  )}
                </button>
              </div>

              {showAdvancedOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="pt-2 border-t border-gray-200"
                >
                  <p className="text-sm text-gray-600 mb-3">
                    {widgetData.language === 'da' ? 'Avancerede indstillinger kommer snart...' : 'Avanserte innstillinger kommer snart...'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          <div className="pt-4 mt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveWidget}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <SafeIcon icon={FiSave} />
              {getSaveButtonText()}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WidgetForm;