import React, { useEffect, useState } from "react";
import MonthDropdown from "../components/MonthDropdown";
import TransactionTable from "../components/TransactionTable";
import BarChart from "../components/BarChart";
import Statistics from "../components/Statistics";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");

  useEffect(() => {
    console.log("Selected Month:", selectedMonth);
  }, [selectedMonth])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Transaction Dashboard
      </h1>
      <div className="space-y-6">
        <TransactionTable selectedMonth={selectedMonth} />
        <MonthDropdown
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <Statistics selectedMonth={selectedMonth} />
        <BarChart selectedMonth={selectedMonth} />
      </div>
    </div>
  );
};

export default Dashboard;
