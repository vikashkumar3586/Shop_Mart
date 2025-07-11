import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import placeholder from "../assets/placeholder.png";

const UserOrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const { orderId } = useParams();
    const { axios } = useContext(AppContext);
    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/order/user`);
            if (data.success) {
                const foundOrder = data.orders.find(o => o._id === orderId);
                if (foundOrder) {
                    setOrder(foundOrder);
                } else {
                    toast.error("Order not found");
                    navigate('/my-orders');
                }
            }
        } catch (error) {
            toast.error("Error fetching order details");
            navigate('/my-orders');
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            setCancelling(true);
            const { data } = await axios.put(`/api/order/user/${orderId}/cancel`);
            
            if (data.success) {
                setOrder(data.order);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Cancel order error:", error);
            if (error.response?.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Error cancelling order");
            }
        } finally {
            setCancelling(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">Order not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/my-orders')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to My Orders
                </button>
                <div>
                    <h1 className="text-2xl font-bold">Order Details</h1>
                    <p className="text-gray-600">Order #{order._id?.slice(-8)}</p>
                </div>
            </div>

            {/* Rest of the component from Step 3 in previous response */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg">Order #{order._id?.slice(-8)}</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">₹{order.amount}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.isPaid ? "Paid" : "Pending"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Products */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Products ({order.items.length})</h4>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                        <img
                                            className="w-16 h-16 object-cover rounded"
                                            src={item.product?.image?.[0] || placeholder}
                                            alt={item.product?.name || 'Product'}
                                        />
                                        <div className="flex-1">
                                            <h5 className="font-medium">{item.product?.name}</h5>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-medium">₹{item.product?.offerPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="space-y-6">
                            {/* Delivery Address */}
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Delivery Address</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                                    <p className="text-sm text-gray-600">{order.address.email}</p>
                                    <p className="text-sm text-gray-600">{order.address.phone}</p>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>{order.address.street}</p>
                                        <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                                        <p>{order.address.country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Actions */}
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Order Actions</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {order.status === 'Processing' && (
                                        <button
                                            onClick={cancelOrder}
                                            disabled={cancelling}
                                            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                        </button>
                                    )}
                                    {order.status === 'Shipped' && (
                                        <div className="text-center">
                                            <p className="text-blue-600 font-medium">📦 Your order is on the way!</p>
                                            <p className="text-sm text-gray-600 mt-1">Order cannot be cancelled once shipped</p>
                                        </div>
                                    )}
                                    {order.status === 'Delivered' && (
                                        <div className="text-center">
                                            <p className="text-green-600 font-medium">✅ Order Delivered Successfully!</p>
                                            <p className="text-sm text-gray-600 mt-1">Thank you for shopping with us</p>
                                        </div>
                                    )}
                                    {order.status === 'Cancelled' && (
                                        <div className="text-center">
                                            <p className="text-red-600 font-medium">❌ Order Cancelled</p>
                                            <p className="text-sm text-gray-600 mt-1">This order has been cancelled</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrderDetails;