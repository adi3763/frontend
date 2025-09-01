import React, { useEffect, useState } from 'react';
import AdminLayout from '../AdminCommon/AdminLayout';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../Http';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ShowProducts() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Safely build an absolute image URL or return null
  const getImageSrc = (product) => {
    const raw =
      product?.primary_image?.image ??
      product?.primary_image?.url ??
      product?.primary_image ?? // in case API already returns a string
      null;

    if (!raw) return null;

    // If already absolute, use as-is
    if (/^https?:\/\//i.test(raw)) return raw;

    // Otherwise, join with API base (handles `/storage/...` etc.)
    const base = String(apiUrl).replace(/\/+$/, ''); // trim trailing slash
    const path = String(raw).replace(/^\/+/, '');    // trim leading slash
    return `${base}/${path}`;
  };

  async function fetchProducts() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${apiUrl}/admin/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setData(res?.data?.products || []);
      console.log(res?.data?.products);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const editHandler = (id) => {
    navigate(`/admin/product/${id}`);
  };

  const deleteHandler = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      // Refresh list after delete
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setError('Delete failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Show Products
          </h1>

          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => navigate('/admin/product')}
          >
            Create New Product
          </button>
        </div>

        <div>
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Spinner animation="border" role="status" />
            </div>
          )}

          {!loading && error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
              {data.length === 0 ? (
                <p className="text-sm text-gray-500">No Products found.</p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="px-5 py-3 text-left font-bold">S. No</th>
                      <th className="px-5 py-3 text-left font-medium">Product ID</th>
                      <th className="px-5 py-3 text-left font-medium">Name</th>
                      <th className="px-5 py-3 text-left font-medium">Status</th>
                      <th className="px-5 py-3 text-left font-medium">Price</th>
                      <th className="px-5 py-3 text-left font-medium">Quantity</th>
                      <th className="px-5 py-3 text-left font-medium">Image</th>
                      <th className="px-5 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((p, idx) => {
                      const imgSrc = getImageSrc(p);
                      return (
                        <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="px-5 py-3">{idx + 1}</td>
                          <td className="px-5 py-3">{p.id}</td>
                          <td className="px-5 py-3">{p.title}</td>
                          <td className="px-5 py-3">
                            {Number(p.status) === 1 || p.status === true ? 'Active' : 'Inactive'}
                          </td>
                          <td className="px-5 py-3">{p.price}</td>
                          <td className="px-5 py-3">{p.qty}</td>
                         <td className="px-5 py-3">
  {p.primary_image_url ? (
    <img
      src={p.primary_image_url}
      alt={p.title ?? 'Product image'}
      className="w-36 h-16 object-cover rounded-md border"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src =
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="104" height="104"><rect width="110%" height="110%" fill="%23f2f2f2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="%23999">No Image</text></svg>';
      }}
    />
  ) : (
    <div className="w-16 h-16 flex items-center justify-center rounded-md border text-[10px] text-gray-500">
      No Image
    </div>
  )}
</td>
                          <td className="px-5 py-3">
                            <button
                              className="text-blue-500 mx-4"
                              onClick={() => editHandler(p.id)}
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-2xl" />
                            </button>
                            <button
                              className="text-red-500"
                              onClick={() => deleteHandler(p.id)}
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-2xl" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
