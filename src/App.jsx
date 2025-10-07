import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WidgetForm from './components/WidgetForm';
import WidgetPreview from './components/WidgetPreview';
import CodeOutput from './components/CodeOutput';
import WidgetHistory from './components/WidgetHistory';
import LoginForm from './components/auth/LoginForm';
import UserManagement from './components/auth/UserManagement';
import Header from './components/Header';
import ProsConsWidget from './components/ProsConsWidget';
import TextLinkGenerator from './components/TextLinkGenerator';
import DbInitializer from './components/DbInitializer';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import { OnboardingProvider, useOnboarding } from './components/onboarding/OnboardingProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FiGrid, FiThumbsUp, FiAlertCircle, FiCheck, FiX, FiLink, FiHelpCircle } from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import { getUserWidgets, saveWidget, deleteWidget } from './utils/widgetService';
import './App.css';

function Navigation() {
  const { setShowOnboarding } = useOnboarding();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-white py-2 px-6"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" icon={FiGrid} text="Affiliate Widget" />
          <NavLink to="/pros-cons" icon={FiThumbsUp} text="Pros & Cons" />
          <NavLink to="/text-link" icon={FiLink} text="Text Link" />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOnboarding(true)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
        >
          <SafeIcon icon={FiHelpCircle} />
          Hjælp & Guide
        </motion.button>
      </div>
    </motion.div>
  );
}

function NavLink({ to, icon, text }) {
  return (
    <Link to={to} className="group flex items-center gap-2 py-2 hover:text-blue-300 relative">
      <SafeIcon icon={icon} />
      <span>{text}</span>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  );
}

function AppContent() {
  const { user, isAdmin, loading, login } = useAuth();
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const [widgetData, setWidgetData] = useState({
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    productTitle: 'Premium Running Shoes',
    productDescription: 'Experience ultimate comfort and performance with our latest running technology.',
    originalPrice: '129,99',
    discountedPrice: '89,99',
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Load user widgets when logged in
  useEffect(() => {
    const fetchWidgets = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const widgets = await getUserWidgets(user.id);
          setWidgetHistory(widgets);
        } catch (err) {
          console.error("Error fetching widgets:", err);
          setError("Kunne ikke hente widgets");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchWidgets();
  }, [user]);

  // Auto-login for admin user - this is for development purposes only
  useEffect(() => {
    const autoLogin = async () => {
      try {
        if (!user) {
          await login('kasperwood@gmail.com', 'Ragnagade9');
        }
      } catch (err) {
        console.error("Auto-login failed:", err);
      }
    };
    // Uncomment this line to enable auto-login
    // autoLogin();
  }, [user, login]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveWidget = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Save widget to Supabase
      const newWidget = await saveWidget(widgetData, user.id, user.email);
      // Add to the beginning of our widget history
      setWidgetHistory([newWidget, ...widgetHistory]);
      setShowCode(true);
      showNotification('Widget gemt med succes!');
    } catch (err) {
      setError('Kunne ikke gemme widget: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadWidget = (widget) => {
    setWidgetData(widget);
    setShowCode(false);
    showNotification('Widget indlæst til redigering');
  };

  const handleDeleteWidget = async (widgetId) => {
    setIsLoading(true);
    try {
      console.log(`Attempting to delete widget with ID: ${widgetId}`);
      // Delete widget from Supabase
      await deleteWidget(widgetId, user.id);
      console.log(`Widget ${widgetId} deleted successfully, updating state`);
      // Remove from local state
      setWidgetHistory(widgetHistory.filter(widget => widget.id !== widgetId));
      showNotification('Widget slettet!', 'warning');
    } catch (err) {
      setError('Kunne ikke slette widget: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    // Fetch widgets after successful login
    if (user) {
      getUserWidgets(user.id).then(widgets => {
        setWidgetHistory(widgets);
      }).catch(err => {
        console.error("Error fetching widgets after login:", err);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
          ></motion.div>
          <p className="text-gray-600">Indlæser...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      {/* Onboarding Flow */}
      <OnboardingFlow 
        isVisible={showOnboarding} 
        onComplete={completeOnboarding}
      />

      {/* Notification system */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center ${
              notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <SafeIcon icon={FiCheck} className="mr-2" />
            ) : (
              <SafeIcon icon={FiAlertCircle} className="mr-2" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 pb-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex justify-between items-center"
              >
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                >
                  <SafeIcon icon={FiX} />
                </button>
              </motion.div>
            )}

            {isAdmin && <DbInitializer />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <WidgetForm
                  widgetData={widgetData}
                  setWidgetData={setWidgetData}
                  saveWidget={handleSaveWidget}
                  showCode={showCode}
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
                loadWidget={handleLoadWidget}
                deleteWidget={handleDeleteWidget}
                isLoading={isLoading}
              />
            </div>

            <UserManagement isAdmin={isAdmin} />
          </motion.div>
        } />
        <Route path="/pros-cons" element={<ProsConsWidget />} />
        <Route path="/text-link" element={<TextLinkGenerator />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;