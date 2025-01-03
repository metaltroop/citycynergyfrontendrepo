import { useState, useEffect } from "react";
import axios from "axios";

export const TenderDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [error, setError] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumns, setFilterColumns] = useState(["Tender_ID", "Tender_By_Location", "Tender_By_Department", "Tender_By_Classification", "Tender_Status"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tendersPerPage] = useState(10);
  const [pincode, setPincode] = useState("");
  const [clashResult, setClashResult] = useState(null);

  const loadAllTenders = async () => {
    try {
      setError("");
      const response = await axios.get("https://citysynergybackend.onrender.com/tender/tenders");
      setTenders(response.data);
    } catch (err) {
      setError("Failed to load tenders",err);
    }
  };

  const handleCheckClashes = async () => {
    if (!pincode) {
      setError("Please enter a pincode");
      return;
    }
    
    try {
      setError("");
      const response = await axios.post("https://citysynergybackendpython.onrender.com/check_clashes", {
        pincode,
      });
      
      if (response.data && response.data.clashes) {
        const sortedClashes = [...response.data.clashes].sort((a, b) => {
          const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
          return priorityOrder[a.Priorities] - priorityOrder[b.Priorities];
        });
        setClashResult({ ...response.data, clashes: sortedClashes });
      } else {
        setClashResult(response.data);
      }
    } catch (err) {
      setError("Failed to check clashes",err);
    }
  };

  const handleSearchAndFilter = async () => {
    try {
      setError("");
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
    if (filterColumns.length === 5 && !filterColumns.includes(column)) {
      return;
    }
    setFilterColumns((prevFilters) =>
      prevFilters.includes(column)
        ? prevFilters.filter((filter) => filter !== column)
        : [...prevFilters, column]
    );
  };

  const indexOfLastTender = currentPage * tendersPerPage;
  const indexOfFirstTender = indexOfLastTender - tendersPerPage;
  const currentTenders = tenders.slice(indexOfFirstTender, indexOfLastTender);

  return (
    <div className="container mx-auto p-3 md:p-5 bg-gray-100 min-h-screen">
      <h1 className="text-xl md:text-3xl font-semibold text-center text-blue-600 mb-3 md:mb-5">Tender Dashboard</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-3 md:p-5 rounded-md shadow-md mb-5">
            <h2 className="text-lg md:text-2xl font-semibold mb-3">Search & Filter Tenders</h2>

            <div className="flex flex-col space-y-3">
              <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
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
                <p className="mt-2 text-gray-500 text-sm">You can select up to 5 columns to display in the table.</p>
              </div>
            </div>
            <button
              onClick={handleSearchAndFilter}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-3 w-full md:w-auto"
            >
              Search & Filter
            </button>
          </div>
          
          <div className="bg-white p-3 md:p-5 rounded-md shadow-md mb-5">
            <h2 className="text-lg md:text-2xl font-semibold mb-3">Tenders List</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    {filterColumns.map((column) => (
                      <th key={column} className="px-2 md:px-4 py-2 text-xs md:text-sm">
                        {column.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentTenders.map((tender) => (
                    <tr key={tender.Tender_ID}>
                      {filterColumns.map((column) => (
                        <td key={`${tender.Tender_ID}-${column}`} className="border px-2 md:px-4 py-2 text-xs md:text-sm">
                          {tender[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 text-xs md:text-sm"
              >
                Previous
              </button>
              <span className="text-xs md:text-base">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastTender >= tenders.length}
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 text-xs md:text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-5 rounded-md shadow-md w-full lg:w-1/3">
          <h2 className="text-lg md:text-2xl font-semibold mb-3">Check Clashes</h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
            <button
              onClick={handleCheckClashes}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 w-full md:w-auto"
            >
              Check Clashes
            </button>
          </div>
          
          {clashResult && clashResult.clashes && clashResult.clashes.length > 0 && (
            <div className="bg-white p-3 md:p-5 rounded-md shadow-md mt-2">
              <h3 className="text-lg md:text-2xl font-semibold mb-3">Clash Result:</h3>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Tender ID</th>
                      <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Pincode</th>
                      <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Sanction Date</th>
                      <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Completion Date</th>
                      <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clashResult.clashes.map((clash) => (
                      <tr key={clash.Tender_ID}>
                        <td className="border px-2 md:px-4 py-2 text-xs md:text-sm">{clash.Tender_ID}</td>
                        <td className="border px-2 md:px-4 py-2 text-xs md:text-sm">{clash.pincode}</td>
                        <td className="border px-2 md:px-4 py-2 text-xs md:text-sm">{new Date(clash.Sanction_Date).toLocaleDateString()}</td>
                        <td className="border px-2 md:px-4 py-2 text-xs md:text-sm">{new Date(clash.Completion_Date).toLocaleDateString()}</td>
                        <td className="border px-2 md:px-4 py-2 text-xs md:text-sm">{clash.Priorities}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderDashboard;
