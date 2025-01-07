import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link as ScrollLink } from "react-scroll";
import axios from "axios";
import AsyncSelect from "react-select/async";
import "./home.css";

export const Home = () => {
  const [sticky, setSticky] = useState(false);
  const [pincode, setPincode] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedLocalArea, setSelectedLocalArea] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchAreas = async (inputValue) => {
    if (!pincode) return [];
    setError(null);
    try {
      const response = await axios.post(`https://citysynergybackend-jw8z.onrender.com/tender/tenders/filter`, {
        search_by: "pincode",
        search_term: pincode,
        filter_columns: ["area_name"]
      });

      // Get unique areas
      const areas = [...new Set(response.data.map(item => item.area_name))];
      return areas
        .filter(area => area?.toLowerCase().includes(inputValue?.toLowerCase()))
        .map(area => ({
          value: area,
          label: area
        }));
    } catch (error) {
      console.error("Error fetching areas:", error);
      setError("Failed to fetch areas. Please try again.");
      return [];
    }
  };

  const fetchLocalAreas = async (inputValue) => {
    if (!pincode || !selectedArea) return [];
    setError(null);
    try {
      const response = await axios.post(`https://citysynergybackend-jw8z.onrender.com/tender/tenders/filter`, {
        search_by: "area_name",
        search_term: selectedArea.value,
        filter_columns: ["local_area_name"]
      });

      // Get unique local areas
      const localAreas = [...new Set(response.data.map(item => item.local_area_name))];
      return localAreas
        .filter(area => area?.toLowerCase().includes(inputValue?.toLowerCase()))
        .map(area => ({
          value: area,
          label: area
        }));
    } catch (error) {
      console.error("Error fetching local areas:", error);
      setError("Failed to fetch local areas. Please try again.");
      return [];
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pincode || !selectedArea || !selectedLocalArea) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`https://citysynergybackend-jw8z.onrender.com/tender/tenders/filter`, {
        search_by: "pincode",
        search_term: pincode,
        filter_columns: ["*"]
      });
      
      const filteredTenders = response.data.filter(tender => 
        tender.area_name === selectedArea.value &&
        tender.local_area_name === selectedLocalArea.value &&
        tender.Cancel_Accept_Tenders === "Accepted"
      );
      
      setTenders(filteredTenders);
    } catch (error) {
      console.error("Error fetching tenders:", error);
      setError("Failed to fetch tenders. Please try again.");
      setTenders([]);
    } finally {
      setLoading(false);
    }
  };
  
    
  

  return (
    <div>
      <Navbar sticky={sticky} />
      {/* Section 1 */}
      <section
        id="home"
        className="bgimg h-screen flex items-center justify-center relative"
      >
        <div className="overlay"></div>
        <div className="text-center z-10">
          <h1 className="text-[150px] font-semibold text-white">
            CITY SYNERGY
          </h1>
          <p className="text-lg text-white mt-2">
            The Inter Departmental Co-Operation Software.
          </p>
        </div>
        {/* Floating Button */}
        <ScrollLink
          to="knowtenders"
          smooth={true}
          duration={500}
          className="absolute bottom-8 right-8 bg-blue-500 z-10 text-white font-bold py-3 px-5 rounded-full shadow-lg cursor-pointer hover:bg-blue-700"
        >
          Know Tenders in Your Area
        </ScrollLink>
      </section>

      {/* Section 2 */}
  
      <section id="about" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <span className="text-blue-500 font-medium tracking-wide">
              About Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What is CitySynergy ?<br className="hidden md:block" />
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Every great city thrives on collaboration, and we're here to make
              it seamless. Our platform is the bridge between innovation and
              coordination, connecting departments to transform urban governance
              into a powerhouse of efficiency and progress.
            </p>

            <div className="text-gray-900">
              <span className="font-medium">Basically Inter-Departmental Co-operation software  </span>
              <a
                href=""
                className="text-blue-500 hover:text-blue-200 transition-colors"
              >
                .
              </a>
            </div>

            <button  className="group relative px-8 py-3 border-2 border-blue-500 text-gray-900 font-medium hover:bg-blue-500 hover:text-white transition-all duration-300">
              Read More
              <span className="absolute -bottom-2 -right-2 w-full h-full border-2 border-gray-200 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300"></span>
            </button>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="relative">
              <img
                src="./banner.png"
                alt="Modern Interior"
                className="w-full h-full object-cover rounded-sm"
              />
              {/* Border decoration */}
              <div className="absolute  w-full h-full top-4 left-4 -z-10"></div>

              {/* Experience Counter
              <div className="absolute -bottom-10 left-10 bg-white p-6 shadow-xl">
                <div className="flex items-end gap-4">
                  <span className="text-6xl font-bold text-amber-500">5</span>
                  <div className="text-gray-900 font-medium leading-tight">
                    Years
                    <br />
                    Experience
                    <br />
                    Working
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
     {/* Search Section */}
     <section id="knowtenders" className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">Know Tenders in Your Area</h2>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-row gap-4 items-center justify-center mb-8">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter Pincode"
              className="w-48 border border-gray-300 rounded-md p-2"
            />
            <div className="w-64">
              <AsyncSelect
                cacheOptions
                loadOptions={fetchAreas}
                onChange={setSelectedArea}
                placeholder="Select Area"
                isDisabled={!pincode}
                noOptionsMessage={() => "No areas found"}
              />
            </div>
            <div className="w-64">
              <AsyncSelect
                cacheOptions
                loadOptions={fetchLocalAreas}
                onChange={setSelectedLocalArea}
                placeholder="Select Local Area"
                isDisabled={!pincode || !selectedArea}
                noOptionsMessage={() => "No local areas found"}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:bg-gray-400"
              disabled={loading || !pincode || !selectedArea || !selectedLocalArea}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          {/* Results Table */}
          {tenders.length > 0 && (
            <div className="overflow-x-auto shadow-lg rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-[#495057] text-white">
                  <tr>
                    <th className="p-3 text-left">Tender ID</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Classification</th>
                    <th className="p-3 text-left">Sanction Date</th>
                    <th className="p-3 text-left">Completion Date</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-center">Duration (Days)</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tenders.map((tender) => (
                    <tr key={tender.Tender_ID} className="hover:bg-gray-50">
                      <td className="p-3">{tender.Tender_ID}</td>
                      <td className="p-3">{tender.Tender_By_Department}</td>
                      <td className="p-3">{tender.Tender_By_Classification}</td>
                      <td className="p-3">{new Date(tender.Sanction_Date).toLocaleDateString()}</td>
                      <td className="p-3">{new Date(tender.Completion_Date).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR'
                        }).format(tender.Sanction_Amount)}
                      </td>
                      <td className="p-3 text-center">{tender.Total_Duration_Days}</td>
                      <td className="p-3">{tender.Tender_Status}</td>
                      <td className="p-3">{tender.Tender_Acquired_By_Agency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {tenders.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 mt-4">
              No accepted tenders found for the selected criteria.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
