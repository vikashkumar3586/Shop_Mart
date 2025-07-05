import { useState,useContext } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const Auth = () => {
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setShowUserLogin, setUser, axios, navigate, setIsUserAuth } = useContext(AppContext);


    const submitHandler = async (e) => {
        setIsSubmitting(true);
       try{
        e.preventDefault();
        const {data} = await axios.post(`/api/user/${state}`, {
            name,
            email,
            password
        });
        if(data.success){
            toast.success(data.message);
            navigate("/");
            setUser(data.user);
            setIsUserAuth(true);
            setShowUserLogin(false);
        }
        else{
            toast.error(data.message);
        }     
       }catch(error){
        if (error.response) {
            const message = error.response.data?.message || 'Login failed';
            toast.error(message);
        } else if (error.request) {
            toast.error('Network error. Please check your connection.');
        } else {
            toast.error('Something went wrong. Please try again.');
        }
        
        if (import.meta.env.DEV) {
            console.error('Auth error:', error);
        }
       }finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div onClick={() => setShowUserLogin(false)} className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black/50 z-40 text-gray-600">
            <form 
                 onSubmit={submitHandler}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Register"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input 
                        onChange={(e) => setName(e.target.value)} 
                        value={name} 
                        placeholder="type here" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required
                        disabled={isSubmitting}  />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required 
                    disabled={isSubmitting}/>
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account?{" "} <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account?{" "}
                        <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">
                            click here
                        </span>
                    </p>
                )}
              <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all text-white w-full py-2 rounded-md flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            {state === "register" ? "Creating..." : "Logging in..."}
                        </>
                    ) : (
                        state === "register" ? "Create Account" : "Login"
                    )}
                </button>
            </form>
        </div>
    );
};
export default Auth;