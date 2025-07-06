import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import placeholder from "../assets/placeholder.png";

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const { axios, user } = useContext(AppContext);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('api/order/user');
            if (data.success) {
                setMyOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error fetching orders");
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

    return (
        <div className="px-4 md:px-8 py-6 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            
            {myOrders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No orders found</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {myOrders.map((order, index) => (
                        <div key={order._id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* ✅ Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Order ID: {order._id?.slice(-8) || `ORD${index + 1}`}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {formatOrderDate(order)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Payment: {order.paymentType || 'COD'}</p>
                                        <p className="text-xl font-semibold text-green-600 mt-1">
                                            Total Amount: ₹{order.amount}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items?.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.product?.image?.[0] || placeholder}
                                                alt={item.product?.name || 'Product'}
                                                className="w-16 h-16 object-cover rounded-md border"
                                                onError={(e) => { e.target.src = placeholder; }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {item.product?.name || 'Product Name'}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {item.product?.category || 'Category'}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm font-medium">
                                                        Quantity: {item.quantity}
                                                    </span>
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        ₹{item.product?.offerPrice * item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ✅ Order Status */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                        <div>
                                            <span className="text-sm text-gray-600">Order Status: </span>
                                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {order.status || 'Processing'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Payment: </span>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                                order.isPaid 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
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