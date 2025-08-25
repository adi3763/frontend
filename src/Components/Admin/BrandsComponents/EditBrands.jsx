import React, { useEffect, useState } from 'react'
import { apiUrl } from '../../Http';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../AdminCommon/AdminLayout';
import { Spinner } from 'react-bootstrap';

export default function EditBrands() {

    const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(""); 

  const [formData, setFormData] = useState({
    name: "",
    status: 1,
  });

  const changeHandler = (e) =>{
    const {name,value} = e.target;

    setFormData((prev)=>({
      ...prev,
      [name]: name === "status" ? Number(value) : value, // cast select to number
    }));
  }

  async function getBrand(id){
     setLoading(true);
    setSaving(true);
    setError("");
    try{
    
      const res = await axios.get(`${apiUrl}/admin/brand/${id}`,{
          headers:{
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        });
  
        console.log(res.data.data);

        const {name, status} = res.data.data || {};
        setFormData({
          name:name ?? "",
          status: Number(status ?? 1),
        });
  
      }catch(err){
        setError("Failed to update category.");
        console.error("Error updating category:", err);
      }
      finally {
      setSaving(false);
      setLoading(false);
    }
    }
  
    useEffect(()=>{
      if(id){
        getBrand(id);
      }
    },[id]);

    async function submitHandler(e){
      e.preventDefault();

      try{
        setLoading(true);
        const res = await axios.put(`${apiUrl}/admin/brand/${id}`,formData,{
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        });
        console.log(res.data);
        alert("Brand Updated Successfully");
        setLoading(false);
      }
      catch(err){
        console.log(err);
      } 
    }

    
  return (
    <div>
<AdminLayout>
<div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Edit Brands
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>


                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {loading ? (
            <p className="text-sm text-gray-500"><Spinner /></p>
          ) : (
            <form onSubmit={submitHandler} className="space-y-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={changeHandler}
                required
                className="w-full rounded border p-2 dark:bg-gray-700 dark:text-gray-100"
              />

              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={changeHandler}
                className="w-full rounded border p-2 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value={1}>Active</option>
                <option value={0}>Disable</option>
              </select>

              <button
                type="submit"
                disabled={saving}
                className=" my-2 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Submit"}
              </button>
            </form>
          )}
        </div>
  </AdminLayout>



    </div>
  )
}
