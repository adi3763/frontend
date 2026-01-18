import React, { useState } from "react";

export default function AddressList() {
  const [selectedAddress, setSelectedAddress] = useState("1");

  const addresses = [
    {
      id: "1",
      name: "Aditya Anand",
      email: "aditya@example.com",
      address: "123 Main Street, Near Park",
      city: "Meerut",
      state: "Uttar Pradesh",
      zip: "250001",
      phone: "9876543210",
    },
    {
      id: "2",
      name: "Pranav Chamar",
      email: "chamarji@example.com",
      address: "456 GB Road, Block B",
      city: "Delhi",
      state: "Delhi",
      zip: "110001",
      phone: "9123456780",
    },
  ];

  return (
    <div className="lg:col-span-8 mb-10 lg:mb-10 mt-10 ">
      <div className="lg:col-span-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Select Billing Address
        </h2>

        <div className="grid gap-6">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`relative border rounded-xl p-5 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedAddress === addr.id
                  ? "border-blue-600 ring-2 ring-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="billingAddress"
                value={addr.id}
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
                className="sr-only"
              />

              {/* Radio circle in top-right */}
              <div className="absolute top-4 right-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAddress === addr.id
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  {selectedAddress === addr.id && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {addr.name}
                </p>
                <p className="text-gray-600">{addr.email}</p>
                <p className="text-gray-700 mt-2">
                  {addr.address}, {addr.city}, {addr.state} - {addr.zip}
                </p>
                <p className="text-gray-700 mt-1">Phone: {addr.phone}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
