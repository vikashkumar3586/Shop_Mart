import React from 'react';

const Contact = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
    <p className="text-gray-700 mb-4">
      Have questions or need help? Reach out to us!
    </p>
    <ul className="text-gray-700 mb-4">
      <li>Email: <a href="mailto:support@shopmart.com" className="text-blue-600 underline">support@shopmart.com</a></li>
      <li>Phone: +91 (555) 123-4567</li>
      <li>Address: 123 Market Street, Kakinada, India</li>
    </ul>
    <p className="text-gray-700">
      Our support team is available Monday to Saturday, 9am to 6pm.
    </p>
  </div>
);

export default Contact;