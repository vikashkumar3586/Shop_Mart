import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { axios } = useContext(AppContext);

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
            <h2 className="text-2xl font-semibold mb-6">Orders List</h2>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No orders found</p>
                </div>
            ) : (
                orders.map((order, index) => (
                    <div key={order._id || index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div>
                                    <h3 className="font-semibold text-lg">Order #{order._id?.slice(-8) || index + 1}</h3>
                                    <p className="text-sm text-gray-600">
                                        {order.orderDate
                                            ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : 'Date not available'
                                        }
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-semibold text-green-600">₹{order.amount}</p>
                                    <p className="text-sm text-gray-600">{order.paymentType}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <h4 className="font-medium text-gray-900 mb-3">Products</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                <img
                                                    className="w-16 h-16 object-cover rounded-md border"
                                                    src={item.product.image[0]}
                                                    alt={item.product.name}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ₹{item.product.offerPrice} × {item.quantity} = ₹{item.product.offerPrice * item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="font-medium text-gray-900">
                                                {order.address.firstName} {order.address.lastName}
                                            </p>
                                            <div className="text-sm text-gray-600 mt-1 space-y-1">
                                                <p>{order.address.street}</p>
                                                <p>{order.address.city}, {order.address.state}</p>
                                                <p>{order.address.zipcode}</p>
                                                <p>{order.address.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Order Status</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Payment:</span>
                                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${order.isPaid
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.isPaid ? "Paid" : "Pending"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Status:</span>
                                                <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                                    {order.status || "Processing"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;