import React from "react";
import Layout from "./Common/Layout";
import image1 from "../assets/images/Mens/five.jpg";
import image2 from "../assets/images/Mens/six.jpg";
import { useNavigate } from "react-router-dom";


export default function Cart() {
    const navigate = useNavigate();
  // dummy data
  const items = [
    {
      id: 1,
      title: "Dummy Product Title",
      price: 10,
      size: "S",
      qty: 1,
      img: image1,
    },
    {
      id: 2,
      title: "Dummy Product Title",
      price: 10,
      size: "S",
      qty: 1,
      img: image2,
    },
  ];

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = 5;
  const total = subtotal + shipping;

  return (

    <div>
        <Layout>

            <div className="container mx-auto px-4 lg:px-6">
      {/* Breadcrumb (optional) */}
      <div className="text-sm text-gray-500 mt-4 mb-6">
        Home <span className="mx-1">/</span> <span className="text-gray-800">Cart</span>
      </div>

      <h1 className="text-3xl font-semibold mb-4">Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Items */}
        <div className="lg:col-span-8">
          <div className="border-t">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="grid grid-cols-12 items-center gap-4 border-b py-6"
              >
                {/* Product cell */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  <img
                    src={it.img}
                    alt={it.title}
                    className="w-[70px] h-[90px] object-cover rounded"
                  />
                  <div>
                    <div className="text-gray-900 font-medium">{it.title}</div>
                    <div className="text-gray-800 mt-1">${it.price}</div>
                    <div className="mt-2">
                      <span className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm text-gray-700">
                        {it.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-6 md:col-span-3 flex md:justify-center">
                  <input
                    type="number"
                    min="1"
                    defaultValue={it.qty}
                    className="w-20 rounded-md border px-3 py-2 text-center outline-none focus:ring-1"
                  />
                </div>

                {/* Remove */}
                <div className="col-span-6 md:col-span-3 flex md:justify-end">
                  <button
                    aria-label="Remove"
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                    
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166M4.772 5.79c.34-.059.68-.114 1.022-.165M16.5 5.79l-.318-1.272A2.25 2.25 0 0014 2.5h-4a2.25 2.25 0 00-2.182 2.018L7.5 5.79m9 0h-9M5 5.79l.5 13.21a2.25 2.25 0 002.244 2h8.512a2.25 2.25 0 002.244-2L19 5.79"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-4">
          <div className="border rounded-md p-5">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-gray-900">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Shipping</span>
                <span className="text-gray-900">${shipping}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span>${total}</span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-md bg-teal-500 px-4 py-3 text-white hover:bg-teal-600"
            onClick={() => navigate('/checkout')}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
            </Layout>

    </div>
  );
}
