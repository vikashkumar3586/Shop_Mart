import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import placeholder from "../assets/placeholder.png"; 

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useContext(AppContext);
  const fetchOrders = async () => {
    // Fetch orders logic here
    try{
      const {data} = await axios.get('api/order/user');
      console.log(data);
      if(data.success){
        setMyOrders(data.orders)
        console.log(data.orders)
      }else{
        toast.error(data.message)
      }
    }catch{
      toast.error("Failed to fetch orders");
    }
  };
  useEffect(() => {
    if(user){
      fetchOrders();
    }
  }, [user]);
  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl font-medium md:text-3xl">My Orders</p>
      </div>
      {myOrders.map((order, index) => (
        <div key={index} className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
          <p className="flex justify-between items-center  gap-6">
            <span>
              Order ID: {order._id}
            </span>
            <span>
              Payment : {order.paymentType}
            </span>
            <span>
              Total Amount: &#8377;{order.amount}
            </span>
          </p>
          {
            order.items.map((item, index) => (
              <div key={index} className={`relative bg-white text-gray-800 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 w-full max-w-4xl`}>
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="p-4 rounded-lg">
                    <img 
                    
                     src={item.product.image[0] || placeholder}
                    alt={item.product.name} className="w-16 h-16" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium">{item.product.name}</h2>
                    <p>{item.product.category}</p>
                  </div>
                </div>
                <div className="text-lg font-medium">
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Price: &#8377;{item.product.offerPrice || 0}</p>
                </div>
                <p className="text-lg">
                  Amount: &#8377;{(item.product.offerPrice || 0) * (item.quantity || 1)}
                </p>

              </div>
            ))
          }
        </div>

      ))}
    </div>
  )
}
export default MyOrders