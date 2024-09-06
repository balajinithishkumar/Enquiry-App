import { useState, useEffect } from "react";
import apiURL from "./apiURL";
import Nav from "./Nav";
import PaymentConfirmCard from "./PaymentConfirmCard";

function PaymentConfirm() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("PAYMENT PENDING");

  useEffect(() => {
    const url = apiURL.SHEETYAPI;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json.sheet1);
      });
  }, []);

  const filteredData = data.filter((item) => item.status === activeTab);

  return (
    <div className="">
      <Nav />
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-center space-x-4 mt-5">
          <button
            className={`py-2 px-4 ${
              activeTab === "PAYMENT PENDING" ? "bg-purple-600 text-white" : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("PAYMENT PENDING")}
          >
            Payment Pending
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "PAYMENT DONE" ? "bg-purple-600 text-white" : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("PAYMENT DONE")}
          >
            Payment Done
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-10 p-7">
          {filteredData.map((item, index) => (
            <PaymentConfirmCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentConfirm;
