import React, { useState } from 'react';
import { FiSave, FiPlus, FiX, FiCheck, FiClock, FiUser, FiRefreshCw } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const WidgetForm = ({ widgetData, setWidgetData, saveWidget, showCode, editMode, resetForm }) => {
  const [newCustomUsp, setNewCustomUsp] = useState('');

  const handleInputChange = (field, value) => {
    setWidgetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const getUspsForLanguage = () => {
    switch(widgetData.language) {
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
    return widgetData.language === 'da' ? 'Tilbudspris (DKK) - Valgfrit' : 'Tilbudspris (NOK) - Valgfritt';
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
    return editMode 
      ? (widgetData.language === 'da' ? 'Opdater widget' : 'Oppdater widget')
      : (widgetData.language === 'da' ? 'Gem widget' : 'Lagre widget');
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

  const getResetButtonText = () => {
    return widgetData.language === 'da' ? 'Nulstil formular' : 'Nullstill skjema';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Widget konfiguration</h2>
          {editMode && (
            <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {widgetData.language === 'da' ? 'Redigerer eksisterende widget' : 'Redigerer eksisterende widget'}
            </div>
          )}
        </div>
      </div>
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
          </select>
        </div>

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

        {/* Stock Status */}
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

        {/* Custom USPs moved here between pricing and button text */}
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
            <button
              onClick={addCustomUsp}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              {getAddButtonText()}
            </button>
          </div>
          <div className="space-y-2 mt-2">
            {widgetData.customUsps.map((usp, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="text-green-500 mr-2" />
                  <span className="text-sm">{usp}</span>
                </div>
                <button
                  onClick={() => removeCustomUsp(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <SafeIcon icon={FiX} />
                </button>
              </div>
            ))}
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
            <div>
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
            </div>
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
            <div className="space-y-3 pl-6 pt-2">
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
            </div>
          )}
        </div>

        {/* Payment Icons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {widgetData.language === 'da' ? 'Betalingsikoner' : 'Betalingsikoner'}
          </label>
          <div className="flex items-center space-x-4 mt-2">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            USPs
          </label>
          <p className="text-xs text-gray-500 mb-3">
            {widgetData.language === 'da' ? 'Disse vil blive vist under køb-knappen' : 'Disse vil bli vist under kjøp-knappen'}
          </p>
          <div className="space-y-2 mb-4">
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

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {widgetData.language === 'da' ? 'Baggrundsfarve' : 'Bakgrunnsfarge'}
            </label>
            <input
              type="color"
              value={widgetData.backgroundColor}
              onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {widgetData.language === 'da' ? 'Knapfarve' : 'Knappfarge'}
            </label>
            <input
              type="color"
              value={widgetData.buttonColor}
              onChange={(e) => handleInputChange('buttonColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {widgetData.language === 'da' ? 'Tekstfarve' : 'Tekstfarge'}
            </label>
            <input
              type="color"
              value={widgetData.textColor}
              onChange={(e) => handleInputChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={saveWidget}
            className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiSave} />
            {getSaveButtonText()}
          </button>
          
          <button
            onClick={resetForm}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
            title={widgetData.language === 'da' ? 'Nulstil formular' : 'Nullstill skjema'}
          >
            <SafeIcon icon={FiRefreshCw} />
            <span className="hidden md:inline">{getResetButtonText()}</span>
          </button>
        </div>
        
        {editMode && (
          <p className="text-xs text-blue-600 mt-2 text-center">
            {widgetData.language === 'da' 
              ? 'Alle indlejrede widgets vil automatisk blive opdateret med de seneste ændringer, når du opdaterer.' 
              : 'Alle innebygde widgets vil automatisk bli oppdatert med de siste endringene når du oppdaterer.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default WidgetForm;