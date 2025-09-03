import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../AdminCommon/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../Http";
import { Spinner } from "react-bootstrap";

export default function CreateProduct() {
  const navigate = useNavigate();

  // ----------------- Local state -----------------
  const [loading, setLoading] = useState(false);
  const [checkingSku, setCheckingSku] = useState(false);
  const [skuExists, setSkuExists] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    brand_id: "",
    description: "",
    comparable_price: "",
    shortDescription: "",
    qty: "",
    sku: "",
    barcode: "",
    price: "",
    status: 1,
    is_featured: 0,
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ----------------- Handlers -----------------
  function changeHandler(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "status" || name === "is_featured"
          ? Number(value)
          : value,
    }));
  }

  function fileChangeHandler(e) {
    const files = [...e.target.files];
    setImages(files);

    // simple previews
    const urls = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
  }

  // ----------------- Fetch categories & brands -----------------
  async function getCategories() {
    try {
      const res = await axios.get(`${apiUrl}/admin/category`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setCategories(res?.data?.data || res?.data?.categories || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function getBrands() {
    try {
      const res = await axios.get(`${apiUrl}/admin/brand`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setBrands(res?.data?.data || res?.data?.brands || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  // ----------------- Debounced SKU check -----------------
  // memoized sku to avoid closure confusion
  const sku = useMemo(() => formData.sku.trim(), [formData.sku]);

  useEffect(() => {
    if (!sku) {
      setSkuExists(false);
      return;
    }

    setCheckingSku(true);
    const t = setTimeout(async () => {
      try {
        // NOTE: Using index endpoint; adjust if you add a dedicated /sku-check
        const res = await axios.get(`${apiUrl}/admin/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        // backend may send { products: [...] } or { data: [...] }
        const products = res?.data?.products || res?.data?.data || [];
        const exists = products.some((p) => String(p?.sku || "").trim() === sku);
        setSkuExists(exists);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingSku(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(t);
  }, [sku]);

  // ----------------- Submit -----------------
  async function submitHandler(e) {
    e.preventDefault();
    setApiError("");

    if (skuExists) {
      alert("SKU already exists. Please choose another one.");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => form.append(k, v));
      images.forEach((file) => form.append("images[]", file));
      form.append("primary_index", 0); // first image as primary

      await axios.post(`${apiUrl}/admin/products`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      alert("Product Added Successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setApiError("Error adding product. Please review your inputs and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ----------------- Render -----------------
  return (
    <div>
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Create New Product
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner animation="border" />
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              {apiError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {apiError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={changeHandler}
                  required
                  placeholder="Enter product title"
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={changeHandler}
                  placeholder="Enter Product Description"
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={changeHandler}
                  placeholder="Enter Short Description"
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Select Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={changeHandler}
                  required
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium mb-1">Select Brand</label>
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={changeHandler}
                  required
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Select a brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity, SKU, Barcode, Price, Comparable Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    name="qty"
                    value={formData.qty}
                    onChange={changeHandler}
                    required
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                {/* SKU with live check */}
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={changeHandler}
                      required
                      className={`w-full rounded-lg border p-2 pr-20 dark:bg-gray-700 dark:text-gray-100 ${
                        skuExists ? "border-red-500" : ""
                      }`}
                      placeholder="Unique SKU"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                      {checkingSku && (
                        <span className="text-gray-500">checking…</span>
                      )}
                      {!checkingSku && sku && (
                        <span
                          className={`${
                            skuExists ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {skuExists ? "not available" : "available"}
                        </span>
                      )}
                    </div>
                  </div>
                  {skuExists && (
                    <p className="text-sm text-red-500 mt-1">
                      SKU already exists. Please choose a different one.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Barcode</label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={changeHandler}
                    required
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={changeHandler}
                    required
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Comparable Price
                  </label>
                  <input
                    type="number"
                    name="comparable_price"
                    value={formData.comparable_price}
                    onChange={changeHandler}
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={changeHandler}
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Featured</label>
                  <select
                    name="is_featured"
                    value={formData.is_featured}
                    onChange={changeHandler}
                    className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={fileChangeHandler}
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                />
                {imagePreviews?.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {imagePreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`preview-${i}`}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={skuExists || checkingSku || loading}
                className={`w-full text-white font-medium py-2 px-4 rounded-lg shadow-md transition ${
                  skuExists || checkingSku || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      </AdminLayout>
    </div>
  );
}
