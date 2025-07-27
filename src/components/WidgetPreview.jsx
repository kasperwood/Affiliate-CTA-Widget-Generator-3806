import React, { useState, useEffect } from 'react';
import { FiCheck, FiClock, FiUser, FiMonitor, FiSmartphone } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const WidgetPreview = ({ widgetData }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile'

  useEffect(() => {
    if (!widgetData.showShippingCountdown) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = widgetData.shippingDeadline || '15:00';
      const [hours, minutes] = deadline.split(':').map(Number);
      
      const today = new Date();
      today.setHours(hours, minutes, 0, 0);
      
      // If deadline has passed today, set it for tomorrow
      if (now > today) {
        today.setDate(today.getDate() + 1);
      }
      
      const diff = today.getTime() - now.getTime();
      
      if (diff > 0) {
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
      }
      
      return '00:00:00';
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [widgetData.showShippingCountdown, widgetData.shippingDeadline]);

  // Calculate discount only if both prices exist
  const discount = widgetData.originalPrice && widgetData.discountedPrice && widgetData.discountedPrice.trim() !== '' 
    ? Math.round(((parseFloat(widgetData.originalPrice.replace(',', '.')) - parseFloat(widgetData.discountedPrice.replace(',', '.'))) / parseFloat(widgetData.originalPrice.replace(',', '.'))) * 100)
    : 0;

  const getButtonText = () => {
    if (widgetData.ctaText) return widgetData.ctaText;
    return widgetData.language === 'da' ? 'Køb nu' : 'Kjøp nå';
  };

  const getTrustBadgeIcon = (usp) => {
    if (usp.includes('E-mærket')) {
      return 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650222793-e-markerket.jpg';
    } else if (usp.includes('Tryghedsmærket')) {
      return 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650227304-tryghedsmaerket.png';
    }
    return null;
  };

  const getShippingText = () => {
    return widgetData.language === 'da' 
      ? 'Afsendes i dag, hvis du bestiller inden' 
      : 'Sendes i dag hvis du bestiller før';
  };

  // Enhanced product description with custom USPs
  const getEnhancedDescription = () => {
    let description = widgetData.productDescription;
    
    if (widgetData.customUsps && widgetData.customUsps.length > 0) {
      const uspList = widgetData.customUsps.map(usp => `✓ ${usp}`).join('\n');
      description = description ? `${description}\n\n${uspList}` : uspList;
    }
    
    return description;
  };

  // Format price with kr. only if price exists
  const formatPrice = (price) => {
    if (!price || price.trim() === '') return '';
    return `${price} kr.`;
  };

  // Get stock status text and color
  const getStockStatus = () => {
    switch (widgetData.stockStatus) {
      case 'inStock':
        return {
          text: widgetData.language === 'da' ? 'På lager' : 'På lager',
          color: 'green',
          pulse: true
        };
      case 'lowStock':
        return {
          text: widgetData.language === 'da' ? 'Få på lager' : 'Få på lager',
          color: '#f59e0b', // Amber/yellow
          pulse: true
        };
      default:
        return null;
    }
  };

  const stockStatus = getStockStatus();
  
  // Determine widget width based on view mode
  const getWidgetWidth = () => {
    if (viewMode === 'mobile') {
      return '320px';
    }
    return '400px';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {widgetData.language === 'da' ? 'Forhåndsvisning' : 'Forhåndsvisning'}
        </h2>
        
        {/* Device toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button 
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('desktop')}
            aria-label="Desktop view"
          >
            <SafeIcon icon={FiMonitor} className="text-sm" />
            <span className="text-xs font-medium">Desktop</span>
          </button>
          <button 
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('mobile')}
            aria-label="Mobile view"
          >
            <SafeIcon icon={FiSmartphone} className="text-sm" />
            <span className="text-xs font-medium">Mobil</span>
          </button>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center">
        <div 
          style={{
            backgroundColor: widgetData.backgroundColor,
            color: widgetData.textColor,
            width: getWidgetWidth(),
            transition: 'width 0.3s ease'
          }}
          className="rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative">
            <img 
              src={widgetData.productImage} 
              alt={widgetData.productTitle}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop';
              }}
            />
            {discount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                -{discount}%
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{widgetData.productTitle}</h3>
              
              {stockStatus && (
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-1.5 ${stockStatus.pulse ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: stockStatus.color }}
                  ></div>
                  <span className="text-sm font-medium" style={{ color: stockStatus.color }}>
                    {stockStatus.text}
                  </span>
                </div>
              )}
            </div>
            
            {/* Enhanced description with custom USPs */}
            <div className="text-sm opacity-80 mb-3 whitespace-pre-line">
              {getEnhancedDescription()}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {widgetData.originalPrice && widgetData.discountedPrice && widgetData.discountedPrice.trim() !== '' && (
                  <span className="text-sm line-through opacity-60">
                    {formatPrice(widgetData.originalPrice)}
                  </span>
                )}
                {widgetData.discountedPrice && widgetData.discountedPrice.trim() !== '' ? (
                  <span className="text-xl font-bold">
                    {formatPrice(widgetData.discountedPrice)}
                  </span>
                ) : (
                  <span className="text-xl font-bold">
                    {formatPrice(widgetData.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Shipping Countdown */}
            {widgetData.showShippingCountdown && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <div className="flex items-center justify-center text-sm text-orange-800">
                  <SafeIcon icon={FiClock} className="mr-2 text-orange-600" />
                  <span className="font-medium">
                    {getShippingText()}
                  </span>
                </div>
                <div className="mt-1 text-lg font-bold text-orange-900">
                  {timeLeft}
                </div>
              </div>
            )}
            
            {/* Customer Testimonial */}
            {widgetData.showTestimonial && widgetData.testimonialText && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start space-x-3">
                  {widgetData.testimonialImage ? (
                    <img 
                      src={widgetData.testimonialImage}
                      alt={widgetData.testimonialName || 'Customer'}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
                      <SafeIcon icon={FiUser} className="text-lg" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm italic text-gray-700 mb-1">"{widgetData.testimonialText}"</p>
                    <p className="text-xs font-semibold text-gray-900">
                      {widgetData.testimonialName || (widgetData.language === 'da' ? 'Tilfreds kunde' : 'Fornøyd kunde')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              style={{ backgroundColor: widgetData.buttonColor }}
              className="w-full text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {getButtonText()}
            </button>

            {/* Payment Icons */}
            {(widgetData.showApplePay || widgetData.showGooglePay || widgetData.showMobilePay) && (
              <div className="flex justify-center items-center space-x-3 mt-3">
                {widgetData.showApplePay && (
                  <img 
                    src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650976581-apple%20pay.jpg" 
                    alt="Apple Pay"
                    className="h-6 object-contain" 
                  />
                )}
                {widgetData.showGooglePay && (
                  <img 
                    src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650984809-google%20pay.png" 
                    alt="Google Pay"
                    className="h-6 object-contain" 
                  />
                )}
                {widgetData.showMobilePay && (
                  <img 
                    src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650992093-mobilepay.webp" 
                    alt="MobilePay"
                    className="h-6 object-contain" 
                  />
                )}
              </div>
            )}

            {/* Standard USPs below button */}
            {widgetData.usps.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <ul className="space-y-2">
                  {widgetData.usps.map((usp, index) => {
                    const trustBadgeIcon = getTrustBadgeIcon(usp);
                    return (
                      <li key={`usp-${index}`} className="flex items-center text-sm">
                        {trustBadgeIcon ? (
                          <img src={trustBadgeIcon} alt={usp} className="w-4 h-4 mr-2 object-contain" />
                        ) : (
                          <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2 text-green-500" />
                        )}
                        {usp}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Device indicator */}
      <div className="mt-2 text-center text-xs text-gray-500">
        {viewMode === 'mobile' 
          ? 'Mobil visning (320px bredde)' 
          : 'Desktop visning (400px bredde)'
        }
      </div>
    </div>
  );
};

export default WidgetPreview;