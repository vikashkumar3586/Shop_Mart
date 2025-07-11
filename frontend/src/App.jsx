import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Auth from './models/Auth';
import ProductCategory from './pages/ProductCategory';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import AddAddress from './pages/AddAddress';
import SellerLayout from './pages/seller/SellerLayout';
import SellerLogin from './components/seller/SellerLogin';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Loading from './components/Loading';
import OrderDetails from './pages/seller/OrderDetails';
import UserOrderDetails from './pages/UserOrderDetails';


const App = () => {

  const { 
    isSeller,
    showUserLogin,
    isAuthLoading,
    isLoading,
  } = useContext(AppContext);
  const isSellerPath = useLocation().pathname.includes("seller");

   if (isAuthLoading) {
    return <Loading message="Checking authentication..." />;
  }

  return (
    <div className='text-default min-h-screen'>
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Auth /> : null}
      <Toaster />

      <div className='px-6 md:px-16 lg:px-24 xl:px-32'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/order/:orderId" element={<UserOrderDetails />} />
          <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path="product-list" element={isSeller ? <ProductList /> : null} />
            <Route path="orders" element={isSeller ? <Orders /> : null} />
            <Route path="orders/:orderId" element={isSeller ? <OrderDetails /> : null} />
          </Route>
        </Routes>
      </div>
      {isSellerPath ? null : <Footer />}
    </div>
  )
}

export default App