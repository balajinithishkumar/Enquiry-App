import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getData } from "country-list";
import Nav from "./Nav";
import apiURL from "./apiURL";

function PickupBooking() {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countryCodeToName, setCountryCodeToName] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const generateAWBNumber = () => {
    return String(Math.floor(100000 + Math.random() * 900000)).padStart(6, "0");
  };

  useEffect(() => {
    const countryData = getData();

    countryData.push({ code: "UAE", name: "United Arab Emirates" });
    countryData.push({ code: "EU", name: "Europe" });
    const topCountries = [
      "United States of America",
      "United Kingdom of Great Britain and Northern Ireland",
      "Canada",
      "Europe",
      "Singapore",
      "United Arab Emirates",
      "Malaysia",
      "Australia",
      "New Zealand",
      "China",
    ];

    // Sort countries alphabetically
    const sortedCountries = countryData.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Map top countries to their data
    const topCountryData = topCountries
      .map((name) => sortedCountries.find((country) => country.name === name))
      .filter(Boolean); // Remove any undefined entries

    // Filter out top countries from sorted list
    const remainingCountries = sortedCountries.filter(
      (country) => !topCountries.includes(country.name)
    );

    // Combine top countries with remaining countries
    const orderedCountries = [...topCountryData, ...remainingCountries];

    setCountries(orderedCountries);

    // Create a map of country codes to names
    const codeToNameMap = orderedCountries.reduce((acc, country) => {
      acc[country.code] = country.name;
      return acc;
    }, {});

    setCountryCodeToName(codeToNameMap);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const awbNumber = generateAWBNumber();
    console.log(`Generated AWB Number: ${awbNumber}`);

    try {
      const destinationCountryName =
        countryCodeToName[data.country] || data.country;

      const body = {
        sheet1: {
          name: data.name,
          email: data.email,
          phonenumber: data.number,
          longitude: data.longitude,
          latitude: data.latitude,
          pincode: data.pincode,
          destination: destinationCountryName, // Use full country name here
          weightapx: data.weight + " KG",
          pickupInstructions: data.instructions,
          awbNumber: awbNumber,
          pickupDatetime: data.pickupDate + " " + data.pickupTime,
          vendorName: data.vendor,
          status: "RUN SHEET",
          Pickuparea:data.pickuparea
        },
      };

      const response = await fetch(
        apiURL.SHEETYAPI,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const json = await response.json();
      console.log(json.sheet1);
      reset();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Nav />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4  flex-col gap-4">
        <h className="text-3xl font-bold">Sales</h>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-md shadow-none w-full max-w-4xl"
        >
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            Submit Pickup Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Name:
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
                className={`w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number:
              </label>
              <input
                type="text"
                placeholder="Enter your phone number"
                {...register("number", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid phone number",
                  },
                })}
                className={`w-full px-3 py-2 border ${
                  errors.number ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.number.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
              Email <span className="text-gray-500">(optional)</span>:
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Country:
              </label>
              <select
                {...register("country", { required: "Country is required" })}
                className={`w-full px-3 py-2 border ${
                  errors.country ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              >
                <option value="">Select your country</option>
                {countries.map((country) =>
                  country ? (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ) : null
                )}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Pickup Pincode:
              </label>
              <input
                type="text"
                placeholder="Enter your pincode"
                {...register("pincode", { required: "Pincode is required" })}
                className={`w-full px-3 py-2 border ${
                  errors.pincode ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pincode.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Pickup Area:
              </label>
              <input
                type="text"
                placeholder="Enter your pickup area"
                {...register("pickuparea", { required: "Pickup area is required" })}
                className={`w-full px-3 py-2 border ${
                  errors.pickuparea ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.pickuparea && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickuparea.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Weight (approx):
              </label>
              <input
                type="number"
                placeholder="Enter weight without units"
                {...register("weight", {
                  required: "Weight is required",
                  valueAsNumber: true,
                })}
                className={`w-full px-3 py-2 border ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.weight.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Vendor:
              </label>
              <select
                {...register("vendor", { required: "Vendor is required" })}
                className={`w-full px-3 py-2 border ${
                  errors.vendor ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              >
                <option value="">Select a vendor</option>
                <option value="DHL">DHL</option>
                <option value="Aramex">Aramex</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="Self">Self</option>
              </select>
              {errors.vendor && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.vendor.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Longitude:
              </label>
              <input
                type="text"
                placeholder="Enter your longitude"
                {...register("longitude", {
                  required: "Longitude is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.longitude ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.longitude && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.longitude.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Latitude:
              </label>
              <input
                type="text"
                placeholder="Enter your latitude"
                {...register("latitude", {
                  required: "Latitude is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.latitude ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.latitude && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.latitude.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Pickup Date:
              </label>
              <input
                type="date"
                {...register("pickupDate", {
                  required: "Pickup date is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.pickupDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.pickupDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickupDate.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Pickup Time:
              </label>
              <input
                type="time"
                {...register("pickupTime", {
                  required: "Pickup time is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.pickupTime ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.pickupTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickupTime.message}
                </p>
              )}
            </div>
           
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Special Instructions: <span className="text-gray-500">(optional)</span>:
              </label>
              <textarea
                placeholder="Enter any special instructions"
                {...register("instructions")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8847D9]"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`bg-[#8847D9] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PickupBooking;