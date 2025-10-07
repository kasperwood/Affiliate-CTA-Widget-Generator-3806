import React, { useState, useEffect } from 'react';
import { FiCheck, FiClock, FiUser, FiRefreshCw } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

const WidgetPreview = ({ widgetData }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset image state when URL changes
    setImageLoaded(false);
    setImageError(false);
  }, [widgetData.productImage]);

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

  const discount = widgetData.originalPrice && widgetData.discountedPrice
    ? Math.round(((parseFloat(widgetData.originalPrice.replace(',', '.')) - parseFloat(widgetData.discountedPrice.replace(',', '.'))) / parseFloat(widgetData.originalPrice.replace(',', '.'))) * 100)
    : 0;

  // Calculate absolute savings amount
  const calculateSavings = () => {
    if (!widgetData.originalPrice || !widgetData.discountedPrice) return null;
    const originalPrice = parseFloat(widgetData.originalPrice.replace(',', '.'));
    const discountedPrice = parseFloat(widgetData.discountedPrice.replace(',', '.'));
    if (originalPrice <= discountedPrice) return null;
    const savings = originalPrice - discountedPrice;
    // Format the savings with comma as decimal separator to match Danish/Norwegian format
    return savings.toFixed(2).replace('.', ',');
  };

  const savings = calculateSavings();

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
    return widgetData.language === 'da' ? 'Afsendes i dag, hvis du bestiller inden' : 'Sendes i dag hvis du bestiller før';
  };

  const getSavingsText = () => {
    return widgetData.language === 'da' ? 'Du sparer' : 'Du sparer';
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
    if (!price) return '';
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const stockStatus = getStockStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {widgetData.language === 'da' ? 'Forhåndsvisning' : 'Forhåndsvisning'}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 0 }}
          whileTap={{ scale: 0.9 }}
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: isRefreshing ? 0.5 : 0.2 }}
          onClick={handleRefresh}
          className="text-blue-600 hover:text-blue-800 p-2"
          title={widgetData.language === 'da' ? 'Opdater forhåndsvisning' : 'Oppdater forhåndsvisning'}
        >
          <SafeIcon icon={FiRefreshCw} />
        </motion.button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <motion.div
          className="rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundColor: widgetData.backgroundColor,
            color: widgetData.textColor,
            maxWidth: '400px',
            margin: '0 auto'
          }}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ 
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            translateY: -5
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              {!imageLoaded && !imageError && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-200 flex items-center justify-center"
                >
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <img
              src={widgetData.productImage}
              alt={widgetData.productTitle}
              className="w-full h-48 object-cover"
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                setImageError(true);
                setImageLoaded(true);
                e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop';
              }}
            />
            
            {discount > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold transform origin-center"
              >
                -{discount}%
              </motion.div>
            )}
          </div>
          
          <motion.div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{widgetData.productTitle}</h3>
              {stockStatus && (
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-1.5 ${stockStatus.pulse ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: stockStatus.color }}
                  ></div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: stockStatus.color }}
                  >
                    {stockStatus.text}
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced description with custom USPs */}
            <div className="text-sm opacity-80 mb-3 whitespace-pre-line">
              {getEnhancedDescription()}
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2">
                {widgetData.originalPrice && widgetData.discountedPrice && widgetData.originalPrice !== widgetData.discountedPrice && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm line-through opacity-60"
                  >
                    {formatPrice(widgetData.originalPrice)}
                  </motion.span>
                )}
                {widgetData.discountedPrice && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold"
                  >
                    {formatPrice(widgetData.discountedPrice)}
                  </motion.span>
                )}
              </div>
              
              {/* Display savings amount */}
              {savings && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-green-600 font-medium text-sm mt-1"
                >
                  {getSavingsText()} {savings} kr.
                </motion.div>
              )}
            </div>

            {/* Shipping Countdown */}
            {widgetData.showShippingCountdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center"
              >
                <div className="flex items-center justify-center text-sm text-orange-800">
                  <SafeIcon icon={FiClock} className="mr-2 text-orange-600" />
                  <span className="font-medium">
                    {getShippingText()}
                  </span>
                </div>
                <div className="mt-1 text-lg font-bold text-orange-900">
                  {timeLeft}
                </div>
              </motion.div>
            )}

            {/* Customer Testimonial */}
            {widgetData.showTestimonial && widgetData.testimonialText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg"
              >
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
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ backgroundColor: widgetData.buttonColor }}
              className="w-full text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {getButtonText()}
            </motion.button>

            {/* Payment Icons */}
            {(widgetData.showApplePay || widgetData.showGooglePay || widgetData.showMobilePay) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center items-center space-x-3 mt-3"
              >
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
              </motion.div>
            )}

            {/* Standard USPs below button */}
            {widgetData.usps.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 pt-3 border-t border-gray-200"
              >
                <ul className="space-y-2">
                  {widgetData.usps.map((usp, index) => {
                    const trustBadgeIcon = getTrustBadgeIcon(usp);
                    return (
                      <motion.li
                        key={`usp-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center text-sm"
                      >
                        {trustBadgeIcon ? (
                          <img
                            src={trustBadgeIcon}
                            alt={usp}
                            className="w-4 h-4 mr-2 object-contain"
                          />
                        ) : (
                          <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2 text-green-500" />
                        )}
                        {usp}
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WidgetPreview;