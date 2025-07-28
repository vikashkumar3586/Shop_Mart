import React from 'react';

const Delivery = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <h1 className="text-3xl font-bold mb-6 text-center">Delivery Information</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Shipping Policy</h2>
      <p className="text-gray-700 mb-2">
        We deliver products across India. Orders are processed within 1-2 business days and shipped via trusted courier partners.
      </p>
      <p className="text-gray-700">
        Delivery times may vary by location, but most orders arrive within 3-7 business days. You will receive a tracking link once your order is shipped.
      </p>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Delivery Charges</h2>
      <p className="text-gray-700 mb-2">
        Delivery is free for orders above ₹500. For orders below ₹500, a flat shipping fee of ₹50 applies.
      </p>
    </section>
  </div>
);

export default Delivery;