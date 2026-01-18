import React, { useContext, useEffect } from "react";
import Layout from "./Common/Layout";
import image1 from "../assets/images/Mens/five.jpg";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./Context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, getCartItems, removeFromCart } = useContext(CartContext);

  // Fetch cart items on mount
  useEffect(() => {
    getCartItems();
  }, []);

  // Subtotal calculation
  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce((s, it) => s + it.price * it.quantity, 0)
    : 0;
  const shipping = cartItems.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  function checkoutHandler() {
    if (cartItems.length > 0) {
      navigate("/checkout");
    }
    else {
      alert("Your cart is empty");
    }
  }

  return (
    <div>
      <Layout>
        <div className="container mx-auto px-4 lg:px-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mt-4 mb-6">
            Home <span className="mx-1">/</span>{" "}
            <span className="text-gray-800">Cart</span>
          </div>

          <h1 className="text-3xl font-semibold mb-4">Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Items */}
            <div className="lg:col-span-8">
              <div className="border-t">
                {Array.isArray(cartItems) && cartItems.length > 0 ? (
                  cartItems.map((it) => (
                    <div
                      key={it.id}
                      className="grid grid-cols-12 items-center gap-4 border-b py-6"
                    >
                      {/* Product cell */}
                      <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                        <img
                          src={it.product?.primary_image_url || image1}
                          alt={it.product?.title || "No title"}
                          className="w-[70px] h-[90px] object-cover rounded"
                        />
                        <div>
                          <div className="text-gray-900 font-medium">
                            {it.product?.title}
                          </div>
                          <div className="text-gray-800 mt-1">
                            ${it.price}
                          </div>
                          <div className="mt-2">
                            <span className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm text-gray-700">
                              {"S"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-6 md:col-span-3 flex md:justify-center">
                        <input
                          type="number"
                          min="1"
                          value={it.quantity}
                          className="w-20 rounded-md border px-3 py-2 text-center outline-none focus:ring-1"
                          readOnly
                        />
                      </div>

                      {/* Remove */}
                      <div className="col-span-6 md:col-span-3 flex md:justify-end">
                        <button
                          aria-label="Remove"
                          className="p-2 text-gray-600 hover:text-red-600"
                          onClick={() => removeFromCart(it.id)}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-gray-600">Your cart is empty</p>
                )}
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

                <button
                  className="mt-6 w-full rounded-md bg-teal-500 px-4 py-3 text-white hover:bg-teal-600"
                  onClick={checkoutHandler}
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
