import React, { useState, useEffect } from 'react';
import WidgetForm from './components/WidgetForm';
import WidgetPreview from './components/WidgetPreview';
import CodeOutput from './components/CodeOutput';
import WidgetHistory from './components/WidgetHistory';
import AnalyticsModal from './components/AnalyticsModal';
import { storeWidgetData } from './utils/codeGenerator';
import './App.css';

function App() {
  const [widgetData, setWidgetData] = useState({
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    productTitle: 'Premium Running Shoes',
    productDescription: 'Experience ultimate comfort and performance with our latest running technology.',
    originalPrice: '129,99',
    discountedPrice: '',
    ctaText: 'Køb nu',
    affiliateLink: 'https://example.com/affiliate-link',
    backgroundColor: '#ffffff',
    buttonColor: '#ff6b6b',
    textColor: '#333333',
    language: 'da',
    usps: [],
    customUsps: [],
    showShippingCountdown: false,
    shippingDeadline: '15:00',
    showApplePay: false,
    showGooglePay: false,
    showMobilePay: false,
    stockStatus: 'none',
    showTestimonial: false,
    testimonialText: '',
    testimonialName: '',
    testimonialImage: ''
  });
  
  const [widgetHistory, setWidgetHistory] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Load widget history and click data from localStorage on component mount
  useEffect(() => {
    // Load widget history
    const savedHistory = localStorage.getItem('widgetHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        
        // Load click data for each widget
        const clickData = JSON.parse(localStorage.getItem('widgetClicks') || '{}');
        
        // Add click counts to widgets
        const widgetsWithClicks = history.map(widget => {
          const widgetClicks = clickData[widget.id] || [];
          return {
            ...widget,
            clicks: widgetClicks.length
          };
        });
        
        setWidgetHistory(widgetsWithClicks);
      } catch (e) {
        console.error('Failed to parse widget history:', e);
      }
    }
  }, []);

  const saveWidget = () => {
    let updatedWidget;
    
    if (editMode) {
      // Update existing widget
      updatedWidget = {
        ...widgetData,
        lastModified: new Date().toISOString()
      };
      
      const updatedHistory = widgetHistory.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      );
      
      setWidgetHistory(updatedHistory);
      setEditMode(false);
    } else {
      // Create new widget
      updatedWidget = {
        ...widgetData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        name: widgetData.productTitle,
        clicks: 0
      };
      
      const updatedHistory = [updatedWidget, ...widgetHistory].slice(0, 20); // Keep only the most recent 20
      setWidgetHistory(updatedHistory);
    }
    
    // Save to localStorage and update stored widget data
    storeWidgetData(updatedWidget);
    
    // Show code after saving
    setShowCode(true);
  };

  const loadWidget = (widget) => {
    setWidgetData(widget);
    setShowCode(false);
    setEditMode(true);
  };

  const deleteWidget = (widgetId) => {
    const updatedHistory = widgetHistory.filter(widget => widget.id !== widgetId);
    setWidgetHistory(updatedHistory);
    localStorage.setItem('widgetHistory', JSON.stringify(updatedHistory));
    
    // Also remove click data for this widget
    try {
      const clickData = JSON.parse(localStorage.getItem('widgetClicks') || '{}');
      delete clickData[widgetId];
      localStorage.setItem('widgetClicks', JSON.stringify(clickData));
    } catch (e) {
      console.error('Failed to update click data:', e);
    }
  };
  
  const viewAnalytics = (widget) => {
    setSelectedWidget(widget);
  };
  
  const closeAnalytics = () => {
    setSelectedWidget(null);
  };

  const resetForm = () => {
    setWidgetData({
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      productTitle: 'Premium Running Shoes',
      productDescription: 'Experience ultimate comfort and performance with our latest running technology.',
      originalPrice: '129,99',
      discountedPrice: '',
      ctaText: 'Køb nu',
      affiliateLink: 'https://example.com/affiliate-link',
      backgroundColor: '#ffffff',
      buttonColor: '#ff6b6b',
      textColor: '#333333',
      language: 'da',
      usps: [],
      customUsps: [],
      showShippingCountdown: false,
      shippingDeadline: '15:00',
      showApplePay: false,
      showGooglePay: false,
      showMobilePay: false,
      stockStatus: 'none',
      showTestimonial: false,
      testimonialText: '',
      testimonialName: '',
      testimonialImage: ''
    });
    setEditMode(false);
    setShowCode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          CTA Widget Generator
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <WidgetForm 
              widgetData={widgetData} 
              setWidgetData={setWidgetData} 
              saveWidget={saveWidget}
              showCode={showCode}
              editMode={editMode}
              resetForm={resetForm}
            />
          </div>
          <div className="space-y-6">
            <WidgetPreview widgetData={widgetData} />
            {showCode && <CodeOutput widgetData={widgetData} />}
          </div>
        </div>
        
        <div className="mt-10">
          <WidgetHistory 
            widgetHistory={widgetHistory} 
            loadWidget={loadWidget} 
            deleteWidget={deleteWidget}
            viewAnalytics={viewAnalytics}
          />
        </div>
      </div>
      
      {selectedWidget && (
        <AnalyticsModal 
          widget={selectedWidget}
          onClose={closeAnalytics}
        />
      )}
    </div>
  );
}

export default App;