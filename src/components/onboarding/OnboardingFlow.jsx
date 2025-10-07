import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiArrowLeft, FiCheck, FiGrid, FiThumbsUp, FiLink, FiStar, FiTarget, FiZap, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const OnboardingFlow = ({ isVisible, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Velkommen til The Affiliate Widget Generator! 🎉',
      subtitle: 'Lad os vise dig hvordan du skaber konverterende affiliate widgets på få minutter',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <SafeIcon icon={FiStar} className="text-3xl text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              Du er nu klar til at skabe professionelle affiliate widgets der konverterer bedre end almindelige links.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <SafeIcon icon={FiTarget} className="text-2xl text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Højere konvertering</h4>
                <p className="text-sm text-gray-600">Øg dine affiliate indtægter med visuelt tiltalende widgets</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <SafeIcon icon={FiZap} className="text-2xl text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Hurtig oprettelse</h4>
                <p className="text-sm text-gray-600">Skab widgets på få minutter uden teknisk viden</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="text-2xl text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Professionelt design</h4>
                <p className="text-sm text-gray-600">Moderne, responsive widgets der passer til dit indhold</p>
              </div>
            </div>
          </div>
        </div>
      ),
      showDemo: false
    },
    {
      id: 'affiliate-widget',
      title: 'Affiliate Product Widget',
      subtitle: 'Din hovedværktøj til produktmarkedsføring',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <SafeIcon icon={FiGrid} className="text-2xl mb-2" />
              <h4 className="font-bold text-lg">Affiliate Product Widget</h4>
              <p className="text-blue-100">Den mest populære widget type</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Produktbilleder og beskrivelser</h5>
                  <p className="text-gray-600 text-sm">Vis produkter visuelt med billeder, priser og beskrivelser</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Rabat badges og countdown</h5>
                  <p className="text-gray-600 text-sm">Skab urgency med countdown timere og rabat badges</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Kundeudtalelser og trust badges</h5>
                  <p className="text-gray-600 text-sm">Byg tillid med kundeanmeldelser og sikkerhedsmærker</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Betalingsikoner</h5>
                  <p className="text-gray-600 text-sm">Vis Apple Pay, Google Pay og MobilePay for at øge tilliden</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Bedst til:</strong> E-commerce produkter, fysiske varer, software, kurser og services med konkrete priser.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" 
                alt="Demo Product" 
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -25%
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Premium Sneakers</h3>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-green-600 font-medium">På lager</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Komfortable løbesko med avanceret teknologi</p>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm line-through text-gray-500">999 kr.</span>
                  <span className="text-xl font-bold">749 kr.</span>
                </div>
                <div className="text-green-600 text-sm font-medium mb-3">Du sparer 250 kr.</div>
                <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Køb nu
                </button>
                <div className="flex justify-center space-x-3 mt-3">
                  <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650976581-apple%20pay.jpg" alt="Apple Pay" className="h-5" />
                  <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650992093-mobilepay.webp" alt="MobilePay" className="h-5" />
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiCheck} className="text-green-500 mr-2" />
                    Fri fragt
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      showDemo: true
    },
    {
      id: 'pros-cons',
      title: 'Pros & Cons Widget',
      subtitle: 'Byg tillid gennem ærlige produktanmeldelser',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg">
              <SafeIcon icon={FiThumbsUp} className="text-2xl mb-2" />
              <h4 className="font-bold text-lg">Pros & Cons Widget</h4>
              <p className="text-green-100">Ærlig produktevaluering</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Fordele og ulemper</h5>
                  <p className="text-gray-600 text-sm">Balanceret præsentation af produktets styrker og svagheder</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Drag & drop organisering</h5>
                  <p className="text-gray-600 text-sm">Flyt punkter mellem fordele og ulemper med mus</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Konklusion sektion</h5>
                  <p className="text-gray-600 text-sm">Samlet vurdering og anbefaling til læserne</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Responsive design</h5>
                  <p className="text-gray-600 text-sm">Fungerer perfekt på både desktop og mobil</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Bedst til:</strong> Produktanmeldelser, sammenligning af services, software reviews og detaljerede evalueringer.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
              <div className="flex items-center p-4">
                <img 
                  src="https://images.unsplash.com/photo-1695048133142-1a20484426d3?w=400&h=400&fit=crop" 
                  alt="iPhone 15 Pro" 
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="font-bold text-lg">iPhone 15 Pro</h3>
                  <div className="text-blue-600 font-bold">7.499 kr</div>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h4 className="text-green-600 font-semibold border-b-2 border-green-600 pb-1 mb-2 flex items-center">
                      <SafeIcon icon={FiThumbsUp} className="mr-2" />
                      Fordele
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-start text-sm">
                        <SafeIcon icon={FiCheck} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Utrolig kamerakvalitet
                      </li>
                      <li className="flex items-start text-sm">
                        <SafeIcon icon={FiCheck} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Hurtig A17 Pro processor
                      </li>
                      <li className="flex items-start text-sm">
                        <SafeIcon icon={FiCheck} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Fantastisk batterilevetid
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-red-600 font-semibold border-b-2 border-red-600 pb-1 mb-2 flex items-center">
                      <SafeIcon icon={FiThumbsUp} className="mr-2 transform rotate-180" />
                      Ulemper
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-start text-sm">
                        <SafeIcon icon={FiX} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                        Høj pris
                      </li>
                      <li className="flex items-start text-sm">
                        <SafeIcon icon={FiX} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                        Ingen oplader i æsken
                      </li>
                      <li className="flex items-start text-sm">
                        <SafeIcon icon={FiX} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                        Sårbar over for ridser
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm italic">
                  "iPhone 15 Pro er en fremragende smartphone med toppræstationer, men prisen er høj."
                </div>
                
                <button className="w-full mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Læs fuld anmeldelse
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      showDemo: true
    },
    {
      id: 'text-link',
      title: 'Text Link Generator',
      subtitle: 'Skab smukke tekstlinks som alternativ til kedelige links',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-lg">
              <SafeIcon icon={FiLink} className="text-2xl mb-2" />
              <h4 className="font-bold text-lg">Text Link Generator</h4>
              <p className="text-purple-100">Diskret og elegant markedsføring</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Avancerede link styles</h5>
                  <p className="text-gray-600 text-sm">Vælg mellem forskellige animationer og hover-effekter</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Produktbilleder og overskrifter</h5>
                  <p className="text-gray-600 text-sm">Tilføj billeder og overskrifter for øget synlighed</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Tracking og analytics</h5>
                  <p className="text-gray-600 text-sm">Indbygget UTM tracking til bedre måling af performance</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">SEO optimering</h5>
                  <p className="text-gray-600 text-sm">Automatisk nofollow attributter og target="_blank"</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                <strong>Bedst til:</strong> Inline links i artikler, call-to-action tekst, diskret produktmarkedsføring og email kampagner.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700 mb-2">Leder du efter gode tilbud?</p>
                <div className="inline-flex items-center bg-blue-50 p-3 rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop" 
                    alt="Product" 
                    className="w-12 h-12 rounded-lg mr-3"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">Eksklusivt tilbud</h4>
                    <a 
                      href="#" 
                      className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors"
                    >
                      Få 20% rabat på alle produkter →
                    </a>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">og få de bedste priser på markedet.</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Andre link styles:</h4>
                <div className="space-y-3">
                  <a href="#" className="inline-block text-blue-600 hover:text-blue-800 relative">
                    <span className="relative z-10">Underline animation link</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
                  </a>
                  
                  <div>
                    <a href="#" className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105">
                      Button style link
                    </a>
                  </div>
                  
                  <a href="#" className="inline-block text-green-600 hover:text-green-800 hover:shadow-lg transition-all">
                    <span className="relative">
                      Glow effect link
                      <span className="absolute inset-0 bg-green-200 opacity-0 hover:opacity-30 blur-sm transition-opacity"></span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      showDemo: true
    },
    {
      id: 'tips',
      title: 'Pro Tips & Best Practices',
      subtitle: 'Sådan får du mest ud af dine widgets',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border border-blue-200">
              <SafeIcon icon={FiShoppingCart} className="text-2xl text-blue-600 mb-3" />
              <h4 className="font-bold text-lg text-gray-800 mb-3">Konvertering Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Brug urgency elementer som countdown og "få på lager"
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Tilføj kundeudtalelser for øget tillid
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Vis konkrete besparelser i kroner og øre
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Brug højkvalitets produktbilleder
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border border-green-200">
              <SafeIcon icon={FiUsers} className="text-2xl text-green-600 mb-3" />
              <h4 className="font-bold text-lg text-gray-800 mb-3">Tillid & Troværdighed</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Vær ærlig om både fordele og ulemper
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Brug trust badges som E-mærket og Tryghedsmærket
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Tilføj betalingsikoner (MobilePay, Apple Pay)
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Inkluder "fri fragt" og returpolitik
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg border border-purple-200">
              <SafeIcon icon={FiTarget} className="text-2xl text-purple-600 mb-3" />
              <h4 className="font-bold text-lg text-gray-800 mb-3">Design Guidelines</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Vælg farver der matcher dit brand
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Sørg for god kontrast mellem tekst og baggrund
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Test widgets på både desktop og mobil
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Hold beskrivelser korte og præcise
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-lg border border-orange-200">
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-orange-600 mb-3" />
              <h4 className="font-bold text-lg text-gray-800 mb-3">Performance Tracking</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  Brug UTM parametre til at tracke klik
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  A/B test forskellige widget designs
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  Overvåg konverteringsrater i dit affiliate panel
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  Optimer baseret på hvilke widgets der performer bedst
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-lg">
            <h4 className="font-bold text-xl mb-4 flex items-center">
              <SafeIcon icon={FiZap} className="mr-3 text-yellow-400" />
              Hurtig Start Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2">1</div>
                <h5 className="font-semibold mb-1">Vælg Widget Type</h5>
                <p className="text-gray-300">Start med Affiliate Widget for produkter eller Text Link for diskret markedsføring</p>
              </div>
              <div>
                <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2">2</div>
                <h5 className="font-semibold mb-1">Tilpas Design</h5>
                <p className="text-gray-300">Upload produktbillede, indstil priser og vælg farver der matcher dit brand</p>
              </div>
              <div>
                <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2">3</div>
                <h5 className="font-semibold mb-1">Kopier & Indsæt</h5>
                <p className="text-gray-300">Generer koden og indsæt den direkte i din artikel eller webside</p>
              </div>
            </div>
          </div>
        </div>
      ),
      showDemo: false
    },
    {
      id: 'complete',
      title: 'Du er klar til at komme i gang! 🚀',
      subtitle: 'Alt er sat op og du kan nu skabe dine første widgets',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center">
            <SafeIcon icon={FiCheck} className="text-3xl text-white" />
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              Du har nu fået et komplet overblik over alle widget typer og deres muligheder.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 max-w-2xl mx-auto">
              <h4 className="font-bold text-lg text-gray-800 mb-4">Hvad sker der nu?</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Skab din første widget</h5>
                    <p className="text-sm text-gray-600">Start med Affiliate Widget fanen</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Gem og generer kode</h5>
                    <p className="text-sm text-gray-600">Alle widgets gemmes automatisk</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Indsæt i dit indhold</h5>
                    <p className="text-sm text-gray-600">Kopier HTML koden til din side</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 max-w-xl mx-auto">
              <p className="text-sm text-green-800">
                <strong>Tip:</strong> Du kan altid gense denne guide ved at kontakte support eller tjekke hjælp-sektionen.
              </p>
            </div>
          </div>
        </div>
      ),
      showDemo: false
    }
  ];

  const nextStep = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 150));
      setCurrentStep(currentStep + 1);
      setIsAnimating(false);
    }
  };

  const prevStep = async () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 150));
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const completeOnboarding = () => {
    onComplete();
  };

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <motion.h2 
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  {currentStepData.title}
                </motion.h2>
                <motion.p 
                  key={`${currentStep}-subtitle`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-blue-100"
                >
                  {currentStepData.subtitle}
                </motion.p>
              </div>
              <button
                onClick={skipOnboarding}
                className="text-white hover:text-gray-200 transition-colors p-2"
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Trin {currentStep + 1} af {onboardingSteps.length}</span>
                <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
                <motion.div
                  className="bg-white rounded-full h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: isAnimating ? (currentStep > 0 ? 50 : -50) : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentStep > 0 ? -50 : 50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-blue-600'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-3">
                {!isFirstStep && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center transition-colors"
                  >
                    <SafeIcon icon={FiArrowLeft} className="mr-2" />
                    Tilbage
                  </motion.button>
                )}

                {!isFirstStep && !isLastStep && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={skipOnboarding}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Spring over
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isLastStep ? completeOnboarding : nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors font-medium"
                >
                  {isLastStep ? (
                    <>
                      <SafeIcon icon={FiCheck} className="mr-2" />
                      Kom i gang
                    </>
                  ) : (
                    <>
                      Næste
                      <SafeIcon icon={FiArrowRight} className="ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingFlow;