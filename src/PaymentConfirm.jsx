import  { useState, useEffect } from "react";
import apiURL from "./apiURL";

function PaymentConfirm() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url =
      apiURL.SHEETYAPI;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json.sheet1);
        console.log(json.sheet1);
      });
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto overflow-x-auto p-4">
      <div className="flex flex-wrap gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex  w-full justify-between border border-gray-300 rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col mb-4 gap-2">
              {item.name && (
                <p className="text-base font-medium text-gray-700">
                  <strong className="text-gray-900">Name:</strong> {item.name}
                </p>
              )}
              <p className="text-base font-medium text-gray-700">
                <strong className="text-gray-900">AWB Number:</strong>{" "}
                {item.vendorAwbnumber || "-"}
              </p>
            </div>

            <div className="flex flex-col mb-4 gap-2">
              {item.phonenumber && (
                <p className="text-base font-medium text-gray-700">
                  <strong className="text-gray-900">Phone Number:</strong>{" "}
                  {item.phonenumber}
                </p>
              )}
              {item.destination && (
                <p className="text-base font-medium text-gray-700">
                  <strong className="text-gray-900">Destination:</strong>{" "}
                  {item.destination}
                </p>
              )}
            </div>

            <div className="flex flex-col mb-4 gap-2">
              <p className="text-base font-medium text-gray-700">
                <strong className="text-gray-900">Package Connected:</strong>{" "}
                {item.packageConnectedDataTime || "-"}
              </p>
              <p className="text-base font-medium text-gray-700">
                <strong className="text-gray-900">Final Weight:</strong>{" "}
                {item.actualWeight || "-"}
              </p>
            </div>

            <div className="flex flex-col mb-4 gap-2">
              <p className="text-base font-medium text-gray-700">
                <strong className="text-gray-900">PickUp Person Name:</strong>{" "}
                {item.PickUpPersonName || "-"}
              </p>
              <p className="text-base font-medium text-gray-700">
                <strong className="text-gray-900">
                  Pickup Completed DateTime:
                </strong>{" "}
                {item.PickupCompletedDatetime || "-"}
              </p>
              {item.RTOIfAny && (
                <p className="text-base font-medium text-blue-600">
                  <strong className="text-gray-900">RTO Information:</strong>{" "}
                  {item.RTOIfAny}
                </p>
              )}
            </div>

            {item.status && (
              <p className="text-base font-medium text-gray-700 mb-4 ">
                <strong className="text-gray-900">Status:</strong>
                <p className="bg-red-500 rounded-sm p-1 text-white text-sm">{item.status}</p>
              </p>
            )}

            <div className="flex justify-end">
              <button className="bg-purple-600 text-white  h-fit py-2 px-4 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors text-sm w-auto">
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentConfirm;
