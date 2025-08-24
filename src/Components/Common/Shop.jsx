import React from "react";
import Layout from "./Layout";
import BreadCrumb from "../BreadCrumb";
// import two if you already have it here; leaving structure unchanged
import five from "../../assets/images/Mens/five.jpg";
import { Link } from "react-router-dom";

export const Shop = () => {
  const items = Array(8).fill({
    img: five,
    title: "Featured Title",
    price: "$99.99",
    oldPrice: "$123",
  });

  return (
    <div className="">
      <Layout>
        

        {/* PAGE CONTAINER */}
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <BreadCrumb />
          {/* LEFT FILTERS + RIGHT PRODUCTS (same wrappers kept) */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Categories */}
           <div className="categories-box lg:col-span-3 space-y-6">
  <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
    <h2 className="mb-3 text-base font-semibold text-gray-800">Categories</h2>
    <ul className="space-y-2 text-sm">
      <li className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-gray-700">Kids</span>
      </li>
      <li className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-gray-700">Mens</span>
      </li>
      <li className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-gray-700">Kids</span>
      </li>
    </ul>
  </div>

  <div className="brands-box rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
    <h2 className="mb-3 text-base font-semibold text-gray-800">Brands</h2>
    <ul className="space-y-2 text-sm">
      <li className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-gray-700">Puma</span>
      </li>
      <li className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-gray-700">Killer</span>
      </li>
      <li className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-gray-700">Levis</span>
      </li>
      <li className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-gray-700">Flying Machine</span>
      </li>
    </ul>
  </div>
</div>


            {/* Products */}
           <div className="products-box lg:col-span-9">
  {/* <h2 className="mb-6 text-2xl font-bold text-gray-900">Products</h2> */}

  <div className="px-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
    {items.map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
      >
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-72 object-cover"
        />
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 cursor-pointer">
            <Link to={`/product`}>{item.title}</Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            <span className="text-base font-semibold text-gray-900">
              {item.price}
            </span>{" "}
            <span className="text-gray-400 line-through text-sm">
              {item.oldPrice}
            </span>
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

          </div>
        </div>
      </Layout>
    </div>
  );
};
