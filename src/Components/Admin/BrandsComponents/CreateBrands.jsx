import React, { useEffect, useState } from 'react'
import AdminLayout from '../AdminCommon/AdminLayout'
import { Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../Http';

export default function CreateBrands() {



  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name:"",
    status:1,
  });

  const changeHandler = (e) => {
    const {name, value} = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]: name === "status" ? Number(value) : value, // cast select to number
    }));
  }



  const submitHandler = async (e) => {
    e.preventDefault();
    // Handle form submission
    try{
      setLoading(true);
      const res = await axios.post(`${apiUrl}/admin/brand`, formData,{
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      });

      console.log(res.data);
      alert("Brand Added Successfully");
      setLoading(false);
      
    }catch(err){
      setLoading(false);
      console.log(err);
    }
    finally{
      setLoading(false);
      formData.name="";
      formData.status=1;
    }
  }

  return (
    <div>
      <AdminLayout>
                <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Create New Brand
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>

               <div className="bbg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner animation="border" />
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              {/* Brand Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  placeholder="Enter Brand Name"
                  required
                  onChange={changeHandler}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={changeHandler}
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Status</option>
                  <option value={1}>Active</option>
                  <option value={0}>Disabled</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </AdminLayout>
    </div>
  )
}
