import React from 'react'

export default function AddAddress() {
  return (
    <div className="lg:col-span-8 mb-10 lg:mb-0 mt-10">
                <div className="lg:col-span-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Billing Details
          </h2>
          <div className="border-t pt-6">
            {/* Row 1: Name / Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full border rounded-md px-4 py-3"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-md px-4 py-3"
              />
            </div>

            {/* Address */}
            <div className="mb-6">
              <textarea
                placeholder="Address"
                rows={3}
                className="w-full border rounded-md px-4 py-3"
              />
            </div>

            {/* Row 2: City / State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="City"
                className="w-full border rounded-md px-4 py-3"
              />
              <input
                type="text"
                placeholder="State"
                className="w-full border rounded-md px-4 py-3"
              />
            </div>

            {/* Row 3: Zip / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Zip"
                className="w-full border rounded-md px-4 py-3"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full border rounded-md px-4 py-3"
              />
            </div>
          </div>
        </div>
    </div>
  )
}
