import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { NavLink, Outlet } from 'react-router-dom';

const SellerLayout = () => {
    const { isSeller, setIsSeller, navigate, sellerLogout } = useContext(AppContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ Add mobile menu state

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    ];

    const handleLogout = async () => {
        try {
            await sellerLogout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ✅ Fixed Header */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    {/* ✅ Mobile Menu Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                    <img src={assets.ShopIcon} alt="Shop Mart" className="w-10 h-10" />
                    <h1 className="text-xl md:text-2xl font-bold text-orange-600">Shop Mart</h1>
                </div>
                
                <div className="flex items-center gap-3 md:gap-5 text-gray-600">
                    <p className="text-sm md:text-base">Hi! Admin</p>
                    <button 
                        onClick={handleLogout}
                        className="border border-gray-300 rounded-full text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* ✅ Main Content Area */}
            <div className="flex relative">
                
                {/* ✅ Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* ✅ Sidebar */}
                <aside className={`
                    fixed md:static top-0 left-0 z-30 md:z-auto
                    w-64 md:w-64 h-full md:h-auto
                    bg-white border-r border-gray-300 
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    md:transform-none
                `}>
                    
                    {/* ✅ Mobile Sidebar Header */}
                    <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <img src={assets.ShopIcon} alt="Shop Mart" className="w-8 h-8" />
                            <span className="font-bold text-orange-600">Shop Mart</span>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 rounded-md hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* ✅ Navigation Links */}
                    <nav className="pt-4 md:pt-6 pb-4">
                        <div className="space-y-1">
                            {sidebarLinks.map((item) => (
                                <NavLink 
                                    key={item.name}
                                    to={item.path}
                                    end={item.path === "/seller"}
                                    onClick={() => setIsSidebarOpen(false)} // Close mobile menu on click
                                    className={({ isActive }) => `
                                        flex items-center py-3 px-4 gap-3 transition-all duration-200
                                        ${isActive 
                                            ? "border-r-4 md:border-r-[6px] bg-indigo-50 border-indigo-500 text-indigo-600 font-medium" 
                                            : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    <img 
                                        src={item.icon} 
                                        alt={item.name} 
                                        className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" 
                                    />
                                    <span className="text-sm md:text-base font-medium">
                                        {item.name}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* ✅ Main Content */}
                <main className="flex-1 min-h-screen bg-gray-50">
                    <div className="h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;