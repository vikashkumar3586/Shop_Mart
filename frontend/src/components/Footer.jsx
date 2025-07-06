import { assets } from '../assets/assets';

const Footer = () => {
    const linkSections = [
        {
            title: "Quick Links",
            links: [
                { name: "Home", href: "/" },
                { name: "Best Sellers", href: "/products" },
                { name: "Offers & Deals", href: "/products" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" }
            ]
        },
        {
            title: "Customer Support",
            links: [
                { name: "Delivery Info", href: "/delivery" },
                { name: "Return & Refund", href: "/returns" },
                { name: "Payment Options", href: "/payments" },
                { name: "Track Order", href: "/my-orders" },
                { name: "Help Center", href: "/help" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About ShopMart", href: "/about" },
                { name: "Careers", href: "/careers" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Seller Portal", href: "/seller" }
            ]
        }
    ];

    const socialLinks = [
        {
            name: "Facebook",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            ),
            href: "#"
        },
        {
            name: "Twitter",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
            ),
            href: "#"
        },
        {
            name: "Instagram",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-2.508 0-4.541-2.033-4.541-4.541s2.033-4.541 4.541-4.541 4.541 2.033 4.541 4.541-2.033 4.541-4.541 4.541zm7.119 0c-2.508 0-4.541-2.033-4.541-4.541s2.033-4.541 4.541-4.541 4.541 2.033 4.541 4.541-2.033 4.541-4.541 4.541z"/>
                </svg>
            ),
            href: "#"
        },
        {
            name: "LinkedIn",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            ),
            href: "#"
        }
    ];

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* ✅ Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    
                    {/* ✅ Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <img src={assets.ShopIcon} alt="Shop Mart" className="w-10 h-10" />
                            <h2 className="font-bold text-2xl text-orange-400">Shop Mart</h2>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Your trusted digital marketplace for hassle-free grocery shopping. From daily essentials to exclusive deals, we deliver convenience right to your doorstep.
                        </p>
                        
                        {/* ✅ Social Media Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Links Sections */}
                    {linkSections.map((section, index) => (
                        <div key={index} className="lg:col-span-1">
                            <h3 className="font-semibold text-lg text-white mb-6 border-b border-orange-400 pb-2 inline-block">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a 
                                            href={link.href} 
                                            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm flex items-center group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-px bg-orange-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ✅ Newsletter Section */}
                <div className="mt-16 pt-8 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
                            <p className="text-gray-300">Subscribe to get special offers, free giveaways, and exclusive deals.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-white placeholder-gray-400"
                            />
                            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* ✅ Bottom Copyright Section */}
            <div className="bg-gray-900 border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} Shop Mart. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <a href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a>
                            <a href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a>
                            <a href="/cookies" className="text-gray-400 hover:text-orange-400 transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;