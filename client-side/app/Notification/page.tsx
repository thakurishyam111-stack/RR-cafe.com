"use client";

import { useState } from "react";
import axios from "axios";

export default function OrderNotification() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");

  const checkStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/phone${phone}`
      );

      setStatus(res.data.status);
    } catch (error) {
      setStatus("No Order Found");
    }
  };

  return (
    <div className="bg-gray-500 p-3 rounded-lg w-80 text-center flex-center ">
      <h2>Order Tracking</h2>

      <input
        type="phone"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={checkStatus}
        className="bg-blue-500 text-white px-4 py-2 ml-2"
      >
        Check
      </button>

      {status && (
        <div className="mt-3">
          <strong>Status:</strong> {status}
        </div>
      )}
    </div>
  );
}