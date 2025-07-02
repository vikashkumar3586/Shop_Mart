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

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (!user) {
                toast.error('Please login to add address');
                return;
            }
            else {
                const { data } = await axios.post('/api/address/add', {
                    address
                });
                if (data.success) {
                    toast.success(data.message);
                    navigate('/cart');
                } else {
                    console.error(data.message);
                }
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
        <div className='mt-12 flex flex-col md:flex-row gap-6 p-6 
    bg-gray-100 rounded-lg shadow-md'>
            <div className='flex-1 bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-medium text-gray-700 mb-4'>Address Details</h2>
                <form action=""
                    onSubmit={submitHandler}
                    className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-gray-600'>First Name</label>
                        <input
                            type="text"
                            name='firstName'
                            value={address.firstName}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div>
                        <label className='block text-gray-600'>Last Name</label>
                        <input
                            type="text"
                            name='lastName'
                            value={address.lastName}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div className='col-span-2'>
                        <label className='block text-gray-600'>Email</label>
                        <input
                            type="email"
                            name='email'
                            value={address.email}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div className='col-span-2'>
                        <label className='block text-gray-600'>Street Address</label>
                        <input
                            type="text"
                            name='street'
                            value={address.street}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div>
                        <label className='block text-gray-600'>City</label>
                        <input
                            type="text"
                            name='city'
                            value={address.city}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div>
                        <label className='block text-gray-600'>State</label>
                        <input
                            type="text"
                            name='state'
                            value={address.state}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div>
                        <label className='block text-gray-600'>Zip Code</label>
                        <input
                            type="number"
                            name='zipCode'
                            value={address.zipCode}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div>
                        <label className='block text-gray-600'>Country</label>
                        <input
                            type="text"
                            name='country'
                            value={address.country}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div className='col-span-2'>
                        <label className='block text-gray-600'>Phone Number</label>
                        <input
                            type="number"
                            name='phone'
                            value={address.phone}
                            onChange={handleChange}
                            className='w-full p-2 border rounded-md'
                            required />
                    </div>
                    <div className='col-span-2'>
                        <button
                            type='submit'
                            className='w-full bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-md transition'>
                            Save Address
                        </button>
                    </div>
                </form>
            </div>


            <div className='flex-1 flex items-center justify-center'>
                <img src={assets.add_address_iamge}
                    alt="Address Illustration" className='w-full max-w-xs rounded-lg shadow-md' />

            </div>
        </div>

    )
}

export default AddAddress;