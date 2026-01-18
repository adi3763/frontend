import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../Context/CartContext";
// import image1 from "../assets/images/Mens/five.jpg"; // fallback image
import { useNavigate } from "react-router-dom";

export default function CheckoutSummary() {
  const { cartItems, getCartItems } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  // Fetch cart items when component mounts
  useEffect(() => {
    getCartItems();
  }, []);

  // Subtotal calculation
  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce((s, it) => s + it.price * it.quantity, 0)
    : 0;
  const shipping = cartItems.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  // Checkout handler
  async function checkoutHandler() {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      // Example payload
      const payload = {
        items: cartItems.map((it) => ({
          product_id: it.product?.id,
          title: it.product?.title,
          quantity: it.quantity,
          price: it.price,
        })),
        subtotal,
        shipping,
        total,
        payment_method: paymentMethod,
      };

      // Call your backend API (replace /api/checkout with your route)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Checkout successful!");
        navigate("/order-success"); // redirect to order confirmation page
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to checkout. Try again later.");
    }
  }

  return (
    <div className="lg:col-span-4 mt-10 mb-10">
      {/* Items */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Items</h3>
      <div className="border-t pt-6">
        {Array.isArray(cartItems) && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 mb-4">
              <img
                src={item.product?.primary_image_url || image1}
                alt={item.product?.title}
                className="w-[70px] h-[70px] object-cover rounded"
              />
              <div>
                <div className="text-gray-900 font-medium">
                  {item.product?.title}
                </div>
                <div className="mt-2 text-gray-800">
                  ${item.price} × {item.quantity}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No items in cart</p>
        )}

        {/* Totals */}
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

      {/* Payment Methods */}
      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
        Payment Methods
      </h3>
      <div className="border-t pt-6">
        <div className="flex items-center gap-6 text-gray-800">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Stripe</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>COD</span>
          </label>
        </div>

        <button
          className="mt-6 w-full rounded-md bg-teal-500 px-5 py-3 text-white hover:bg-teal-600 my-4"
          onClick={checkoutHandler}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
