import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLink, FiCopy, FiCheck, FiEye, FiEyeOff, FiSave, 
  FiRefreshCw, FiChevronDown, FiChevronUp, FiExternalLink,
  FiImage, FiType, FiGrid, FiLayers
} from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const TextLinkGenerator = () => {
  const [linkData, setLinkData] = useState({
    // Basic link settings
    linkText: 'Få 20% rabat på alle produkter',
    affiliateLink: 'https://example.com/affiliate-special-offer',
    textColor: '#2563eb',
    hoverColor: '#1d4ed8',
    fontSize: 16,
    fontWeight: 'semibold',
    underline: true,
    icon: true,
    animation: 'none',
    style: 'default',
    language: 'da',
    
    // Enhanced options
    showHeadline: false,
    headline: 'Eksklusivt tilbud',
    headlineSize: 18,
    headlineWeight: 'bold',
    headlineColor: '#111827',
    
    showProductImage: false,
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    imageSize: 'medium', // small, medium, large
    imageShape: 'rounded', // rounded, circle, square
    
    showBackground: false,
    backgroundColor: '#f3f4f6',
    backgroundPadding: 16,
    borderRadius: 8,
    
    // Advanced settings
    trackingId: '',
    showBorder: false,
    borderColor: '#e5e7eb',
    padding: 0,
    openInNewTab: true,
    addNofollow: true
  });

  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [generatedCode, setGeneratedCode] = useState({ html: '' });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showEnhancedOptions, setShowEnhancedOptions] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState('');
  const [activeDesignTab, setActiveDesignTab] = useState('link');
  const [imageError, setImageError] = useState(false);

  const linkStyles = [
    { name: 'default', label: 'Standard' },
    { name: 'underlineGrow', label: 'Voksende understregning' },
    { name: 'highlightExpand', label: 'Fremhævning' },
    { name: 'arrowAnimation', label: 'Pil animation' },
    { name: 'glow', label: 'Glødende' },
    { name: 'button', label: 'Knap' }
  ];

  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Medium' },
    { value: 'semibold', label: 'Semi-fed' },
    { value: 'bold', label: 'Fed' }
  ];

  const animations = [
    { value: 'none', label: 'Ingen' },
    { value: 'pulse', label: 'Pulserende' },
    { value: 'shake', label: 'Ryste' },
    { value: 'bounce', label: 'Hoppe' }
  ];

  const imageSizes = [
    { value: 'small', label: 'Lille', dimensions: '40px' },
    { value: 'medium', label: 'Medium', dimensions: '60px' },
    { value: 'large', label: 'Stor', dimensions: '80px' }
  ];

  const imageShapes = [
    { value: 'rounded', label: 'Afrundet' },
    { value: 'circle', label: 'Cirkel' },
    { value: 'square', label: 'Firkantet' }
  ];

  const handleInputChange = (field, value) => {
    setLinkData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateCode = () => {
    const html = generateLinkHTML();
    setGeneratedCode({ html });
    setShowCode(true);
    
    // Generate preview HTML
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="${linkData.language || 'da'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Link Preview</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f9fafb;
          }
          .preview-container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            max-width: 500px;
            width: 100%;
          }
          .content-block {
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="content-block">
            <p>Her er et eksempel på hvordan dit affiliate link vil se ud i en artikel:</p>
          </div>
          <div class="content-block">
            <p>Leder du efter gode tilbud? ${html} og få de bedste priser på markedet.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    setPreviewHTML(fullHTML);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const generateLinkHTML = () => {
    // Generate unique class name based on current timestamp
    const uniqueClassName = `affiliate-link-${Date.now().toString().slice(-6)}`;
    const containerClassName = `affiliate-container-${Date.now().toString().slice(-6)}`;
    
    // Generate inline styles for the link
    let linkStyles = `color: ${linkData.textColor}; font-size: ${linkData.fontSize}px; `;
    linkStyles += `text-decoration: ${linkData.underline ? 'underline' : 'none'}; `;
    linkStyles += `font-weight: ${linkData.fontWeight === 'normal' ? '400' : 
                  linkData.fontWeight === 'medium' ? '500' : 
                  linkData.fontWeight === 'semibold' ? '600' : '700'}; `;
    linkStyles += `transition: all 0.3s ease; display: inline-flex; align-items: center; position: relative; cursor: pointer; `;
    
    // Add background, border and padding styles if applicable
    if (linkData.showBackground && !linkData.showProductImage && !linkData.showHeadline) {
      linkStyles += `background-color: ${linkData.backgroundColor}; `;
    }
    if (linkData.showBorder && !linkData.showProductImage && !linkData.showHeadline) {
      linkStyles += `border: 1px solid ${linkData.borderColor}; `;
    }
    if (linkData.padding > 0 && !linkData.showProductImage && !linkData.showHeadline) {
      linkStyles += `padding: ${linkData.padding}px; `;
    }
    if ((linkData.showBackground || linkData.showBorder) && !linkData.showProductImage && !linkData.showHeadline) {
      linkStyles += `border-radius: ${linkData.borderRadius}px; `;
    }
    
    // Generate container styles if using enhanced features
    let containerStyles = '';
    if (linkData.showBackground || linkData.showProductImage || linkData.showHeadline) {
      containerStyles = `display: ${linkData.showProductImage ? 'flex' : 'block'}; align-items: center; `;
      containerStyles += linkData.showBackground ? `background-color: ${linkData.backgroundColor}; ` : '';
      containerStyles += linkData.showBorder ? `border: 1px solid ${linkData.borderColor}; ` : '';
      containerStyles += (linkData.showBackground || linkData.showBorder) ? `border-radius: ${linkData.borderRadius}px; ` : '';
      containerStyles += linkData.backgroundPadding > 0 ? `padding: ${linkData.backgroundPadding}px; ` : '';
      containerStyles += `width: fit-content; max-width: 100%; `;
    }
    
    // Generate image container styles
    let imageStyles = '';
    if (linkData.showProductImage) {
      const size = imageSizes.find(s => s.value === linkData.imageSize)?.dimensions || '60px';
      imageStyles = `width: ${size}; height: ${size}; margin-right: 12px; flex-shrink: 0; `;
    }
    
    // Generate image styles
    let imgStyles = '';
    if (linkData.showProductImage) {
      imgStyles = 'width: 100%; height: 100%; object-fit: cover; ';
      switch (linkData.imageShape) {
        case 'circle':
          imgStyles += 'border-radius: 50%; ';
          break;
        case 'rounded':
          imgStyles += 'border-radius: 8px; ';
          break;
        default:
          imgStyles += 'border-radius: 0; ';
          break;
      }
    }
    
    // Generate headline styles
    let headlineStyles = '';
    if (linkData.showHeadline) {
      headlineStyles = `font-size: ${linkData.headlineSize}px; `;
      headlineStyles += `font-weight: ${linkData.headlineWeight === 'normal' ? '400' : 
                        linkData.headlineWeight === 'medium' ? '500' : 
                        linkData.headlineWeight === 'semibold' ? '600' : '700'}; `;
      headlineStyles += `color: ${linkData.headlineColor}; margin: 0 0 4px 0; `;
    }
    
    // Generate content container styles
    let contentStyles = '';
    if (linkData.showProductImage || linkData.showHeadline) {
      contentStyles = 'display: flex; flex-direction: column; ';
    }
    
    // Generate animation styles
    let animationStyles = '';
    let animationKeyframes = '';
    if (linkData.animation !== 'none') {
      switch (linkData.animation) {
        case 'pulse':
          animationKeyframes = `
            @keyframes pulse-${uniqueClassName} {
              0% { opacity: 1; }
              50% { opacity: 0.7; }
              100% { opacity: 1; }
            }
          `;
          animationStyles = `animation: pulse-${uniqueClassName} 2s infinite; `;
          break;
        case 'shake':
          animationKeyframes = `
            @keyframes shake-${uniqueClassName} {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
              20%, 40%, 60%, 80% { transform: translateX(2px); }
            }
          `;
          // We'll add this on hover in the link
          break;
        case 'bounce':
          animationKeyframes = `
            @keyframes bounce-${uniqueClassName} {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
          `;
          // We'll add this on hover in the link
          break;
      }
    }
    
    // Add styles for different link types
    let additionalStyles = '';
    let pseudoElementStyles = '';
    switch (linkData.style) {
      case 'underlineGrow':
        linkStyles += 'text-decoration: none; ';
        pseudoElementStyles = `
          <style>
            #${uniqueClassName}::after {
              content: '';
              display: block;
              height: 2px;
              width: 0;
              background-color: ${linkData.hoverColor};
              transition: width 0.3s;
              position: absolute;
              bottom: -2px;
              left: 0;
            }
            #${uniqueClassName}:hover::after {
              width: 100%;
            }
          </style>
        `;
        break;
      case 'highlightExpand':
        linkStyles += 'text-decoration: none; position: relative; z-index: 1; ';
        pseudoElementStyles = `
          <style>
            #${uniqueClassName}::before {
              content: '';
              position: absolute;
              z-index: -1;
              height: 30%;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: ${linkData.hoverColor}30;
              transition: height 0.3s ease;
            }
            #${uniqueClassName}:hover::before {
              height: 100%;
            }
          </style>
        `;
        break;
      case 'arrowAnimation':
        linkStyles += 'text-decoration: none; ';
        pseudoElementStyles = `
          <style>
            #${uniqueClassName} .arrow {
              display: inline-block;
              margin-left: 5px;
              transition: transform 0.3s ease;
            }
            #${uniqueClassName}:hover .arrow {
              transform: translateX(3px);
            }
          </style>
        `;
        break;
      case 'glow':
        linkStyles += 'text-decoration: none; text-shadow: 0 0 0 transparent; transition: text-shadow 0.3s ease; ';
        pseudoElementStyles = `
          <style>
            #${uniqueClassName}:hover {
              text-shadow: 0 0 10px ${linkData.textColor}80;
            }
          </style>
        `;
        break;
      case 'button':
        linkStyles += 'text-decoration: none; padding: 6px 12px; border-radius: 4px; ';
        linkStyles += `background-color: ${linkData.textColor}; color: white; transition: background-color 0.3s ease; `;
        pseudoElementStyles = `
          <style>
            #${uniqueClassName}:hover {
              background-color: ${linkData.hoverColor};
              color: white;
            }
          </style>
        `;
        break;
    }
    
    // Add animation hover effects
    if (linkData.animation === 'shake') {
      pseudoElementStyles += `
        <style>
          #${uniqueClassName}:hover {
            animation: shake-${uniqueClassName} 0.5s;
          }
        </style>
      `;
    } else if (linkData.animation === 'bounce') {
      pseudoElementStyles += `
        <style>
          #${uniqueClassName}:hover {
            animation: bounce-${uniqueClassName} 0.5s;
          }
        </style>
      `;
    }
    
    // Add hover color
    pseudoElementStyles += `
      <style>
        #${uniqueClassName}:hover {
          color: ${linkData.hoverColor};
        }
        ${animationKeyframes}
      </style>
    `;
    
    // Create the icon element if enabled
    const iconElement = linkData.icon && linkData.style !== 'arrowAnimation' ? 
      `<svg style="width: 1em; height: 1em; margin-left: 0.3em;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>` : '';
    
    // Create arrow element for arrow animation style
    const arrowElement = linkData.style === 'arrowAnimation' ? 
      `<span class="arrow">→</span>` : '';
    
    // Build tracking URL if tracking ID is provided
    let finalUrl = linkData.affiliateLink;
    if (linkData.trackingId) {
      // Add tracking parameter based on URL structure
      const hasParams = finalUrl.includes('?');
      finalUrl = `${finalUrl}${hasParams ? '&' : '?'}utm_source=affiliate&utm_medium=link&utm_campaign=${encodeURIComponent(linkData.trackingId)}`;
    }
    
    // Build rel attribute
    const relAttribute = linkData.addNofollow ? 'rel="nofollow"' : '';
    
    // Build target attribute
    const targetAttribute = linkData.openInNewTab ? 'target="_blank"' : '';
    
    // Create the link HTML
    const linkHTML = `<a href="${finalUrl}" id="${uniqueClassName}" style="${linkStyles}" ${targetAttribute} ${relAttribute}>${linkData.linkText}${arrowElement}${iconElement}</a>`;
    
    // Create the final HTML with or without container
    let html;
    if (linkData.showProductImage || linkData.showHeadline || linkData.showBackground) {
      html = `<div style="${containerStyles}">
        ${linkData.showProductImage ? `<div style="${imageStyles}"><img src="${linkData.productImage}" style="${imgStyles}" alt="" onerror="this.src='https://via.placeholder.com/60'"></div>` : ''}
        <div style="${contentStyles}">
          ${linkData.showHeadline ? `<h3 style="${headlineStyles}">${linkData.headline}</h3>` : ''}
          ${linkHTML}
        </div>
      </div>`;
    } else {
      html = linkHTML;
    }
    
    // Add all the styles
    return pseudoElementStyles + html;
  };

  const getImageSizeStyle = () => {
    const size = imageSizes.find(s => s.value === linkData.imageSize)?.dimensions || '60px';
    return `
      width: ${size};
      height: ${size};
    `;
  };

  const getImageBorderRadiusStyle = () => {
    switch (linkData.imageShape) {
      case 'circle':
        return 'border-radius: 50%;';
      case 'rounded':
        return 'border-radius: 8px;';
      default:
        return 'border-radius: 0;';
    }
  };

  const getStyleLabel = (styleName) => {
    const style = linkStyles.find(s => s.name === styleName);
    return style ? style.label : 'Standard';
  };

  const getFontWeightLabel = (weight) => {
    const fontWeight = fontWeights.find(w => w.value === weight);
    return fontWeight ? fontWeight.label : 'Normal';
  };

  const getAnimationLabel = (animation) => {
    const anim = animations.find(a => a.value === animation);
    return anim ? anim.label : 'Ingen';
  };

  const getImageSizeLabel = (size) => {
    const imageSize = imageSizes.find(s => s.value === size);
    return imageSize ? imageSize.label : 'Medium';
  };

  const getImageShapeLabel = (shape) => {
    const imageShape = imageShapes.find(s => s.value === shape);
    return imageShape ? imageShape.label : 'Afrundet';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Affiliate Text Link Generator</h1>
        <p className="text-gray-600 mt-2">
          Skab smukke, engagerende tekstlinks som alternativer til almindelige links. Perfekt til diskret affiliate markedsføring.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Link konfiguration</h2>
          
          <div className="flex mb-6 border-b border-gray-200">
            <button
              className={`px-4 py-2 flex items-center ${activeDesignTab === 'link' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveDesignTab('link')}
            >
              <SafeIcon icon={FiLink} className="mr-2" />
              Link
            </button>
            <button
              className={`px-4 py-2 flex items-center ${activeDesignTab === 'enhanced' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveDesignTab('enhanced')}
            >
              <SafeIcon icon={FiLayers} className="mr-2" />
              Udvidet
            </button>
          </div>
          
          {activeDesignTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sprog
                </label>
                <select
                  value={linkData.language}
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
                  Link tekst
                </label>
                <input
                  type="text"
                  value={linkData.linkText}
                  onChange={(e) => handleInputChange('linkText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="f.eks. Få 20% rabat på alle produkter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affiliate link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={linkData.affiliateLink}
                  onChange={(e) => handleInputChange('affiliateLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/affiliate-link"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link stil
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {linkStyles.map(style => (
                    <div 
                      key={style.name}
                      className={`border rounded-md p-3 cursor-pointer transition-all ${
                        linkData.style === style.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('style', style.name)}
                    >
                      <div className="text-center text-sm font-medium">{style.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tekst farve
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={linkData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={linkData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hover farve
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={linkData.hoverColor}
                      onChange={(e) => handleInputChange('hoverColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={linkData.hoverColor}
                      onChange={(e) => handleInputChange('hoverColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skriftstørrelse (px)
                  </label>
                  <input
                    type="number"
                    value={linkData.fontSize}
                    onChange={(e) => handleInputChange('fontSize', parseInt(e.target.value) || 16)}
                    min="12"
                    max="36"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skrifttykkelse
                  </label>
                  <select
                    value={linkData.fontWeight}
                    onChange={(e) => handleInputChange('fontWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {fontWeights.map(weight => (
                      <option key={weight.value} value={weight.value}>{weight.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="underline"
                    checked={linkData.underline}
                    onChange={(e) => handleInputChange('underline', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="underline" className="text-sm font-medium text-gray-700">
                    Understregning
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="icon"
                    checked={linkData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="icon" className="text-sm font-medium text-gray-700">
                    Vis ikon
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animation
                </label>
                <select
                  value={linkData.animation}
                  onChange={(e) => handleInputChange('animation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {animations.map(animation => (
                    <option key={animation.value} value={animation.value}>{animation.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} 
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  {showAdvancedOptions ? (
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

              {showAdvancedOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="pt-2 border-t border-gray-200 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking ID (valgfrit)
                    </label>
                    <input
                      type="text"
                      value={linkData.trackingId}
                      onChange={(e) => handleInputChange('trackingId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="f.eks. spring-campaign-2023"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tilføjer UTM parametre til dit link for bedre tracking
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="openInNewTab"
                        checked={linkData.openInNewTab}
                        onChange={(e) => handleInputChange('openInNewTab', e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="openInNewTab" className="text-sm font-medium text-gray-700">
                        Åbn i nyt faneblad
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="addNofollow"
                        checked={linkData.addNofollow}
                        onChange={(e) => handleInputChange('addNofollow', e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="addNofollow" className="text-sm font-medium text-gray-700">
                        Tilføj nofollow
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showBorder"
                        checked={linkData.showBorder}
                        onChange={(e) => handleInputChange('showBorder', e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showBorder" className="text-sm font-medium text-gray-700">
                        Vis kant
                      </label>
                    </div>
                  </div>

                  {linkData.showBorder && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kant farve
                      </label>
                      <div className="flex">
                        <input
                          type="color"
                          value={linkData.borderColor}
                          onChange={(e) => handleInputChange('borderColor', e.target.value)}
                          className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={linkData.borderColor}
                          onChange={(e) => handleInputChange('borderColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {!linkData.showProductImage && !linkData.showHeadline && !linkData.showBackground && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Padding (px)
                      </label>
                      <input
                        type="number"
                        value={linkData.padding}
                        onChange={(e) => handleInputChange('padding', parseInt(e.target.value) || 0)}
                        min="0"
                        max="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {activeDesignTab === 'enhanced' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showHeadline"
                    checked={linkData.showHeadline}
                    onChange={(e) => handleInputChange('showHeadline', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showHeadline" className="text-sm font-medium text-gray-700 flex items-center">
                    <SafeIcon icon={FiType} className="mr-2 text-blue-500" />
                    Vis overskrift
                  </label>
                </div>
              </div>

              {linkData.showHeadline && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="pl-6 space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overskrift tekst
                    </label>
                    <input
                      type="text"
                      value={linkData.headline}
                      onChange={(e) => handleInputChange('headline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="f.eks. Eksklusivt tilbud"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Størrelse (px)
                      </label>
                      <input
                        type="number"
                        value={linkData.headlineSize}
                        onChange={(e) => handleInputChange('headlineSize', parseInt(e.target.value) || 18)}
                        min="14"
                        max="32"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tykkelse
                      </label>
                      <select
                        value={linkData.headlineWeight}
                        onChange={(e) => handleInputChange('headlineWeight', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {fontWeights.map(weight => (
                          <option key={weight.value} value={weight.value}>{weight.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farve
                      </label>
                      <div className="flex">
                        <input
                          type="color"
                          value={linkData.headlineColor}
                          onChange={(e) => handleInputChange('headlineColor', e.target.value)}
                          className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={linkData.headlineColor}
                          onChange={(e) => handleInputChange('headlineColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showProductImage"
                    checked={linkData.showProductImage}
                    onChange={(e) => handleInputChange('showProductImage', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showProductImage" className="text-sm font-medium text-gray-700 flex items-center">
                    <SafeIcon icon={FiImage} className="mr-2 text-blue-500" />
                    Vis produktbillede
                  </label>
                </div>
              </div>

              {linkData.showProductImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="pl-6 space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billede URL
                    </label>
                    <input
                      type="url"
                      value={linkData.productImage}
                      onChange={(e) => handleInputChange('productImage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  {linkData.productImage && (
                    <div className="flex justify-center mb-2">
                      <div className={`
                        border border-gray-200 overflow-hidden
                        ${linkData.imageShape === 'circle' ? 'rounded-full' : linkData.imageShape === 'rounded' ? 'rounded-lg' : ''}
                      `} style={{
                        width: imageSizes.find(s => s.value === linkData.imageSize)?.dimensions || '60px',
                        height: imageSizes.find(s => s.value === linkData.imageSize)?.dimensions || '60px',
                      }}>
                        <img 
                          src={imageError ? 'https://via.placeholder.com/60' : linkData.productImage}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Størrelse
                      </label>
                      <select
                        value={linkData.imageSize}
                        onChange={(e) => handleInputChange('imageSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {imageSizes.map(size => (
                          <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Form
                      </label>
                      <select
                        value={linkData.imageShape}
                        onChange={(e) => handleInputChange('imageShape', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {imageShapes.map(shape => (
                          <option key={shape.value} value={shape.value}>{shape.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showBackground"
                    checked={linkData.showBackground}
                    onChange={(e) => handleInputChange('showBackground', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showBackground" className="text-sm font-medium text-gray-700 flex items-center">
                    <SafeIcon icon={FiGrid} className="mr-2 text-blue-500" />
                    Vis baggrund
                  </label>
                </div>
              </div>

              {linkData.showBackground && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="pl-6 space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Baggrundsfarve
                    </label>
                    <div className="flex">
                      <input
                        type="color"
                        value={linkData.backgroundColor}
                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                        className="w-10 h-10 border border-gray-300 rounded-l-md cursor-pointer"
                      />
                      <input
                        type="text"
                        value={linkData.backgroundColor}
                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Padding (px)
                      </label>
                      <input
                        type="number"
                        value={linkData.backgroundPadding}
                        onChange={(e) => handleInputChange('backgroundPadding', parseInt(e.target.value) || 0)}
                        min="0"
                        max="40"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Afrundede hjørner (px)
                      </label>
                      <input
                        type="number"
                        value={linkData.borderRadius}
                        onChange={(e) => handleInputChange('borderRadius', parseInt(e.target.value) || 0)}
                        min="0"
                        max="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <div className="pt-4 mt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateCode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <SafeIcon icon={FiSave} />
              Generer link kode
            </motion.button>
          </div>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Forhåndsvisning</h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <SafeIcon icon={showPreview ? FiEyeOff : FiEye} className="mr-1" />
                  {showPreview ? 'Skjul live preview' : 'Vis live preview'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: isRefreshing ? 0.5 : 0.2 }}
                  onClick={handleRefresh}
                  className="text-blue-600 hover:text-blue-800 p-2"
                  title="Opdater forhåndsvisning"
                >
                  <SafeIcon icon={FiRefreshCw} />
                </motion.button>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="mb-4 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500">Link stil:</h3>
                  <span className="text-sm text-gray-700">{getStyleLabel(linkData.style)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500">Skrifttykkelse:</h3>
                  <span className="text-sm text-gray-700">{getFontWeightLabel(linkData.fontWeight)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500">Animation:</h3>
                  <span className="text-sm text-gray-700">{getAnimationLabel(linkData.animation)}</span>
                </div>
                {linkData.showProductImage && (
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500">Billede størrelse:</h3>
                    <span className="text-sm text-gray-700">{getImageSizeLabel(linkData.imageSize)}</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">Her er et eksempel på hvordan dit affiliate link vil se ud:</p>
                
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-gray-800">
                    Leder du efter gode tilbud? 
                    
                    {linkData.showProductImage || linkData.showHeadline || linkData.showBackground ? (
                      <div 
                        className="inline-flex my-2"
                        style={{
                          backgroundColor: linkData.showBackground ? linkData.backgroundColor : 'transparent',
                          border: linkData.showBorder ? `1px solid ${linkData.borderColor}` : 'none',
                          borderRadius: `${linkData.borderRadius}px`,
                          padding: linkData.showBackground ? `${linkData.backgroundPadding}px` : '0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          verticalAlign: 'middle'
                        }}
                      >
                        {linkData.showProductImage && (
                          <div 
                            className="mr-3"
                            style={{
                              width: imageSizes.find(s => s.value === linkData.imageSize)?.dimensions || '60px',
                              height: imageSizes.find(s => s.value === linkData.imageSize)?.dimensions || '60px',
                              borderRadius: linkData.imageShape === 'circle' ? '50%' : 
                                          linkData.imageShape === 'rounded' ? '8px' : '0',
                              overflow: 'hidden'
                            }}
                          >
                            <img 
                              src={imageError ? 'https://via.placeholder.com/60' : linkData.productImage} 
                              alt=""
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          </div>
                        )}
                        
                        <div>
                          {linkData.showHeadline && (
                            <h3 
                              style={{
                                fontSize: `${linkData.headlineSize}px`,
                                fontWeight: linkData.headlineWeight === 'normal' ? 400 : 
                                          linkData.headlineWeight === 'medium' ? 500 : 
                                          linkData.headlineWeight === 'semibold' ? 600 : 700,
                                color: linkData.headlineColor,
                                margin: '0 0 4px 0'
                              }}
                            >
                              {linkData.headline}
                            </h3>
                          )}
                          
                          <span 
                            style={{
                              color: linkData.textColor,
                              fontSize: `${linkData.fontSize}px`,
                              fontWeight: linkData.fontWeight === 'normal' ? 400 : 
                                        linkData.fontWeight === 'medium' ? 500 : 
                                        linkData.fontWeight === 'semibold' ? 600 : 700,
                              textDecoration: linkData.underline && linkData.style !== 'underlineGrow' ? 'underline' : 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              position: 'relative',
                              ...(linkData.style === 'button' ? { 
                                backgroundColor: linkData.textColor,
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                textDecoration: 'none'
                              } : {})
                            }}
                          >
                            {linkData.linkText}
                            {linkData.style === 'arrowAnimation' && <span style={{ marginLeft: '5px' }}>→</span>}
                            {linkData.icon && linkData.style !== 'arrowAnimation' && (
                              <svg style={{ width: '1em', height: '1em', marginLeft: '0.3em' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span 
                        className="ml-1 mr-1"
                        style={{
                          color: linkData.textColor,
                          fontSize: `${linkData.fontSize}px`,
                          fontWeight: linkData.fontWeight === 'normal' ? 400 : 
                                    linkData.fontWeight === 'medium' ? 500 : 
                                    linkData.fontWeight === 'semibold' ? 600 : 700,
                          textDecoration: linkData.underline && linkData.style !== 'underlineGrow' ? 'underline' : 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: linkData.showBackground ? linkData.backgroundColor : 'transparent',
                          border: linkData.showBorder ? `1px solid ${linkData.borderColor}` : 'none',
                          padding: linkData.padding > 0 ? `${linkData.padding}px` : '0',
                          borderRadius: (linkData.showBackground || linkData.showBorder) ? `${linkData.borderRadius}px` : '0',
                          cursor: 'pointer',
                          position: 'relative',
                          ...(linkData.style === 'button' ? { 
                            backgroundColor: linkData.textColor,
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            textDecoration: 'none'
                          } : {})
                        }}
                      >
                        {linkData.linkText}
                        {linkData.style === 'arrowAnimation' && <span style={{ marginLeft: '5px' }}>→</span>}
                        {linkData.icon && linkData.style !== 'arrowAnimation' && (
                          <svg style={{ width: '1em', height: '1em', marginLeft: '0.3em' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        )}
                      </span>
                    )}
                    og få de bedste priser på markedet.
                  </p>
                </div>
              </div>
            </div>

            {showPreview && previewHTML && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Live Preview</h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                  <iframe
                    srcDoc={previewHTML}
                    title="Link Preview"
                    className="w-full h-full"
                    frameBorder="0"
                  ></iframe>
                </div>
              </div>
            )}
          </motion.div>

          {showCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Genereret kode
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <SafeIcon icon={FiExternalLink} className="mr-1" />
                  {showPreview ? 'Skjul live preview' : 'Vis live preview'}
                </motion.button>
              </div>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(generatedCode.html)}
                  className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 z-10 flex items-center"
                >
                  <SafeIcon icon={copied ? FiCheck : FiCopy} className="mr-1" />
                  {copied ? 'Kopieret!' : 'Kopier'}
                </motion.button>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
                    <code>{generatedCode.html}</code>
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
                  <strong>Anvendelse:</strong>{' '}
                  Kopier HTML-koden og indsæt den direkte i din artikel eller webside.
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextLinkGenerator;