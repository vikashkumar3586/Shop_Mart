import React from 'react';

const Returns = () => (
  <div className="max-w-3xl mx-auto py-16 px-4">
    <h1 className="text-3xl font-bold mb-6 text-center">Returns & Refunds</h1>
    <p className="text-gray-700 mb-4">
      If you are not satisfied with your purchase, you can return most items within 30 days of delivery.
    </p>
    <ul className="list-disc ml-6 text-gray-700 mb-4">
      <li>Items must be unused and in original packaging.</li>
      <li>Refunds are processed within 5-7 business days after we receive your return.</li>
      <li>Shipping charges are non-refundable unless the item is defective.</li>
    </ul>
    <p className="text-gray-700">
      To start a return, please contact us at <a href="mailto:support@shopmart.com" className="text-blue-600 underline">support@shopmart.com</a>.
    </p>
  </div>
);

export default Returns;