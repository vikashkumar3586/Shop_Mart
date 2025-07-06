import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, navigate, setShowUserLogin, cartCount, searchQuery, setSearchQuery, logout } = useContext(AppContext);

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products");
        }
    }, [searchQuery]);

    const handleLogout = async () => {
        try {
            await logout();
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="bg-white border-b border-gray-300 sticky top-0 z-40">
            {/* ✅ Main Header - Same as SellerLayout */}
            <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-white shadow-sm">

                {/* ✅ Left Side - Logo */}
                <Link to="/">
                    <div className="flex items-center gap-3">
                        <img src={assets.ShopIcon} alt="Shop Mart" className='w-10 h-10' />
                        <h1 className='text-xl md:text-2xl font-bold text-orange-600'>Shop Mart</h1>
                    </div>
                </Link>

                {/* ✅ Center - Desktop Search */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-4 py-2 rounded-full max-w-md flex-1 mx-8">
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products..."
                    />
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

               
                <div className="flex items-center gap-4 md:gap-6">

                    {/* ✅ Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                        <Link to="/products" className="hover:text-indigo-600 transition-colors">All Products</Link>

                        <div onClick={() => navigate("/cart")} className="relative cursor-pointer hover:opacity-80 transition-opacity">
                            <img src={assets.cart_icon} alt="Cart" className='w-6 h-6' />
                            {cartCount() > 0 && (
                                <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {cartCount()}
                                </span>
                            )}
                        </div>

                        {user ? (
                            <div className='relative group'>
                                <img src={assets.profile_icon} alt="Profile" className='w-8 h-8 cursor-pointer rounded-full' />
                              
                                <ul className='hidden group-hover:block absolute top-8 right-0 bg-white shadow-lg rounded-md border border-gray-200 py-2 z-50 w-40 text-sm'>
                                    <li
                                        onClick={() => navigate("/my-orders")}
                                        className='px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors'
                                    >
                                        My Orders
                                    </li>
                                    <li
                                        onClick={handleLogout}
                                        className='px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors text-red-600'
                                    >
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowUserLogin(true)}
                                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white rounded-full"
                            >
                                Login
                            </button>
                        )}
                    </div>

                 
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

         
            <div className="md:hidden px-6 pb-4 bg-white border-b border-gray-100">
                <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 py-2 rounded-full">
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products..."
                    />
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-white/10 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            
            <aside className={`
                fixed md:hidden top-0 right-0 z-50
                w-80 h-full
                bg-white border-l border-gray-300 shadow-xl
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>

             
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <img src={assets.ShopIcon} alt="Shop Mart" className="w-8 h-8" />
                        <span className="font-bold text-orange-600">Shop Mart</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

               
                <nav className="pt-6 pb-4">
                    <div className="space-y-1">

                      
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center py-3 px-6 gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium">Home</span>
                        </Link>

                        <Link
                            to="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center py-3 px-6 gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="font-medium">All Products</span>
                        </Link>

                        <div
                            onClick={() => {
                                navigate("/cart");
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center py-3 px-6 gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <img src={assets.cart_icon} alt="Cart" className='w-5 h-5' />
                            <span className="font-medium">Cart ({cartCount()})</span>
                        </div>

                       
                        {user ? (
                            <>
                                <div className="border-t border-gray-200 mt-4 pt-4">
                                    <div className="px-6 py-2">
                                        <p className="text-sm text-gray-600">Signed in as:</p>
                                        <p className="font-medium text-gray-900">{user.name || 'User'}</p>
                                    </div>
                                </div>

                                <Link
                                    to="/my-orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center py-3 px-6 gap-3 hover:bg-gray-50 transition-colors"
                                >
                                    <img src={assets.profile_icon} alt="Orders" className='w-5 h-5' />
                                    <span className="font-medium">My Orders</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center py-3 px-6 gap-3 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                                >
                                    <svg className="w-5 h-5 cursor-pointer hover:bg-gray-50 transition-colors text-red-600 rounded p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="font-medium ">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="border-t border-gray-200 mt-4 pt-4 px-6">
                                <button
                                    onClick={() => {
                                        setShowUserLogin(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white rounded-lg font-medium"
                                >
                                    Login / Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>
        </div>
    );
};

export default Navbar;