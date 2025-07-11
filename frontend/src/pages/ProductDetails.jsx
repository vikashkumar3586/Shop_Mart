import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const ProductDetails = () => {
    const { products, addToCart, navigate } = useContext(AppContext);
    const { id } = useParams();
    const [thumbnail, setThumbnail] = useState(null);
    const product = products.find((product) => product._id === id);

    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null);
    }, [product]);

    return product && (
        <div className="mt-16 mb-16 px-4 md:px-8">
            {/* ✅ Breadcrumb Navigation */}
            <div className="mb-6">
                <p className="text-sm text-gray-600">
                    <Link to="/" className="hover:text-indigo-500 transition-colors">Home</Link> 
                    <span className="mx-2">/</span>
                    <Link to="/products" className="hover:text-indigo-500 transition-colors">Products</Link> 
                    <span className="mx-2">/</span>
                    <Link 
                        to={`/products/${product.category.toLowerCase()}`}
                        className="hover:text-indigo-500 transition-colors"
                    >
                        {product.category}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-indigo-500 font-medium">{product.name}</span>
                </p>
            </div>

            {/* ✅ Product Details Section */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                
                {/* ✅ Product Images */}
                <div className="flex gap-3 md:w-1/2">
                    {/* Thumbnail Images */}
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div 
                                key={index} 
                                onClick={() => setThumbnail(image)} 
                                className={`border max-w-24 border-gray-300 rounded overflow-hidden cursor-pointer hover:border-indigo-300 transition-colors ${
                                    thumbnail === image ? 'border-indigo-500 ring-2 ring-indigo-200' : ''
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Main Product Image */}
                    <div className="border border-gray-300 max-w-100 rounded overflow-hidden flex-1">
                        <img
                            src={thumbnail}
                            alt="Selected product"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* ✅ Product Information */}
                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium mb-3">{product.name}</h1>

                    {/* Product Rating */}
                    <div className="flex items-center gap-0.5 mb-6">
                        {Array(5).fill('').map((_, i) => (
                            <img
                                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                                alt="star"
                                key={i}
                                className="w-3 md:w-4"
                            />
                        ))}
                        <p className="text-base ml-2 text-gray-600">(4 reviews)</p>
                    </div>

                    {/* Product Pricing */}
                    <div className="mb-6 p-4  rounded-lg">
                        <p className="text-gray-500 line-through text-sm">MRP: ₹{product.price}</p>
                        <p className="text-2xl font-medium text-green-600">₹{product.offerPrice}</p>
                        <span className="text-gray-500 text-sm">(inclusive of all taxes)</span>
                        <div className="mt-2">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                            </span>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mb-8">
                        <p className="text-base font-medium mb-3">About Product</p>
                        <ul className="list-disc ml-4 text-gray-600 space-y-1">
                            {product.description.map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 text-base">
                        <button 
                            onClick={() => addToCart(product._id)} 
                            className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors rounded-md border border-gray-300"
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={() => {
                                addToCart(product._id);
                                navigate("/cart");
                            }}
                            className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors rounded-md"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;