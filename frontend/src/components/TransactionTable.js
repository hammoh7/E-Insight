import React, { useState, useEffect } from "react";
import { fetchTransactions } from "../services/api";

const TransactionTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions(selectedMonth, searchText, page);
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    };
    loadTransactions();
  }, [selectedMonth, searchText, page]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Transactions</h2>
      <input
        type="text"
        placeholder="Search transactions"
        value={searchText}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Sold</th>
            <th className="border border-gray-300 p-2">Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="text-gray-700 hover:bg-gray-100"
              >
                <td className="border border-gray-300 p-2">{transaction.id}</td>
                <td className="border border-gray-300 p-2">
                  {transaction.title}
                </td>
                <td className="border border-gray-300 p-2">
                  {transaction.description}
                </td>
                <td className="border border-gray-300 p-2">
                  ${transaction.price}
                </td>
                <td className="border border-gray-300 p-2">
                  {transaction.category}
                </td>
                <td className="border border-gray-300 p-2">
                  {transaction.sold ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 p-2">
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    className="w-12 h-12 rounded"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 p-4">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={transactions.length === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
