import React from 'react'

const PrivacyTerms = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy & Terms</h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Privacy Policy</h2>
        <p className="text-gray-700 mb-2">
          We value your privacy. Your personal information is kept confidential and will never be shared with third parties except as required by law or to provide our services.
        </p>
        <p className="text-gray-700">
          By using Shop Mart, you agree to our collection and use of information as described in this policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Terms & Conditions</h2>
        <p className="text-gray-700 mb-2">
          By accessing or using Shop Mart, you agree to abide by our terms and conditions. All content and services are provided "as is" without warranties of any kind.
        </p>
        <p className="text-gray-700">
          For any questions, please contact us at <a href="mailto:support@shopmart.com" className="text-blue-600 underline">support@shopmart.com</a>.
        </p>
      </section>
    </div>
  )
}

export default PrivacyTerms