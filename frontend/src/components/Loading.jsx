import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";
const Loading = ({ message = "Loading..." }) => {
    const { navigate } = useContext(AppContext);
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const nextUrl = query.get("next");

    useEffect(() => {
        if (nextUrl) {
            setTimeout(() => {
                navigate(`/${nextUrl}`);
            }, 3000);
        }
    }, [nextUrl, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Please wait...</h1>
            <p className="text-gray-600 text-lg font-medium">{message}</p>
            
            {nextUrl && (
                <p className="text-gray-500 text-sm mt-2">
                    Redirecting to {nextUrl}...
                </p>
            )}
        </div>
    );
};

export default Loading;