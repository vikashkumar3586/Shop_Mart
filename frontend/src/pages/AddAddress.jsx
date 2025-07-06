import React, { useState, useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AddAddress = () => {
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });

    const { axios, user, navigate, setShowUserLogin } = useContext(AppContext);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    // ✅ NEW: Phone validation function
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and limit to 10 digits
        if (/^\d{0,10}$/.test(value)) {
            setAddress({ ...address, phone: value });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (!user) {
                toast.error('Please login to add address');
                return;
            }
            
            // ✅ NEW: Phone validation before submit
            if (address.phone.length !== 10) {
                toast.error('Phone number must be 10 digits');
                return;
            }
            
            const { data } = await axios.post('/api/address/add', {
                address
            });
            if (data.success) {
                toast.success(data.message);
                navigate('/cart');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Add address error:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to add address');
            }
        }
    };

    useEffect(() => {
        if (!user) {
            toast.error('Please login to add address');
            setShowUserLogin(true);
        }
    }, [user, setShowUserLogin]);

    return (
        <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    
                    {/* ✅ Form Section */}
                    <div className='flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Address Details</h2>
                        
                        <form onSubmit={submitHandler} className='space-y-6'>
                            
                            {/* ✅ Name Fields */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name='firstName'
                                        value={address.firstName}
                                        onChange={handleChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name='lastName'
                                        value={address.lastName}
                                        onChange={handleChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                        required 
                                    />
                                </div>
                            </div>

                            {/* ✅ Email Field */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name='email'
                                    value={address.email}
                                    onChange={handleChange}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                    required 
                                />
                            </div>

                            {/* ✅ Street Address */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name='street'
                                    value={address.street}
                                    onChange={handleChange}
                                    placeholder="House number, street name, area"
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                    required 
                                />
                            </div>

                            {/* ✅ City and State */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name='city'
                                        value={address.city}
                                        onChange={handleChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name='state'
                                        value={address.state}
                                        onChange={handleChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                        required 
                                    />
                                </div>
                            </div>

                            {/* ✅ Zip Code and Country */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Zip Code *
                                    </label>
                                    <input
                                        type="text"
                                        name='zipCode'
                                        value={address.zipCode}
                                        onChange={handleChange}
                                        maxLength="6"
                                        placeholder="6-digit PIN code"
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        name='country'
                                        value={address.country}
                                        onChange={handleChange}
                                        defaultValue="India"
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                        required 
                                    />
                                </div>
                            </div>

                            {/* ✅ Phone Number with Enhanced Styling */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-sm">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        name='phone'
                                        value={address.phone}
                                        onChange={handlePhoneChange}
                                        placeholder="Enter 10-digit mobile number"
                                        className='w-full pl-12 pr-16 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                        maxLength="10"
                                        required 
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className={`text-xs ${address.phone.length === 10 ? 'text-green-500' : 'text-gray-400'}`}>
                                            {address.phone.length}/10
                                        </span>
                                    </div>
                                </div>
                                {address.phone.length > 0 && address.phone.length !== 10 && (
                                    <p className="text-red-500 text-xs mt-1">Phone number must be exactly 10 digits</p>
                                )}
                            </div>

                            {/* ✅ Submit Button */}
                            <div className='pt-4'>
                                <button
                                    type='submit'
                                    className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                >
                                    Save Address & Continue
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ✅ Image Section */}
                    <div className='flex-1 flex items-center justify-center lg:max-w-md'>
                        <div className='text-center'>
                            <img 
                                src={assets.add_address_iamge}
                                alt="Address Illustration" 
                                className='w-full max-w-sm mx-auto rounded-lg shadow-lg' 
                            />
                            <div className='mt-6 p-4 bg-indigo-50 rounded-lg'>
                                <h3 className='text-lg font-medium text-indigo-900 mb-2'>
                                    Secure Address Storage
                                </h3>
                                <p className='text-sm text-indigo-700'>
                                    Your address information is encrypted and stored securely for faster checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAddress;