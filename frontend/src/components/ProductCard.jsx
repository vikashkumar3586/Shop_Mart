import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const ProductCard = ({ product }) => {
    const { navigate, addToCart, cartItems, removeFromCart } = useContext(AppContext);
    
    return product && (
        <div 
            onClick={() => {
                if (product._id) {
                    navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
                } else {
                    console.warn("Product id is missing!", product);
                }
            }}
            className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-white w-full hover:shadow-md transition-shadow cursor-pointer"
        >
            {/* ✅ UPDATED: Smaller Image for Mobile */}
            <div className="group flex items-center justify-center mb-2 sm:mb-3">
                <img 
                    className="group-hover:scale-105 transition-transform duration-300 w-full h-24 sm:h-32 md:h-40 object-cover rounded" 
                    src={product.image[0]}
                    alt={product.name} 
                />
            </div>
            
            {/* ✅ UPDATED: Compact Details */}
            <div className="space-y-1 sm:space-y-2">
                {/* Category */}
                <p className="text-gray-500 text-xs uppercase tracking-wide">{product.category}</p>
                
                {/* Product Name */}
                <p className="text-gray-700 font-medium text-sm leading-tight truncate">{product.name}</p>

                {/* ✅ UPDATED: Compact Rating */}
                <div className='flex items-center gap-1'>
                    {Array(5).fill('').map((_, i) => (
                        <img
                            key={i}
                            src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                            alt='rating'
                            className='w-2.5 h-2.5 sm:w-3 sm:h-3'
                        />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(4)</span>
                </div>

                {/* ✅ UPDATED: Compact Price and Cart */}
                <div className="flex items-center justify-between mt-2">
                    {/* Price */}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-indigo-600">
                            ₹{product.offerPrice}
                        </span>
                        {product.price !== product.offerPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                ₹{product.price}
                            </span>
                        )}
                    </div>
                    
                    {/* ✅ UPDATED: Smaller Cart Button */}
                    <div 
                        className="text-indigo-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!cartItems?.[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded text-indigo-600 font-medium text-xs hover:bg-indigo-200 transition-colors" 
                                onClick={() => addToCart(product._id)}
                            >
                                <svg width="10" height="10" className="sm:w-3 sm:h-3" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="hidden sm:inline">Add</span>
                                <span className="sm:hidden">+</span>
                            </button>
                        ) : (
                            <div className="flex items-center justify-center bg-indigo-100 rounded overflow-hidden">
                                <button 
                                    onClick={() => removeFromCart(product._id)} 
                                    className="px-1.5 py-1 sm:px-2 sm:py-1.5 hover:bg-indigo-200 transition-colors text-indigo-600 font-medium text-xs"
                                >
                                    -
                                </button>
                                <span className="px-1.5 py-1 sm:px-2 sm:py-1.5 text-indigo-600 font-medium text-xs min-w-6 sm:min-w-8 text-center">
                                    {cartItems[product._id]}
                                </span>
                                <button 
                                    onClick={() => addToCart(product._id)} 
                                    className="px-1.5 py-1 sm:px-2 sm:py-1.5 hover:bg-indigo-200 transition-colors text-indigo-600 font-medium text-xs"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard