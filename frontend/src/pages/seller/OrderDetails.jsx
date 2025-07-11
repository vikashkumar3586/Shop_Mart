import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { orderId } = useParams();
    const { axios } = useContext(AppContext);
    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/order/seller/${orderId}`);
            if (data.success) {
                setOrder(data.order);
            } else {
                toast.error(data.message);
                navigate('/seller/orders');
            }
        } catch (error) {
            toast.error("Error fetching order details");
            navigate('/seller/orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (newStatus) => {
        // ✅ Prevent status updates for cancelled orders
        if (order.status === 'Cancelled') {
            toast.error("Cannot update status of a cancelled order");
            return;
        }

        try {
            setUpdating(true);
            const { data } = await axios.put(`/api/order/seller/${orderId}/status`, {
                status: newStatus
            });

            if (data.success) {
                setOrder(data.order);
                toast.success(data.message || "Order status updated successfully");
            } else {
                toast.error(data.message || "Failed to update order status");
            }
        } catch (error) {
            console.error("Update status error:", error);

            if (error.response?.status === 404) {
                toast.error("Order not found");
            } else if (error.response?.status === 400) {
                toast.error("Invalid order status");
            } else {
                toast.error("Error updating order status");
            }
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Order not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* ✅ Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/seller/orders')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600">Order #{order._id?.slice(-8)}</p>
                </div>
            </div>

            {/* ✅ Order Card */}
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
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                    }`}>
                                    {order.status}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.isPaid ? "Paid" : "Pending"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* ✅ Left Column - Products */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Products ({order.items.length})</h4>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                        <img
                                            className="w-16 h-16 object-cover rounded"
                                            src={item.product.image[0]}
                                            alt={item.product.name}
                                        />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                                            <p className="text-sm text-gray-600">{item.product.category}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm">Qty: {item.quantity}</span>
                                                <span className="font-medium">₹{item.product.offerPrice * item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ✅ Order Summary */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-3">Order Summary</h5>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Payment Method:</span>
                                        <span className="font-medium">{order.paymentType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Items:</span>
                                        <span>{order.items.length} item(s)</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                        <span>Total Amount:</span>
                                        <span className="text-green-600">₹{order.amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Right Column - Management */}
                        <div className="space-y-6">

                            {/* Customer Details */}
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Customer Details</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {order.address.firstName} {order.address.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">📧 {order.address.email}</p>
                                            <p className="text-sm text-gray-600">📞 {order.address.phone}</p>
                                        </div>
                                        <div className="pt-2 border-t">
                                            <p className="text-sm font-medium text-gray-700 mb-1">📍 Delivery Address:</p>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>{order.address.street}</p>
                                                <p>{order.address.city}, {order.address.state}</p>
                                                <p>{order.address.zipCode}</p>
                                                <p>{order.address.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Order Status Management */}
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Order Status Management</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2">Current Status:</p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* ✅ Conditional Status Update Section */}
                                    {order.status === 'Cancelled' ? (
                                        <div className="border-t pt-4">
                                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-red-600">❌</span>
                                                    <p className="font-medium text-red-800">Order Cancelled</p>
                                                </div>
                                                <p className="text-sm text-red-700">
                                                    This order has been cancelled. No further status updates are allowed.
                                                </p>
                                            </div>
                                        </div>
                                    ) : order.status === 'Delivered' ? (
                                        <div className="border-t pt-4">
                                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-green-600">✅</span>
                                                    <p className="font-medium text-green-800">Order Delivered</p>
                                                </div>
                                                <p className="text-sm text-green-700">
                                                    This order has been successfully delivered and is complete.
                                                    No further status updates are allowed.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-t pt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-3">Update Status:</p>

                                            {/* ✅ Show available status options based on current status */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {order.status === 'Processing' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateOrderStatus('Shipped')}
                                                            disabled={updating}
                                                            className="px-3 py-2 text-xs rounded-md font-medium transition-colors bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300"
                                                        >
                                                            {updating ? '⏳' : '📦'} Ship Order
                                                        </button>
                                                        <button
                                                            onClick={() => updateOrderStatus('Delivered')}
                                                            disabled={updating}
                                                            className="px-3 py-2 text-xs rounded-md font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                                                        >
                                                            {updating ? '⏳' : '✅'} Mark Delivered
                                                        </button>
                                                        <button
                                                            onClick={() => updateOrderStatus('Cancelled')}
                                                            disabled={updating}
                                                            className="px-3 py-2 text-xs rounded-md font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                                                        >
                                                            {updating ? '⏳' : '❌'} Cancel Order
                                                        </button>
                                                    </>
                                                )}

                                                {order.status === 'Shipped' && (
                                                    <button
                                                        onClick={() => updateOrderStatus('Delivered')}
                                                        disabled={updating}
                                                        className="px-3 py-2 text-xs rounded-md font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                                                    >
                                                        {updating ? '⏳' : '✅'} Mark as Delivered
                                                    </button>
                                                )}
                                            </div>

                                            {/* ✅ Status Update Notes */}
                                            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                                                <p className="text-sm text-blue-700">
                                                    <strong>💡 Notes:</strong>
                                                </p>
                                                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                                    <li>• Orders can only progress forward (Processing → Shipped → Delivered)</li>
                                                    <li>• Shipped orders cannot be cancelled</li>
                                                    <li>• Delivered orders are final and cannot be changed</li>
                                                    <li>• Delivered orders automatically mark payment as complete</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ✅ Payment Information */}
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Payment Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Payment Method:</span>
                                        <span className="text-sm font-medium">{order.paymentType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Payment Status:</span>
                                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.isPaid ? "✅ Paid" : "⏳ Pending"}
                                        </span>
                                    </div>
                                    {order.paymentId && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Payment ID:</span>
                                            <span className="text-sm font-mono text-gray-800">{order.paymentId}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="text-sm font-semibold">Total Amount:</span>
                                        <span className="text-lg font-bold text-green-600">₹{order.amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;