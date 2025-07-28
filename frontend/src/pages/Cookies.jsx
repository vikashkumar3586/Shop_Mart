import React from 'react';

const Cookies = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <h1 className="text-3xl font-bold mb-6 text-center">Cookie Policy</h1>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-2">What Are Cookies?</h2>
      <p className="text-gray-700 mb-2">
        Cookies are small text files stored on your device by your browser. They help websites remember your preferences and improve your browsing experience.
      </p>
    </section>
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-2">How We Use Cookies</h2>
      <p className="text-gray-700 mb-2">
        We use cookies to:
      </p>
      <ul className="list-disc ml-6 text-gray-700">
        <li>Remember your login and preferences</li>
        <li>Analyze site traffic and usage</li>
        <li>Provide relevant offers and content</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Managing Cookies</h2>
      <p className="text-gray-700 mb-2">
        You can control or delete cookies in your browser settings. Disabling cookies may affect your experience on our site.
      </p>
      <p className="text-gray-700">
        For questions, contact us at <a href="mailto:support@shopmart.com" className="text-blue-600 underline">support@shopmart.com</a>.
      </p>
    </section>
  </div>
);

export default Cookies;