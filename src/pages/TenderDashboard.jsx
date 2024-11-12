// TenderDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export const TenderDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [error, setError] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumns, setFilterColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tendersPerPage] = useState(10);
  const [pincode, setPincode] = useState(""); // State for pincode input
  const [clashResult, setClashResult] = useState(null); // State for storing clash results

  // Load all tenders on component mount
  const loadAllTenders = async () => {
    try {
      const response = await axios.get("https://citysynergybackend.onrender.com/tender/tenders");
      setTenders(response.data);
    } catch (err) {
      setError("Failed to load tenders",err);
    }
  };

  // Handle the checkClashes functionality
  const handleCheckClashes = async () => {
    try {
      const response = await axios.post("https://citysynergybackend.onrender.com/tender/checkclashes", {
        pincode,
      });
      setClashResult(response.data); // Update the clash result state with the response
    } catch (err) {
      setError("Failed to check clashes",err);
    }
  };

  const handleSearchAndFilter = async () => {
    try {
      const response = await axios.post("https://citysynergybackend.onrender.com/tender/tenders/filter", {
        search_by: searchBy,
        search_term: searchTerm,
        filter_columns: filterColumns,
      });
      setTenders(response.data);
    } catch (err) {
      setError("Search and filter failed",err);
    }
  };

  useEffect(() => {
    loadAllTenders();
  }, []);

  
  const toggleFilterColumn = (column) => {
    setFilterColumns((prevFilters) =>
      prevFilters.includes(column)
        ? prevFilters.filter((filter) => filter !== column)
        : [...prevFilters, column]
    );
  };

  // Pagination calculations
  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = tenders.slice(indexOfFirstTender, indexOfLastTender);

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-5">Tender Dashboard</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Search and Filter */}
      <div className="flex flex-row gap-3 ">
          <div className="">
              <div className="bg-white p-5 rounded-md shadow-md mb-5">
                <h2 className="text-2xl font-semibold mb-3">Search & Filter Tenders</h2>
          
                <div className="flex flex-col space-y-3">
                  <div className="flex space-x-2">
                    <select
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value)}
                      className="border p-2 rounded-md w-full"
                    >
                      <option value="">Select Search By</option>
                      <option value="Tender_ID">Tender ID</option>
                      <option value="Tender_By_Location">Location</option>
                      <option value="Tender_By_Department">Department</option>
                      <option value="Tender_By_Classification">Classification</option>
                      <option value="Tender_Status">Status</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Search Term"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border p-2 rounded-md w-full"
                    />
                  </div>
                  {/* Custom Multi-Select Filter Dropdown */}
                  <div className="relative bg-white border p-2 rounded-md">
                    <p className="mb-1 font-semibold">Filter Columns:</p>
                    <div className="max-h-40 overflow-y-scroll">
                      {[
                        "Tender_ID",
                        "Tender_By_Location",
                        "Tender_By_Department",
                        "Tender_By_Classification",
                        "Sanction_Date",
                        "Completion_Date",
                        "Sanction_Amount",
                        "Total_Duration_Days",
                        "Priorities",
                        "Cancel_Accept_Tenders",
                        "Reason_for_Decision",
                        "Tender_Status",
                        "Reason_for_Status",
                        "Completed_Pending",
                        "Tender_Acquired_By_Agency",
                        "pincode",
                      ].map((column) => (
                        <div key={column} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filterColumns.includes(column)}
                            onChange={() => toggleFilterColumn(column)}
                            className="form-checkbox"
                          />
                          <label>{column.replace(/_/g, " ")}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSearchAndFilter}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-3"
                >
                  Search & Filter
                </button>
              </div>
              {/* Tenders List */}
              <div className="bg-white p-5 rounded-md shadow-md mb-5">
                <h2 className="text-2xl font-semibold mb-3">Tenders List</h2>
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Tender ID</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">Department</th>
                      <th className="px-4 py-2">Classification</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTenders.map((tender) => (
                      <tr key={tender.Tender_ID}>
                        <td className="border px-4 py-2">{tender.Tender_ID}</td>
                        <td className="border px-4 py-2">{tender.Tender_By_Location}</td>
                        <td className="border px-4 py-2">{tender.Tender_By_Department}</td>
                        <td className="border px-4 py-2">{tender.Tender_By_Classification}</td>
                        <td className="border px-4 py-2">{tender.Tender_Status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                  >
                    Previous
                  </button>
                  <span>Page {currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastTender >= tenders.length}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                  >
                    Next
                  </button>
                </div>
              </div>
          </div>
          
          {/* Check Clashes Section */}
          <div className="bg-white p-5 rounded-md shadow-md mb-5">
            <h2 className="text-2xl font-semibold mb-3">Check Clashes</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
              <button
                onClick={handleCheckClashes}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Check Clashes
              </button>
            </div>
            {/* Clash Result Table */}
            {clashResult && clashResult.clashes && (
              <div className="bg-white p-5 rounded-md shadow-md mt-2 mb-5">
                <h3 className="text-2xl font-semibold mb-3">Clash Result:</h3>
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Tender ID</th>
                      <th className="px-4 py-2">Pincode</th>
                      <th className="px-4 py-2">Sanction Date</th>
                      <th className="px-4 py-2">Completion Date</th>
                      <th className="px-4 py-2">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clashResult.clashes.map((clash) => (
                      <tr key={clash.Tender_ID}>
                        <td className="border px-4 py-2">{clash.Tender_ID}</td>
                        <td className="border px-4 py-2">{clash.pincode}</td>
                        <td className="border px-4 py-2">{new Date(clash.Sanction_Date).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{new Date(clash.Completion_Date).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{clash.Priorities}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default TenderDashboard;
