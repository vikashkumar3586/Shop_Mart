import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { use } from "react";
const Cart = () => {
    const { products, 
        navigate, 
        cartCount, 
        totalCartAmount, 
        cartItems, 
        removeFromCart, 
        updateCartItem,
        axios,
        user,
        setCartItems,
        setShowUserLogin,
        clearCart,
     } = useContext(AppContext);

    //state to store the products available in the cart
    const [cartArray, setCartArray] = useState([]);
    const [address, setAddress] = useState([]);
    //state to toggle the address dropdown
    const [showAddress, setShowAddress] = useState(false);
    //state for the selected address
    const [selectedAddress, setSelectedAddress] = useState(null);
    //state for payment option
    const [paymentOption, setPaymentOption] = useState('COD');

    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((product) => product._id === key);
            product.quantity = cartItems[key];
            tempArray.push(product);
        }
        setCartArray(tempArray);
    };

    const getAddress = async() => {
        try{
            const  {data} = await axios.get('/api/address/get');
            if(data.success) {
                setAddress(data.addresses);
                if(data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    useEffect(() => {
        if (user) {
            getAddress();
        }
    }, [user]);

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    // const placeOrder = async() => {
    //     try {
    //         //check if user is logged in
    //         if (!user) {
    //             toast.error('Please login to place order');
    //             setShowUserLogin(true);
    //             return;
    //         }

    //         if (!selectedAddress) {
    //             return toast.error("Please select an address");
    //         }
    //         //place order with cod
    //         if (paymentOption === 'COD') {
    //             const { data } = await axios.post('/api/order/cod', {
    //                 items: cartArray.map(item => ({
    //                     product: item._id,
    //                     quantity: item.quantity
    //                 })),
    //                 address: selectedAddress._id,
    //             });
    //             if (data.success) {
    //                 toast.success(data.message);
    //                 await clearCart();
    //                 navigate('/my-orders');
    //             } else {
    //                 toast.error(data.message);
    //             }
    //         }
    //         //place order with online payment
    //         else{
    //             const { data } = await axios.post('/api/order/online', {
    //                 items: cartArray.map((item) => ({
    //                     product: item._id,
    //                     quantity: item.quantity
    //                 })),
    //                 address: selectedAddress._id,
    //             });
    //             if (data.success) {
    //                 window.location.replace(data.url);
    //         }
    //     }

    //     } catch (error) {
    //         console.error("Error placing order:", error);
    //         if (error.response?.status === 401) {
    //         toast.error('Session expired. Please login again');
    //         setShowUserLogin(true);
    //     } else {
    //         toast.error(error.message);
    //     }
    //     }
    // }
// ...existing code...

const placeOrder = async() => {
    try {
        //check if user is logged in
        if (!user) {
            toast.error('Please login to place order');
            setShowUserLogin(true);
            return;
        }

        if (!selectedAddress) {
            return toast.error("Please select an address");
        }
        if (paymentOption === 'COD') {
            const { data } = await axios.post('/api/order/cod', {
                items: cartArray.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id,
            });
            if (data.success) {
                toast.success(data.message);
                await clearCart();
                navigate('/my-orders');
            } else {
                toast.error(data.message);
            }
        }
        
        else {
            const { data } = await axios.post('/api/order/online', {
                items: cartArray.map((item) => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id,
            });
            
            if (data.success) {
                const options = {
                    key: data.key, 
                    amount: data.amount,
                    currency: data.currency,
                    name: "Shop Mart",
                    description: "Order Payment",
                    image: "/logo.png", 
                    order_id: data.orderId,
                    handler: async (response) => {
                        
                        try {
                            const verifyResult = await axios.post('/api/order/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderDbId: data.orderDbId
                            });

                            if (verifyResult.data.success) {
                                toast.success("Payment successful!");
                                await clearCart();
                                navigate("/my-orders");
                            } else {
                                toast.error("Payment verification failed");
                            }
                        } catch (error) {
                            console.error("Payment verification error:", error);
                            toast.error("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
                        email: selectedAddress.email,
                        contact: selectedAddress.phone
                    },
                    notes: {
                        address: `${selectedAddress.street}, ${selectedAddress.city}`
                    },
                    theme: {
                        color: "#6366f1" 
                    },
                    modal: {
                        ondismiss: () => {
                            toast.error("Payment cancelled");
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                
            } else {
                toast.error(data.message || "Failed to initiate payment");
            }
        }

    } catch (error) {
        console.error("Error placing order:", error);
        if (error.response?.status === 401) {
            toast.error('Session expired. Please login again');
            setShowUserLogin(true);
        } else {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        }
    }
}


    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-indigo-500">{cartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => {
                                navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
                                scrollTo(0, 0);
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" 
                                src={product.image[0]} 
                                alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={(e) =>
                                            updateCartItem(product._id, Number(e.target.value))} value={cartItems[product._id]} className="outline-none"
                                        >
                                            {Array(
                                                cartItems[product._id] > 9 ? cartItems[product._id] : 9
                                            ).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">&#8377;{product.offerPrice * product.quantity}</p>
                        <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>)
                )}

                <button onClick={() => {
                    navigate('/products');
                    scrollTo(0, 0);
                }} className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium">
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#615fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                            {selectedAddress ?
                                `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` :
                                "No address found"}
                        </p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-indigo-500 hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {address.map((addr, index) => (
                                    <p
                                        key={index}
                                        onClick={() => {
                                            setSelectedAddress(addr);
                                            setShowAddress(false);
                                        }}
                                        className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer">
                                        {addr.street}, {addr.city}, {addr.state}, {addr.country}
                                    </p>
                                ))}
                                <p onClick={() => navigate('/add-address')} className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select 
                    onChange={(e) => setPaymentOption(e.target.value)} 
                    className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                    >
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>&#8377;{totalCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>&#8377;{(totalCartAmount() * 0.02).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>&#8377;{(totalCartAmount() * 1.02).toFixed(2)}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition">
                    {paymentOption === 'COD' ? 'Place Order' : 'Pay Now'}
                </button>
            </div>
        </div>) : null

}

export default Cart