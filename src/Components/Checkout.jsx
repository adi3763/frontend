import React from "react";
import image1 from "../assets/images/Mens/five.jpg";
import { Link } from "react-router-dom";
import Layout from "./Common/Layout";
import AddAddress from "./AddressComponent/AddAddress";
import AddressList from "./AddressComponent/AddressList";
import CheckoutSummary from "./AddressComponent/CartCheckout";

export default function Checkout() {
  const item = {
    title: "Yellow & White Dress Combination for Kids",
    price: 10,
    img: image1,
  };
  const shipping = 1;
  const subtotal = item.price;
  const total = subtotal + shipping;

  return (
    <>
    <Layout>
      <div className="container mx-auto px-4 lg:px-6">
      {/* Breadcrumb */}
      

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Billing Details */}
        {/* <AddAddress /> */}
        <AddressList />

        {/* Right: Items + Payment */}
        {/* <div className="lg:col-span-4 mt-10 mb-10">
          
          <h3 className="text-xl font-semibold text-gray-900  mb-10">Items</h3>
          <div className="border-t pt-6">
            <div className="flex items-start mt-5gap-4">
              <img
                src={item.img}
                alt={item.title}
                className="w-[70px] h-[70px] object-cover rounded"
              />
              <div>
                <div className="text-gray-900">{item.title}</div>
                <div className="mt-2 text-gray-800">${item.price}</div>
              </div>
            </div>

           
            <div className="mt-6 border-b" />
            <div className="space-y-3 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-gray-900">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Shipping</span>
                <span className="text-gray-900">${shipping}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>

       
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Payment Methods
          </h3>
          <div className="border-t pt-6">
            <div className="flex items-center gap-6 text-gray-800">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="payment" value="stripe" />
                <span>Stripe</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="payment" value="cod" defaultChecked />
                <span>COD</span>
              </label>
            </div>

            <button className="mt-6 rounded-md bg-teal-500 px-5 py-3 text-white hover:bg-teal-600 my-4">
              Pay Now
            </button>
          </div>
        </div> */}

<CheckoutSummary />

      </div>
      </div>
    </Layout>

    </>
  );
}
