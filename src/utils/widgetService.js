import supabase from '../lib/supabase';

// Convert the widget data format from front-end to database format
const convertToDbFormat = (widgetData, userId) => {
  return {
    user_id: userId,
    product_title: widgetData.productTitle,
    product_description: widgetData.productDescription,
    product_image: widgetData.productImage,
    original_price: widgetData.originalPrice,
    discounted_price: widgetData.discountedPrice,
    cta_text: widgetData.ctaText,
    affiliate_link: widgetData.affiliateLink,
    background_color: widgetData.backgroundColor,
    button_color: widgetData.buttonColor,
    text_color: widgetData.textColor,
    language: widgetData.language,
    usps: widgetData.usps,
    custom_usps: widgetData.customUsps,
    show_shipping_countdown: widgetData.showShippingCountdown,
    shipping_deadline: widgetData.shippingDeadline,
    show_apple_pay: widgetData.showApplePay,
    show_google_pay: widgetData.showGooglePay,
    show_mobile_pay: widgetData.showMobilePay,
    stock_status: widgetData.stockStatus,
    show_testimonial: widgetData.showTestimonial,
    testimonial_text: widgetData.testimonialText,
    testimonial_name: widgetData.testimonialName,
    testimonial_image: widgetData.testimonialImage
  };
};

// Convert the widget data format from database to front-end
const convertFromDbFormat = (dbWidget) => {
  return {
    id: dbWidget.id,
    productTitle: dbWidget.product_title,
    productDescription: dbWidget.product_description,
    productImage: dbWidget.product_image,
    originalPrice: dbWidget.original_price,
    discountedPrice: dbWidget.discounted_price,
    ctaText: dbWidget.cta_text,
    affiliateLink: dbWidget.affiliate_link,
    backgroundColor: dbWidget.background_color,
    buttonColor: dbWidget.button_color,
    textColor: dbWidget.text_color,
    language: dbWidget.language,
    usps: dbWidget.usps || [],
    customUsps: dbWidget.custom_usps || [],
    showShippingCountdown: dbWidget.show_shipping_countdown,
    shippingDeadline: dbWidget.shipping_deadline,
    showApplePay: dbWidget.show_apple_pay,
    showGooglePay: dbWidget.show_google_pay,
    showMobilePay: dbWidget.show_mobile_pay,
    stockStatus: dbWidget.stock_status,
    showTestimonial: dbWidget.show_testimonial,
    testimonialText: dbWidget.testimonial_text,
    testimonialName: dbWidget.testimonial_name,
    testimonialImage: dbWidget.testimonial_image,
    createdAt: dbWidget.created_at,
    userId: dbWidget.user_id,
    userEmail: dbWidget.user_email
  };
};

// Initialize the widgets table if it doesn't exist
export const initializeWidgetsTable = async () => {
  try {
    // Check if table exists
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'widgets_a7b3c9d8e2')
      .limit(1);

    if (checkError) {
      console.error('Error checking table existence:', checkError);
      // Continue anyway as we'll try to create it
    }

    // If table doesn't exist, create it
    if (!existingTables || existingTables.length === 0) {
      // Create table with SQL query
      const { error } = await supabase.rpc('create_widgets_table', {
        table_name: 'widgets_a7b3c9d8e2'
      });

      if (error) {
        console.error('Error creating widgets table with RPC:', error);
        return false;
      }
    }

    console.log('Widgets table initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing widgets table:', error);
    return false;
  }
};

// Get ALL widgets (not just for current user) - everyone can see all widgets
export const getUserWidgets = async (userId) => {
  try {
    console.log('Fetching ALL widgets for user:', userId);
    
    // Get ALL widgets from Supabase (not filtered by user)
    const { data, error } = await supabase
      .from('widgets_a7b3c9d8e2')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching widgets:', error);
      throw error;
    }

    console.log('Fetched widgets:', data);

    // Get user email for each widget
    let widgets = [];
    for (const widget of data) {
      let userEmail = '';
      // Try to get the user email from auth
      try {
        const { data: userData, error: userError } = await supabase
          .from('users_management_a7b3c9d8e2')
          .select('email')
          .eq('auth_user_id', widget.user_id)
          .single();

        if (!userError && userData) {
          userEmail = userData.email;
        }
      } catch (err) {
        console.warn('Error fetching user email:', err);
      }

      // Convert widget to the format expected by the app
      widgets.push({
        ...convertFromDbFormat(widget),
        userEmail
      });
    }

    return widgets;
  } catch (error) {
    console.error('Error getting widgets:', error);
    // Fallback to dummy data if there's an error
    return [
      {
        id: '1',
        productTitle: 'Premium Running Shoes',
        productDescription: 'Experience ultimate comfort and performance with our latest running technology.',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        originalPrice: '129,99',
        discountedPrice: '89,99',
        ctaText: 'Køb nu',
        affiliateLink: 'https://example.com/affiliate-link',
        backgroundColor: '#ffffff',
        buttonColor: '#ff6b6b',
        textColor: '#333333',
        language: 'da',
        usps: ['Fri fragt', 'E-mærket webshop'],
        customUsps: ['Slidstærk sål', '30 dages returret'],
        showShippingCountdown: true,
        shippingDeadline: '15:00',
        showApplePay: true,
        showGooglePay: false,
        showMobilePay: true,
        stockStatus: 'inStock',
        showTestimonial: true,
        testimonialText: 'Disse løbesko er de bedste jeg nogensinde har haft. Super komfortable og holdbare!',
        testimonialName: 'Peter Jensen',
        testimonialImage: '',
        createdAt: '2023-06-10T10:30:00Z',
        userId: userId,
        userEmail: 'kasperwood@gmail.com'
      }
    ];
  }
};

// Save a widget
export const saveWidget = async (widgetData, userId, userEmail) => {
  try {
    console.log('Saving widget for user:', userId);
    
    // Convert widget data to database format
    const dbWidget = convertToDbFormat(widgetData, userId);

    // Insert widget into Supabase
    const { data, error } = await supabase
      .from('widgets_a7b3c9d8e2')
      .insert([dbWidget])
      .select();

    if (error) {
      console.error('Error saving widget:', error);
      throw error;
    }

    console.log('Widget saved successfully:', data[0]);

    // Return the saved widget in the format expected by the app
    return {
      ...convertFromDbFormat(data[0]),
      userEmail,
      createdAt: data[0].created_at
    };
  } catch (error) {
    console.error('Error saving widget:', error);
    // Fallback to creating a local widget object
    const newWidget = {
      id: Date.now().toString(),
      ...widgetData,
      createdAt: new Date().toISOString(),
      userId: userId,
      userEmail: userEmail
    };
    return newWidget;
  }
};

// Update a widget - now allows any user to update any widget
export const updateWidget = async (widgetId, widgetData, userId) => {
  try {
    console.log('Updating widget:', widgetId, 'by user:', userId);
    
    // Convert widget data to database format
    const dbWidget = convertToDbFormat(widgetData, userId);
    
    // Add updated_at timestamp
    dbWidget.updated_at = new Date().toISOString();

    // Update widget in Supabase - removed user restriction
    const { data, error } = await supabase
      .from('widgets_a7b3c9d8e2')
      .update(dbWidget)
      .eq('id', widgetId)
      .select();

    if (error) {
      console.error('Error updating widget:', error);
      throw error;
    }

    if (data && data.length > 0) {
      console.log('Widget updated successfully:', data[0]);
      // Return the updated widget in the format expected by the app
      return convertFromDbFormat(data[0]);
    } else {
      throw new Error('Widget not found');
    }
  } catch (error) {
    console.error('Error updating widget:', error);
    throw error;
  }
};

// Delete a widget - now allows any user to delete any widget
export const deleteWidget = async (widgetId, userId) => {
  try {
    console.log(`Deleting widget ${widgetId} by user ${userId}`);
    
    // Delete widget from Supabase - removed user restriction
    const { error } = await supabase
      .from('widgets_a7b3c9d8e2')
      .delete()
      .eq('id', widgetId);

    if (error) {
      console.error('Error deleting widget:', error);
      throw error;
    }

    console.log('Widget deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting widget:', error);
    throw error;
  }
};