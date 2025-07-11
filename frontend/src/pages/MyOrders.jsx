import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import placeholder from "../assets/placeholder.png";

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { axios, user } = useContext(AppContext);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('api/order/user');
            if (data.success) {
                setMyOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
            toast.error("Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const formatOrderDate = (order) => {
        const dateToFormat = order.orderDate || order.createdAt;
        if (!dateToFormat) return 'Date not available';
        
        try {
            return new Date(dateToFormat).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return 'Date not available';
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            const { data } = await axios.put(`/api/order/user/${orderId}/cancel`);
            
            if (data.success) {
                setMyOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId ? data.order : order
                    )
                );
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
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 py-6 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            
            {myOrders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No orders found</p>
                    <Link to="/products" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {myOrders.map((order, index) => (
                        <div key={order._id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {/* ✅ Order Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">
                                        Order #{order._id?.slice(-8) || `ORD${index + 1}`}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {formatOrderDate(order)}
                                    </p>
                                    
                                    {/* ✅ Quick Order Summary */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>{order.items?.length || 0} item(s)</span>
                                        <span>•</span>
                                        <span>{order.paymentType || 'COD'}</span>
                                        <span>•</span>
                                        <span>₹{order.amount}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    {/* ✅ Status Badges */}
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status || 'Processing'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            order.isPaid 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                    
                                    {/* ✅ Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            View Details
                                        </Link>
                                        
                                        {/* ✅ Cancel Button (only for Processing orders) */}
                                        {order.status === 'Processing' && (
                                            <button
                                                onClick={() => cancelOrder(order._id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* ✅ Product Preview (first 3 items) */}
                            <div className="border-t pt-4">
                                <div className="flex items-center gap-4 overflow-x-auto">
                                    {order.items?.slice(0, 3).map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center gap-2 flex-shrink-0">
                                            <img
                                                src={item.product?.image?.[0] || placeholder}
                                                alt={item.product?.name || 'Product'}
                                                className="w-12 h-12 object-cover rounded border"
                                                onError={(e) => { e.target.src = placeholder; }}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate max-w-[150px]">
                                                    {item.product?.name || 'Product Name'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded border text-xs text-gray-600">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;