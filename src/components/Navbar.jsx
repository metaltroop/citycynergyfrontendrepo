import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Navbar({ sticky }) {
  return (
    <div className={`fixed w-full ${sticky ? "bg-[#dee2e6] z-12 rounded-full mt-4 mx-2 w-[99%] justify-center p-1 shadow-lg" : "bg-transparent"} z-20 transition-all duration-300`}>
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <img src="./citylogo.png" alt="Logo" className="w-24 h-20" />
            <h1 className={` text-2xl font-semibold  hover:text-[#343a40] cursor-pointer ${sticky ? "text-gray-800 " : "hidden"}`}
            >City Synergy</h1>
          </div>

          <div className="hidden md:flex justify-center items-center space-x-8">
            <ScrollLink
              to="home"
              smooth={true}
              duration={500}
              className={` font-semibold hover:text-[#343a40] cursor-pointer ${sticky ? "text-gray-800" : "text-white"}`}
            >
              Home
            </ScrollLink>
            <ScrollLink
              to="about"
              smooth={true}
              duration={500}
              className={` font-semibold hover:text-[#343a40] cursor-pointer ${sticky ? "text-gray-800" : "text-white"}`}
            >
              About
            </ScrollLink>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </Link>
          </div>

          <div className="md:hidden">
            {/* Add mobile menu toggle here */}
            <button className="text-black">☰</button>
          </div>
        </div>
      </div>
    </div>
  );
}
