import React, { useEffect, useState } from "react";
import two from "../../assets/images/Mens/two.jpg";
import axios from "axios";
import { apiUrl } from "../Http";
import { Link } from "react-router-dom";

export default function Featured() {
  // const items = Array(8).fill({
  //   img: two,
  //   title: "Featured Title",
  //   price: "$99.99",
  //   oldPrice: "$123",
  // });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchFeatured(){
    try{
      setLoading(true);
      const res = await axios.get(`${apiUrl}/admin/featured-products`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("adminToken")}`,
        }
      });

      setItems(res.data.data);
      console.log(res);
      
    }
    catch(err){
      console.error(err);
      setError("Failed to fetch featured products");
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchFeatured();
  },[]);

  return (
    
    <div className="px-20 py-20 bg-gray-100">
      
      <h2 className="text-3xl font-bold mb-12 text-gray-800 py-10">
         Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {items.map((item, index) => (
          <Link to={`/product/${item.id}`} key={index}>
          <div
            className="bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden hover:shadow-2xl hover:border-yellow-400 transition duration-300"
          >
            <div className="relative group">
              <img
                src={item.primary_image_url}
                alt={item.title}
                className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Featured
              </span>
            </div>

            <div className="p-5 text-center">
              <p className="text-lg font-semibold text-gray-800">
                {item.title}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="text-xl font-bold text-yellow-600">
                  {item.price}
                </span>{" "}
                <span className="line-through text-gray-400 text-sm">
                  {item.oldPrice}
                </span>
              </p>
              <button className="mt-5 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition duration-300 font-medium">
                Add to Cart
              </button>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
