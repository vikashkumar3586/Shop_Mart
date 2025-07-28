import React from 'react';

const Help = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <h1 className="text-3xl font-bold mb-6 text-center">Help Center</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
      <ul className="list-disc ml-6 text-gray-700">
        <li className="mb-2">
          <strong>How do I track my order?</strong><br />
          You can track your order from the "My Orders" section after logging in.
        </li>
        <li className="mb-2">
          <strong>How do I return a product?</strong><br />
          Visit the "Returns" page and follow the instructions to initiate a return.
        </li>
        <li>
          <strong>Need more help?</strong><br />
          Email us at <a href="mailto:support@shopmart.com" className="text-blue-600 underline">support@shopmart.com</a>
        </li>
      </ul>
    </section>
  </div>
);

export default Help;