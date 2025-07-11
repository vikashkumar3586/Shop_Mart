import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { axios } = useContext(AppContext);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('api/order/seller');
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error fetching orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="md:p-10 p-4 space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Orders List</h2>
                <p className="text-gray-600">{orders.length} orders found</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No orders found</p>
                    <p className="text-gray-400 text-sm">Orders will appear here when customers place them</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order, index) => (
                        <div 
                            key={order._id || index} 
                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/seller/orders/${order._id}`)}
                        >
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    
                                    {/* ✅ Left Side - Order Info */}
                                    <div className="flex items-center gap-4">
                                        {/* First Product Image */}
                                        {order.items && order.items.length > 0 && (
                                            <img
                                                className="w-16 h-16 object-cover rounded-md border"
                                                src={order.items[0].product.image[0]}
                                                alt={order.items[0].product.name}
                                            />
                                        )}
                                        
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                Order #{order._id?.slice(-8) || index + 1}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : 'Date not available'
                                                }
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ✅ Center - Customer Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="font-medium text-gray-900">
                                            {order.address?.firstName} {order.address?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.address?.city}, {order.address?.state}
                                        </p>
                                    </div>

                                    {/* ✅ Right Side - Amount & Status */}
                                    <div className="text-right">
                                        <p className="text-xl font-semibold text-green-600">₹{order.amount}</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                order.isPaid
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.isPaid ? "Paid" : "Pending"}
                                            </span>
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {order.status || "Processing"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ✅ View Details Arrow */}
                                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-indigo-600 text-sm font-medium">
                                        View Details
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
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

export default Orders;