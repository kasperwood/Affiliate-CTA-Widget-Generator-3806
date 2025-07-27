export const generateWidgetHTML = (widgetData) => {
  // Calculate discount using string values with commas
  const discount = widgetData.originalPrice && widgetData.discountedPrice && widgetData.discountedPrice.trim() !== '' 
    ? Math.round(((parseFloat(widgetData.originalPrice.replace(',', '.')) - parseFloat(widgetData.discountedPrice.replace(',', '.'))) / parseFloat(widgetData.originalPrice.replace(',', '.'))) * 100)
    : 0;

  // Get button text based on language if not provided
  const getButtonText = () => {
    if (widgetData.ctaText) return widgetData.ctaText;
    return widgetData.language === 'da' ? 'Køb nu' : 'Kjøp nå';
  };

  // Format price with kr. only if price exists, preserving commas
  const formatPrice = (price) => {
    if (!price || price.trim() === '') return '';
    return `${price} kr.`;
  };

  // Enhanced product description with custom USPs
  const getEnhancedDescription = () => {
    let description = widgetData.productDescription;
    
    if (widgetData.customUsps && widgetData.customUsps.length > 0) {
      const uspList = widgetData.customUsps.map(usp => `✓ ${usp}`).join('<br>');
      description = description ? `${description}<br><br>${uspList}` : uspList;
    }
    
    return description;
  };

  // Get stock status HTML
  const generateStockStatusHTML = () => {
    if (!widgetData.stockStatus || widgetData.stockStatus === 'none') return '';
    
    let color, text, pulse;
    
    switch(widgetData.stockStatus) {
      case 'inStock':
        color = '#22c55e'; // Green
        text = widgetData.language === 'da' ? 'På lager' : 'På lager';
        pulse = true;
        break;
      case 'lowStock':
        color = '#f59e0b'; // Amber/yellow
        text = widgetData.language === 'da' ? 'Få på lager' : 'Få på lager';
        pulse = true;
        break;
      default:
        return '';
    }
    
    return `
    <div style="
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    ">
      <div style="
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: ${color};
        margin-right: 6px;
        ${pulse ? 'animation: pulse 2s infinite;' : ''}
      "></div>
      <span style="
        font-size: 14px;
        font-weight: 500;
        color: ${color};
      ">${text}</span>
    </div>
    
    ${pulse ? `
    <style>
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    </style>
    ` : ''}`;
  };

  // Generate payment icons HTML
  const generatePaymentIconsHTML = () => {
    if (!widgetData.showApplePay && !widgetData.showGooglePay && !widgetData.showMobilePay) return '';
    
    return `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
    ">
      ${widgetData.showApplePay ? `
        <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650976581-apple%20pay.jpg" 
             alt="Apple Pay" 
             style="height: 24px; object-fit: contain;">
      ` : ''}
      ${widgetData.showGooglePay ? `
        <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650984809-google%20pay.png" 
             alt="Google Pay" 
             style="height: 24px; object-fit: contain;">
      ` : ''}
      ${widgetData.showMobilePay ? `
        <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650992093-mobilepay.webp" 
             alt="MobilePay" 
             style="height: 24px; object-fit: contain;">
      ` : ''}
    </div>`;
  };

  // Generate customer testimonial HTML
  const generateTestimonialHTML = () => {
    if (!widgetData.showTestimonial || !widgetData.testimonialText) return '';
    
    const defaultImageHTML = `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #60a5fa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    `;
    
    const imageHTML = widgetData.testimonialImage ? `
      <img 
        src="${widgetData.testimonialImage}" 
        alt="${widgetData.testimonialName || 'Customer'}"
        style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        "
        onerror="this.onerror=null; this.outerHTML='${defaultImageHTML.replace(/"/g, '\\"').replace(/'/g, "\\'")}'"
      >
    ` : defaultImageHTML;
    
    const customerName = widgetData.testimonialName || (widgetData.language === 'da' ? 'Tilfreds kunde' : 'Fornøyd kunde');
    
    return `
    <div style="
      margin-bottom: 16px;
      padding: 12px;
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
    ">
      <div style="
        display: flex;
        align-items: flex-start;
        gap: 12px;
      ">
        ${imageHTML}
        <div>
          <p style="
            font-size: 14px;
            font-style: italic;
            color: #374151;
            margin: 0 0 4px 0;
          ">"${widgetData.testimonialText}"</p>
          <p style="
            font-size: 12px;
            font-weight: 600;
            color: #111827;
            margin: 0;
          ">${customerName}</p>
        </div>
      </div>
    </div>
    `;
  };

  // Generate shipping countdown HTML
  const generateShippingCountdownHTML = () => {
    if (!widgetData.showShippingCountdown) return '';
    
    const shippingText = widgetData.language === 'da' 
      ? 'Afsendes i dag, hvis du bestiller inden' 
      : 'Sendes i dag hvis du bestiller før';
    
    const deadline = widgetData.shippingDeadline || '15:00';
    
    return `
    <div style="
      margin-bottom: 16px;
      padding: 12px;
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
      text-align: center;
    ">
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: #92400e;
        margin-bottom: 4px;
      ">
        <svg style="width: 16px; height: 16px; margin-right: 8px; color: #d97706;" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
        </svg>
        <span style="font-weight: 500;">${shippingText}</span>
      </div>
      <div id="countdown-timer-${widgetData.id}" style="
        font-size: 18px;
        font-weight: bold;
        color: #78350f;
        text-align: center;
      "></div>
    </div>
    
    <script>
    (function() {
      function updateCountdown() {
        const now = new Date();
        const deadline = '${deadline}';
        const [hours, minutes] = deadline.split(':').map(Number);
        
        const today = new Date();
        today.setHours(hours, minutes, 0, 0);
        
        if (now > today) {
          today.setDate(today.getDate() + 1);
        }
        
        const diff = today.getTime() - now.getTime();
        
        if (diff > 0) {
          const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
          const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
          
          const timeString = hoursLeft.toString().padStart(2, '0') + ':' + 
                           minutesLeft.toString().padStart(2, '0') + ':' + 
                           secondsLeft.toString().padStart(2, '0');
          
          const countdownElement = document.getElementById('countdown-timer-${widgetData.id}');
          if (countdownElement) {
            countdownElement.textContent = timeString;
          }
        } else {
          const countdownElement = document.getElementById('countdown-timer-${widgetData.id}');
          if (countdownElement) {
            countdownElement.textContent = '00:00:00';
          }
        }
      }
      
      updateCountdown();
      setInterval(updateCountdown, 1000);
    })();
    </script>`;
  };

  // Generate standard USPs HTML if any are selected (displayed below button)
  const generateStandardUspsHTML = () => {
    if (widgetData.usps.length === 0) return '';
    
    return `
    <div style="
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(0,0,0,0.1);
    ">
      <ul style="
        list-style: none;
        padding: 0;
        margin: 0;
      ">
        ${widgetData.usps.map(usp => {
          const isEmaerket = usp.includes('E-mærket');
          const isTryghedsmaerket = usp.includes('Tryghedsmærket');
          
          let iconHtml;
          if (isEmaerket) {
            iconHtml = `<img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650222793-e-markerket.jpg" style="width: 16px; height: 16px; margin-right: 8px; object-fit: contain;" alt="${usp}">`;
          } else if (isTryghedsmaerket) {
            iconHtml = `<img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753650227304-tryghedsmaerket.png" style="width: 16px; height: 16px; margin-right: 8px; object-fit: contain;" alt="${usp}">`;
          } else {
            iconHtml = `<svg style="width: 16px; height: 16px; margin-right: 8px; color: #22c55e;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>`;
          }
          
          return `
          <li style="
            display: flex;
            align-items: center;
            font-size: 13px;
            margin-bottom: 6px;
          ">
            ${iconHtml}
            ${usp}
          </li>
        `}).join('')}
      </ul>
    </div>`;
  };

  // Generate tracking script for click analytics
  const generateTrackingScript = () => {
    const widgetId = widgetData.id || Date.now();
    
    return `
    <script>
    (function() {
      var trackLink = document.querySelector('.cta-widget-link-${widgetId}');
      if (trackLink) {
        trackLink.addEventListener('click', function(e) {
          // Record click in localStorage
          try {
            var clickData = JSON.parse(localStorage.getItem('widgetClicks') || '{}');
            var widgetId = '${widgetId}';
            
            if (!clickData[widgetId]) {
              clickData[widgetId] = [];
            }
            
            clickData[widgetId].push({
              timestamp: new Date().toISOString(),
              referrer: document.referrer || 'direct'
            });
            
            localStorage.setItem('widgetClicks', JSON.stringify(clickData));
          } catch (err) {
            console.error('Error tracking widget click:', err);
          }
        });
      }
    })();
    </script>`;
  };

  // Generate auto-update script
  const generateAutoUpdateScript = () => {
    const widgetId = widgetData.id || Date.now();
    
    return `
    <script>
    (function() {
      // Check for widget updates every minute
      function checkForWidgetUpdates() {
        try {
          const widgetId = '${widgetId}';
          const storedWidgets = JSON.parse(localStorage.getItem('widgetHistory') || '[]');
          const currentWidget = storedWidgets.find(w => w.id == widgetId);
          
          if (currentWidget) {
            // Compare last modified timestamp with the current widget's data
            const currentTimestamp = '${widgetData.lastModified || widgetData.createdAt || new Date().toISOString()}';
            const storedTimestamp = currentWidget.lastModified || currentWidget.createdAt;
            
            if (storedTimestamp && storedTimestamp !== currentTimestamp) {
              // Widget has been updated, refresh the content
              const containerElement = document.getElementById('widget-container-${widgetId}');
              if (containerElement) {
                // Apply updated widget properties
                updateWidgetContent(containerElement, currentWidget);
              }
            }
          }
        } catch (err) {
          console.error('Error checking for widget updates:', err);
        }
      }
      
      // Function to update widget content with new data
      function updateWidgetContent(container, widgetData) {
        // Update title
        const titleElement = container.querySelector('.widget-title');
        if (titleElement) titleElement.textContent = widgetData.productTitle;
        
        // Update description
        const descElement = container.querySelector('.widget-description');
        if (descElement) {
          let description = widgetData.productDescription;
          if (widgetData.customUsps && widgetData.customUsps.length > 0) {
            const uspList = widgetData.customUsps.map(usp => '✓ ' + usp).join('<br>');
            description = description ? description + '<br><br>' + uspList : uspList;
          }
          descElement.innerHTML = description;
        }
        
        // Update prices
        const originalPriceElement = container.querySelector('.widget-original-price');
        const discountedPriceElement = container.querySelector('.widget-discounted-price');
        
        if (originalPriceElement && discountedPriceElement) {
          const hasDiscount = widgetData.discountedPrice && widgetData.discountedPrice.trim() !== '';
          
          if (hasDiscount) {
            originalPriceElement.style.display = 'inline';
            originalPriceElement.textContent = widgetData.originalPrice + ' kr.';
            discountedPriceElement.textContent = widgetData.discountedPrice + ' kr.';
          } else {
            originalPriceElement.style.display = 'none';
            discountedPriceElement.textContent = widgetData.originalPrice + ' kr.';
          }
          
          // Update discount badge if exists
          const discountBadge = container.querySelector('.widget-discount-badge');
          if (discountBadge) {
            if (hasDiscount) {
              const discount = Math.round(
                ((parseFloat(widgetData.originalPrice.replace(',', '.')) - 
                  parseFloat(widgetData.discountedPrice.replace(',', '.'))) / 
                 parseFloat(widgetData.originalPrice.replace(',', '.'))) * 100
              );
              
              discountBadge.textContent = '-' + discount + '%';
              discountBadge.style.display = 'block';
            } else {
              discountBadge.style.display = 'none';
            }
          }
        }
        
        // Update CTA button
        const ctaButton = container.querySelector('.cta-widget-link');
        if (ctaButton) {
          ctaButton.textContent = widgetData.ctaText || (widgetData.language === 'da' ? 'Køb nu' : 'Kjøp nå');
          ctaButton.href = widgetData.affiliateLink;
          ctaButton.style.backgroundColor = widgetData.buttonColor;
        }
        
        // Update image
        const imageElement = container.querySelector('.widget-image');
        if (imageElement) {
          imageElement.src = widgetData.productImage;
        }
        
        // Update colors
        container.style.backgroundColor = widgetData.backgroundColor;
        container.style.color = widgetData.textColor;
        
        // Additional updates can be added for other widget properties
      }
      
      // Initial check and setup interval
      checkForWidgetUpdates();
      setInterval(checkForWidgetUpdates, 60000); // Check every minute
    })();
    </script>`;
  };

  return `<!-- CTA Widget - Generated by CTA Widget Generator (Auto-updating) -->
<div id="widget-container-${widgetData.id || Date.now()}" style="
  max-width: 100%;
  width: 400px;
  margin: 20px auto;
  background-color: ${widgetData.backgroundColor};
  color: ${widgetData.textColor};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  text-decoration: none;
">
  <div style="position: relative;">
    <img 
      src="${widgetData.productImage}" 
      alt="${widgetData.productTitle}"
      class="widget-image"
      style="
        width: 100%;
        height: 200px;
        object-fit: cover;
        display: block;
      "
      onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'"
    />
    ${discount > 0 ? `
    <div class="widget-discount-badge" style="
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: #ef4444;
      color: white;
      padding: 4px 8px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    ">
      -${discount}%
    </div>` : ''}
  </div>
  
  <div style="padding: 16px;">
    <div style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    ">
      <h3 class="widget-title" style="
        font-weight: bold;
        font-size: 18px;
        margin: 0;
        line-height: 1.4;
      ">${widgetData.productTitle}</h3>
      
      ${generateStockStatusHTML()}
    </div>
    
    <div class="widget-description" style="
      font-size: 14px;
      opacity: 0.8;
      margin: 0 0 12px 0;
      line-height: 1.4;
      white-space: pre-line;
    ">${getEnhancedDescription()}</div>
    
    <div style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    ">
      <div style="display: flex; align-items: center; gap: 8px;">
        ${widgetData.originalPrice && widgetData.discountedPrice && widgetData.discountedPrice.trim() !== '' ? `
        <span class="widget-original-price" style="
          font-size: 14px;
          text-decoration: line-through;
          opacity: 0.6;
        ">${formatPrice(widgetData.originalPrice)}</span>
        <span class="widget-discounted-price" style="
          font-size: 20px;
          font-weight: bold;
        ">${formatPrice(widgetData.discountedPrice)}</span>` : `
        <span class="widget-original-price" style="display: none"></span>
        <span class="widget-discounted-price" style="
          font-size: 20px;
          font-weight: bold;
        ">${formatPrice(widgetData.originalPrice)}</span>`}
      </div>
    </div>
    
    ${generateTestimonialHTML()}
    ${generateShippingCountdownHTML()}
    
    <a href="${widgetData.affiliateLink}" 
       target="_blank" 
       rel="noopener noreferrer"
       class="cta-widget-link cta-widget-link-${widgetData.id || Date.now()}"
       style="
         display: block;
         width: 100%;
         background-color: ${widgetData.buttonColor};
         color: white;
         font-weight: bold;
         padding: 12px 16px;
         border-radius: 6px;
         text-align: center;
         text-decoration: none;
         transition: opacity 0.2s;
         box-sizing: border-box;
       "
       onmouseover="this.style.opacity='0.9'"
       onmouseout="this.style.opacity='1'"
    >
      ${getButtonText()}
    </a>
    
    ${generatePaymentIconsHTML()}
    
    ${generateStandardUspsHTML()}
  </div>
</div>
${generateTrackingScript()}
${generateAutoUpdateScript()}`;
};

export const generateIframeCode = (widgetData) => {
  const htmlContent = generateWidgetHTML(widgetData);
  const encodedHTML = encodeURIComponent(`
<!DOCTYPE html>
<html lang="${widgetData.language || 'da'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CTA Widget</title>
  <style>
    body { margin: 0; padding: 10px; background: transparent; }
    .widget-container { 
      max-width: 400px;
      margin: 0 auto;
      width: 100%;
    }
    @media (max-width: 480px) {
      .widget-container { max-width: 100% !important; }
    }
  </style>
  <script>
    // Add listener for postMessage from parent window
    window.addEventListener('message', function(event) {
      try {
        const data = event.data;
        if (data && data.type === 'WIDGET_UPDATE' && data.widgetId === '${widgetData.id}') {
          // Reload iframe to get latest widget version
          window.location.reload();
        }
      } catch (err) {
        console.error('Error handling widget update message:', err);
      }
    });
  </script>
</head>
<body>
  <div class="widget-container">
    ${htmlContent}
  </div>
</body>
</html>
  `);

  // Calculate appropriate iframe height based on content
  const baseHeight = 350;
  const standardUspsCount = widgetData.usps ? widgetData.usps.length : 0;
  const customUspsCount = widgetData.customUsps ? widgetData.customUsps.length : 0;
  const standardUspHeight = standardUspsCount > 0 ? standardUspsCount * 30 : 0;
  const customUspHeight = customUspsCount > 0 ? customUspsCount * 20 : 0;
  const countdownHeight = widgetData.showShippingCountdown ? 80 : 0;
  const testimonialHeight = widgetData.showTestimonial ? 100 : 0;
  const paymentIconsHeight = (widgetData.showApplePay || widgetData.showGooglePay || widgetData.showMobilePay) ? 40 : 0;
  const stockStatusHeight = widgetData.stockStatus && widgetData.stockStatus !== 'none' ? 20 : 0;
  
  const totalHeight = baseHeight + standardUspHeight + customUspHeight + countdownHeight + 
                      testimonialHeight + paymentIconsHeight + stockStatusHeight;

  return `<!-- Auto-updating iframe Embed Code -->
<iframe 
  id="widget-iframe-${widgetData.id}"
  src="data:text/html;charset=utf-8,${encodedHTML}"
  width="100%" 
  height="${totalHeight}"
  frameborder="0"
  scrolling="no"
  style="max-width: 420px; margin: 20px auto; display: block;"
  title="Product CTA Widget">
</iframe>
<script>
  // Script to enable live updates for widget
  (function() {
    const widgetId = '${widgetData.id}';
    let lastCheckedTimestamp = new Date().getTime();
    
    // Function to check for widget updates
    function checkForWidgetUpdates() {
      try {
        const storedWidgets = JSON.parse(localStorage.getItem('widgetHistory') || '[]');
        const widget = storedWidgets.find(w => w.id == widgetId);
        
        if (widget) {
          const lastModified = new Date(widget.lastModified || widget.createdAt).getTime();
          
          if (lastModified > lastCheckedTimestamp) {
            // Widget has been updated, notify iframe
            const iframe = document.getElementById('widget-iframe-' + widgetId);
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage({
                type: 'WIDGET_UPDATE',
                widgetId: widgetId
              }, '*');
              
              lastCheckedTimestamp = new Date().getTime();
            }
          }
        }
      } catch (err) {
        console.error('Error checking for widget updates:', err);
      }
    }
    
    // Check for updates periodically
    setInterval(checkForWidgetUpdates, 30000); // Every 30 seconds
  })();
</script>`;
};

// Helper function to store and manage widget data
export const storeWidgetData = (widgetData) => {
  // Add last modified timestamp
  const widgetToStore = {
    ...widgetData,
    lastModified: new Date().toISOString()
  };
  
  try {
    // Get existing widgets
    const storedWidgets = JSON.parse(localStorage.getItem('widgetHistory') || '[]');
    const existingWidgetIndex = storedWidgets.findIndex(widget => widget.id === widgetData.id);
    
    if (existingWidgetIndex >= 0) {
      // Update existing widget
      storedWidgets[existingWidgetIndex] = {
        ...storedWidgets[existingWidgetIndex],
        ...widgetToStore
      };
    } else {
      // Add new widget
      storedWidgets.unshift(widgetToStore);
    }
    
    // Store updated list
    localStorage.setItem('widgetHistory', JSON.stringify(storedWidgets));
    
    return true;
  } catch (err) {
    console.error('Error storing widget data:', err);
    return false;
  }
};