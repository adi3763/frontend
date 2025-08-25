import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../AdminCommon/AdminLayout';
import { apiUrl } from '../../Http';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function ShowCategory() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  let count=0;

  const navigate = useNavigate();

  // Read token once (on mount). If your app can update tokens at runtime, lift this to context.
//   const token = useMemo(() => localStorage.getItem('adminToken') || '', []);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${apiUrl}/admin/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      setData(res.data.data || []);
      console.log(res.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, []);

function editHandler(id){
  // Navigate to the edit category page
    navigate(`/admin/category/${id}`);
  
}

async function deletCategory( id) {

    try{
        setLoading(true);
    const res = await axios.delete(`${apiUrl}/admin/category/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (res.status === 200) {
      alert("Category deleted successfully.");
      setLoading(false);
      setData((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Failed to delete category.");
    }
    }
    catch(e){
        alert("Failed to delete category."+ e);
        console.error("Error deleting category:", e);
    }

  }

  return (
    <div>
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
    Show Category
  </h1>

  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
  onClick={()=>{navigate('/admin/category')}}
  >
    Create New Category
  </button>
</div>

<div>
{loading && (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner animation="border" role="status" />
  </div>
)}
        {!loading && error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {data.length === 0 ? (
              <p className="text-sm text-gray-500">No categories found.</p>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className='px-5 py-3 text-left font-bold'>S. No</th>
                    <th className="px-5 py-3 text-left font-medium">Category ID</th>
                    <th className="px-5 py-3 text-left font-medium">Name</th>
                    <th className="px-5 py-3 text-left font-medium">Status</th>
                    <th className="px-5 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 dark:border-gray-700">
                       <td className='px-5 py-3'>{++count}</td> 
                      <td className="px-5 py-3">{c.id}</td>
                      <td className="px-5 py-3">{c.name}</td>
                      <td className="px-5 py-3">{c.status ? 'Active' : 'Inactive'}</td>
                      <td className="px-5 py-3">
                       <button className="text-blue-500 mx-4" onClick={(e)=>{editHandler( c.id)}}>
        <FontAwesomeIcon icon={faEdit} className='text-2xl ' /> 
      </button >
      <button onClick={(e)=>{e.preventDefault();confirm("Are you sure you want to delete this category?") && deletCategory(c.id)}} className="text-red-500 ">
        <FontAwesomeIcon icon={faTrash} className='text-2xl ' /> 
      </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

       </div>
      </AdminLayout>
    </div>
  );
}
