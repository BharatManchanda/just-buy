export const EFFECTIVE_DATE = "October 26, 2024";

export const privacyPolicyContent = {
  effectiveDate: EFFECTIVE_DATE,
  sections: [
    {
      title: '1. Information We Collect',
      description: 'We collect information to provide and improve our rapid delivery service:',
      list: [
        { header: 'A. Personal Identifiable Information (PII)', text: 'Name, email address, phone number, and password.' },
        { header: 'B. Location Data', text: 'Precise or approximate location data is REQUIRED to fulfill orders quickly. This data is collected when the App is in use, and may be collected when the App is running in the background to track delivery progress.' },
        { header: 'C. Transaction Data', text: 'Details about orders placed (products, time, date, price, payment method used, and delivery address).' },
        { header: 'D. Communication Data', text: 'Records of communications with our customer support team.' },
      ],
    },
    {
      title: '2. How We Use Your Information',
      description: 'We use the collected information for the following purposes:',
      list: [
        { header: 'Service Fulfillment', text: 'To process and fulfill your 10-minute delivery orders.' },
        { header: 'Personalization', text: 'To personalize your experience, suggesting products based on your past orders.' },
        { header: 'Real-Time Tracking', text: 'To track the status and location of your order in real-time.' },
        { header: 'Improvement', text: 'To improve our App, services, and delivery logistics.' },
        { header: 'Communication', text: 'To communicate important service announcements or promotional offers.' },
      ],
    },
    {
      title: '3. Sharing and Disclosure',
      description: 'We may share your information with the following parties:',
      list: [
        { header: 'Delivery Partners', text: 'We share your name, phone number, and precise delivery address with the independent personnel who execute the delivery.' },
        { header: 'Payment Processors', text: 'Transaction details are shared securely with third-party payment gateways (e.g., Stripe, PayPal, etc.).' },
        { header: 'Legal Compliance', text: 'If required by law, court order, or governmental request.' },
      ],
    },
    {
      title: '4. Security and Your Choices',
      description: 'We implement robust security measures to protect your data. However, no internet transmission is 100% secure. You are responsible for keeping your password confidential. You can manage your location settings through your mobile device. Disabling location services may prevent you from using the App.',
    },
  ],
};

export const termsContent = {
  effectiveDate: EFFECTIVE_DATE,
  sections: [
    {
      title: '1. Acceptance of Terms',
      description: 'By creating an account or using the Just Buy application, you agree to be bound by these Terms of Service ("Terms").',
    },
    {
      title: '2. The Service',
      description: 'Just Buy provides a platform for rapid delivery of groceries and essentials from local dark stores. Our goal is to complete delivery within 10 minutes.',
    },
    {
      title: '3. The 10-Minute Promise (Important)',
      description: 'Please read the following conditions regarding our delivery speed commitment:',
      bulletPoints: [
        'The 10-minute delivery promise is an **average service goal** and **not a guarantee** for every individual order.',
        'The promise applies only to areas within our defined delivery zone.',
        'Delays may occur due to external factors outside our control (e.g., severe weather, traffic restrictions, high order volume, or incorrect address provided by the user).',
        'Just Buy reserves the right to modify or withdraw any compensation related to delays at any time.',
      ],
    },
    {
      title: '4. User Obligations',
      description: 'You agree to:',
      listItems: [
        'Provide accurate and complete personal and delivery information.',
        'Be available at the specified address to receive the delivery.',
        'Not use the service for any unlawful or prohibited purpose.',
      ],
    },
    {
      title: '5. Cancellation and Refunds',
      description: 'Policies governing order modification:',
      listItems: [
        '**Cancellation Window:** Due to the rapid nature of our service, cancellation is only possible within the first 60 seconds after placing the order.',
        '**Refunds:** Products damaged upon receipt may be eligible for a refund or replacement. All refund requests are subject to review by the Just Buy support team.',
      ],
    },
  ],
};

export const faqData = [
    { 
        question: 'What is Just Buy?', 
        answer: 'Just Buy is a rapid delivery service that brings your groceries, snacks, and essentials from our local dark stores directly to your door in approximately 10 minutes.' 
    },
    { 
        question: 'How does the 10-minute delivery work?', 
        answer: 'We operate a network of small local warehouses (dark stores) stocked with essential items. Your order is processed immediately by the store closest to you, and dispatched by a rider via the quickest route.' 
    },
    { 
        question: 'What if my order is late?', 
        answer: 'While the 10-minute delivery is our goal, it is not a guarantee. If your order is significantly delayed due to our error, please contact customer support. We sometimes offer a store credit or voucher as compensation. Note: Severe traffic or weather conditions may impact speed.' 
    },
    { 
        question: 'What are your delivery hours?', 
        answer: 'Our typical delivery hours are 7:00 AM to 1:00 AM every day. Check the App for real-time hours and any local variations in your specific location.' 
    },
    { 
        question: 'Is there a minimum order value?', 
        answer: 'Yes, there is a minimum order value of $10 to qualify for delivery. This helps us maintain our rapid service efficiency.' 
    },
    { 
        question: 'Can I track my order in real-time?', 
        answer: 'Absolutely! Once your order is placed, you will receive a tracking link in the App showing the rider\'s progress and estimated arrival time.' 
    },
];

export const blogPosts = [
    {
        title: 'How Just Buy Delivers Groceries in 10 Minutes: A Deep Dive into Logistics',
        summary: 'We lift the curtain on the technology that powers our hyper-fast delivery system, covering dark store optimization and proprietary routing algorithms.',
        category: 'Logistics & Tech',
        categoryColor: 'primary',
        slug: '10-minute-logistics-deep-dive',
        date: 'Oct 20, 2024',
    },
    {
        title: 'New Arrivals: Fresh Produce Now in Stock!',
        summary: 'We’ve expanded our fresh selection! Learn how we maintain cold chain integrity for fruits and vegetables delivered in under 10 minutes.',
        category: 'Product News',
        categoryColor: 'success',
        slug: 'new-produce-arrivals',
        date: 'Oct 15, 2024',
    },
    {
        title: 'Meet Our Warehouse Team: The Real Speedsters',
        summary: 'A look at the dedicated team members who pack your order in 90 seconds flat. Their efficiency is key to the Just Buy promise.',
        category: 'Community',
        categoryColor: 'info',
        slug: 'meet-the-team',
        date: 'Oct 10, 2024',
    },
];
