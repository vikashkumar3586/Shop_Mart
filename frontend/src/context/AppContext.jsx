import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Authentication required');
        } else if (import.meta.env.DEV) {
            console.error('API Error:', error.response?.data?.message || error.message);
        }
        return Promise.reject(error);
    }
);

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [isUserAuth, setIsUserAuth] = useState(false);
    const [isSellerAuth, setIsSellerAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    //check seller status
    const fetchSeller = async () => {
        try {
            const { data } = await axiosInstance.get('/api/seller/is-auth');
            if (data.success) {
                setIsSeller(true);
                setIsSellerAuth(true);
            } else {
                setIsSeller(false);
                setIsSellerAuth(false);
            }
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error('Error fetching seller:', error);
            }
            setIsSeller(false);
            setIsSellerAuth(false);
        }
    };

    //check user status
    const fetchUser = async () => {
        try {
            setIsAuthLoading(true);
            const { data } = await axiosInstance.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                setIsUserAuth(true);
                if (data.user) {
                    const cartResponse = await axiosInstance.get('/api/cart/get');
                    if (cartResponse.data.success) {
                        setCartItems(cartResponse.data.cartItems);
                    }
                }
            } else {
                setUser(null);
                setIsUserAuth(false);
                setCartItems({});
            }
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error('Error fetching user:', error);
            }
            setUser(null);
            setIsUserAuth(false);
            setCartItems({});
        } finally {
            setIsAuthLoading(false);
        }
    };

    //fetch all products data
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                console.error('❌ Products fetch failed:', data.message);
                toast.error(data.message || 'Failed to fetch products');
                setProducts([]);
            }
        } catch (error) {
            console.error('❌ Fetch products error:', error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to fetch products';
            toast.error(errorMessage);
            setProducts([]);
        }
        finally {
            setIsLoading(false);
        }
    };


    const loadUserCart = async () => {
        try {
            if (!user) return;

            const { data } = await axiosInstance.get('/api/cart/get');
            if (data.success) {
                setCartItems(data.cartItems);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.error('❌ Load cart error:', error);
            }
        }
    };


    //add product to cart
    const addToCart = async (itemId) => {
        try {
            let cartData = structuredClone(cartItems || {});
            if (cartData[itemId]) {
                cartData[itemId] += 1;
            } else {
                cartData[itemId] = 1;
            }
            setCartItems(cartData);
            if (user) {
                await axiosInstance.post('/api/cart/update', { cartItems: cartData });
            }
            toast.success("Item added to cart");
        } catch (error) {
            toast.error('Failed to add item to cart');
        }
    };
    //update cart item
    const updateCartItem = async (itemId, quantity) => {
        try {
            let cartData = structuredClone(cartItems);
            if (quantity <= 0) {
                delete cartData[itemId];
            } else {
                cartData[itemId] = quantity;
            }
            setCartItems(cartData);
            if (user) {
                await axiosInstance.post('/api/cart/update', { cartItems: cartData });
            }
            toast.success("Cart updated successfully");
        } catch (error) {
            console.error('Update cart error:', error);
            toast.error('Failed to update cart');
        }
    };
    //total cart items
    const cartCount = () => {
        let totalCount = 0;
        for (let item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    };

    //total Cart Amount
    const totalCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += cartItems[items] * itemInfo.offerPrice;
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    //remove product from cart
    const removeFromCart = async (itemId) => {
        try {
            let cartData = structuredClone(cartItems);
            if (cartData[itemId]) {
                cartData[itemId] -= 1;
                if (cartData[itemId] === 0) {
                    delete cartData[itemId];
                }
                setCartItems(cartData);
                if (user) {
                    await axiosInstance.post('/api/cart/update', { cartItems: cartData });
                }
                toast.success("Item removed from cart");
            }
        } catch (error) {
            console.error('Remove from cart error:', error);
            toast.error('Failed to remove item from cart');
        }
    };
    //logout user
    const logout = async () => {
        try {
            const { data } = await axiosInstance.post('/api/user/logout');

            if (data.success) {
                setUser(null);
                setIsUserAuth(false);
                setCartItems({});
                navigate('/');
                toast.success('Logged out successfully');
            } else {
                toast.error(data.message || 'Logout failed');
            }
        } catch (error) {
            setUser(null);
            setIsUserAuth(false);
            setCartItems({});
            navigate('/');
            toast.error('Logout failed');
        }
    };


    const sellerLogout = async () => {
        try {
            const { data } = await axiosInstance.post('/api/seller/logout');
            if (data.success) {
                setIsSeller(false);
                navigate('/');
                toast.success('Logged out successfully');
            } else {
                toast.error(data.message || 'Logout failed');
            }
        } catch (error) {
            setIsSeller(false);
            navigate('/');
            toast.error('Logout failed');
        }
    };

    useEffect(() => {
        if (user && Object.keys(cartItems).length > 0) {
            const timeoutId = setTimeout(async () => {
                try {
                    await axiosInstance.post('/api/cart/update', { cartItems });
                } catch (error) {
                    console.error('Cart auto-save error:', error);
                }
            }, 2000);

            return () => clearTimeout(timeoutId);
        }
    }, [cartItems, user]);

    useEffect(() => {
        const initializeApp = async () => {
            await fetchProducts();
            await fetchSeller();
            await fetchUser();
        };

        initializeApp();
    }, []);
    useEffect(() => {
        if (user) {
            loadUserCart();
        } else {
            setCartItems({});
        }
    }, [user]);
    const clearCart = async () => {
        try {
            setCartItems({});

            if (user) {
                const { data } = await axiosInstance.delete('/api/cart/clear');
                if (data.success) {
                    console.log('✅ Cart cleared from database');
                }
            }
        } catch (error) {
            console.error('Clear cart error:', error);
        }
    };
    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        addToCart,
        updateCartItem,
        cartCount,
        totalCartAmount,
        removeFromCart,
        cartItems,
        setCartItems,
        searchQuery,
        setSearchQuery,
        axios: axiosInstance,
        fetchProducts,
        fetchSeller,
        fetchUser,
        logout,
        sellerLogout,
        isUserAuth,
        setIsUserAuth,
        isSellerAuth,
        setIsSellerAuth,
        clearCart,
        loadUserCart,
        isLoading,
        isAuthLoading,
        setIsLoading,


    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;