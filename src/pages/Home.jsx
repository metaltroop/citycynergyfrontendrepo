import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="bg-white h-screen flex items-center justify-center" >
            <h1>Home</h1>
            <Link to={'/login'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</Link>
        </div>
    );
};