import React from "react";

const MonthDropdown = ({ selectedMonth, setSelectedMonth }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <label htmlFor="month-select" className="sr-only">
        Select Month
      </label>
      <select
        value={selectedMonth}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      >
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthDropdown;
