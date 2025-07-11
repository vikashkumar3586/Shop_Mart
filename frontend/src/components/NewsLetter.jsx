import { useState } from "react";
import toast from "react-hot-toast";

const NewsLetter = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email address");
            return;
        }


        setIsSubscribed(true);
        
        // Reset after 3 seconds
        setTimeout(() => {
            setIsSubscribed(false);
            setEmail("");
        }, 3000);
    };

    return (
        <div className="md:col-span-1">
            <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
                Get special offers and updates.
            </p>
            
            {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-white placeholder-gray-400"
                        required
                    />
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded text-sm transition-colors duration-200"
                    >
                        Subscribe
                    </button>
                </form>
            ) : (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Thank you for subscribing!</span>
                    </div>
                    <p className="text-green-600 text-xs mt-1">
                        We'll keep you updated with our latest offers.
                    </p>
                </div>
            )}
        </div>
    );
};

export default NewsLetter;