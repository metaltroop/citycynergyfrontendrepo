import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import mhlogo from "../assets/mhgovlogo.png";
import axios from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setemailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://citysynergybackend.onrender.com/auth/login", {
        email,
        password,
        rememberMe,
      });
      // Save token to local storage or session storage
      localStorage.setItem("token", response.data.token);
      navigate("/"); // Navigate to dashboard or home page after login
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
    
     <div className="bg-white   flex items-center justify-center w-full h-screen relative">
     <img src="https://cdn.metaltroop.fun/loginboy.png" className="absolute z-0 4xl:-translate-x-[70%] 3xl:-translate-x-[60%] 2xl:-translate-x-[50%] xl:-translate-x-[45%] -translate-x-[100%]  -translate-y-20" alt="" />
      <div className="bg-[#f5f5f5] 2xl:w-1/4 xl:w-1/4 2xl:h-[85%] xl:h-3/4 w-full h-full p-5 rounded-2xl shadow-xl z-10">
      
        <div className="p-2">
          {/* Logo */}
          {/* Register Link */}
          <div className="flex justify-end mb-4">
            <Link to="/register" className="text-blue-500 hover:underline text-md mb-3 font-medium">
             Register &rarr;
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <img src={mhlogo} alt="Logo" className="w-20 h-20 mb-4" />
            <h2 className="text-xl sm:text-3xl font-semibold ">CITY SYNERGY</h2>
            <p className="text-center text-gray-500 mt-2 mb-8">
              Welcome Back !
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleLogin} className="">
            {/* email Field */}
            <div className="relative mb-6">
              <label
                className={`absolute left-2 transition-all duration-200 transform ${
                  emailFocused ? "-top-2.5 text-sm bg-white px-1" : "top-4 text-base"
                } text-gray-500`}
              >
                email
              </label>
              <input
                type="text"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 pt-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onFocus={() => setemailFocused(true)}
                onBlur={(e) => setemailFocused(e.target.value !== "")}
              />
            </div>
            {/* Password Field */}
            <div className="relative mb-6">
              <label
                className={`absolute left-2 transition-all duration-200 transform ${
                  passwordFocused ? "-top-2.5 text-sm bg-white px-1" : "top-4 text-base"
                } text-gray-500`}
              >
                Password
              </label>
              <input
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pt-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onFocus={() => setPasswordFocused(true)}
                onBlur={(e) => setPasswordFocused(e.target.value !== "")}
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 mb-4"
            >
              LOGIN
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
    </>

  );
};
