import React, { useEffect, useState, useRef } from "react";
import { fetchStatistics } from "../services/api";

const Statistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState(null);
  const prevMonthRef = useRef();

  useEffect(() => {
    console.log("Statistics component mounted or updated");
    console.log("Previous month:", prevMonthRef.current);
    console.log("Current month:", selectedMonth);
    
    if (!selectedMonth) {
      console.log("Selected month is null, skipping API call");
      return; 
    }

    const loadStatistics = async () => {
      try {
        const data = await fetchStatistics(selectedMonth);
        setStatistics(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    loadStatistics();
    prevMonthRef.current = selectedMonth;   
  }, [selectedMonth]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Overview for {selectedMonth}
      </h2>
      {statistics && Object.keys(statistics).length > 0 ? (
        <div className="space-y-2">
          <p className="text-gray-600">
            <strong>Total Transactions:</strong> {statistics.totalSoldItems || 0}
          </p>
          <p className="text-gray-600">
            <strong>Total Revenue:</strong> ${statistics.totalSales || 0}
          </p>
          <p className="text-gray-600">
            <strong>Products Sold:</strong> {statistics.totalSoldItems || 0}
          </p>
          <p className="text-gray-600">
            <strong>Products not Sold:</strong> {statistics.totalNotSoldItems || 0}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">
          No statistics available for the selected month.
        </p>
      )}
    </div>
  );
};

export default Statistics;