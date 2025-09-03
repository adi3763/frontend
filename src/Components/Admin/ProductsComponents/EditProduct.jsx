import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../AdminCommon/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../Http";
import { Spinner } from "react-bootstrap";

export default function AddEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // if present => edit mode
  const isEdit = Boolean(id);

  // ----------------- Local state -----------------
  const [loading, setLoading] = useState(false);
  const [initialFetch, setInitialFetch] = useState(isEdit); // show spinner while loading existing
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
    is_featured: "no",
    primary_index: 0, // for new uploads only; existing images separately handled
  });

  const [images, setImages] = useState([]); // new files
  const [imagePreviews, setImagePreviews] = useState([]); // new file previews

  const [existingImages, setExistingImages] = useState([]); 
  // shape we expect: [{id: 123, url: 'https://...', is_primary: 1/0}, ...]

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ----------------- Handlers -----------------
  function changeHandler(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "status" 
          ? Number(value)
          : value,
    }));
  }

  function fileChangeHandler(e) {
    const files = [...e.target.files];
    setImages(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
  }

  function changePrimaryExisting(imageId) {
    // optimistic UI update; server call below
    setExistingImages((prev) =>
      prev.map((img) => ({ ...img, is_primary: img.id === imageId ? 1 : 0 }))
    );
  }

  async function deleteExistingImage(imageId) {
    try {
      // Adjust this endpoint to your backend
     const res =  await axios.delete(`${apiUrl}/admin/products/${id}/images/${imageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      console.log("Deleted image:", res.data);  
      setExistingImages((prev) => prev.filter((i) => i.id !== imageId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete image.");
    }
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

  // ----------------- Fetch single product in edit mode -----------------
  async function getProduct() {
    if (!isEdit) return;
    try {
      setInitialFetch(true);
      const res = await axios.get(`${apiUrl}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      const p = res?.data?.data || res?.data?.product || res?.data;
      console.log("Fetched product:", p);

      setFormData((prev) => ({
        ...prev,
        title: p?.title || "",
        category_id: String(p?.category_id ?? ""),
        brand_id: String(p?.brand_id ?? ""),
        description: p?.description || "",
        comparable_price: p?.comparable_price ?? "",
        shortDescription: p?.shortDescription ?? p?.short_description ?? "",
        qty: String(p?.qty ?? ""),
        sku: p?.sku || "",
        barcode: p?.barcode || "",
        price: String(p?.price ?? ""),
        status: Number(p?.status ?? 1),
        is_featured: (p?.is_featured ?? "no"),
      }));

      const imgs = p?.images || p?.product_images || [];
      setExistingImages(
        imgs.map((im) => ({
          id: im.id,
          url: im.url || im.image_url || im.path || im.file_url,
          is_primary: Number(im.is_primary ?? im.primary ?? 0),
        }))
      );
    } catch (err) {
      console.error(err);
      setApiError("Failed to load product.");
    } finally {
      setInitialFetch(false);
    }
  }

  useEffect(() => {
    getCategories();
    getBrands();
    getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ----------------- Debounced SKU check -----------------
  const sku = useMemo(() => (formData.sku || "").trim(), [formData.sku]);

  useEffect(() => {
    if (!sku) {
      setSkuExists(false);
      return;
    }

    let cancelled = false;
    setCheckingSku(true);
    const t = setTimeout(async () => {
      try {
        // If you have a dedicated endpoint like /admin/products/sku-check?sku=...&ignoreId=...
        // prefer using that. Fallback: list and compare client-side.
        const res = await axios.get(`${apiUrl}/admin/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        const products = res?.data?.products || res?.data?.data || [];
        const exists = products.some((p) => {
          const pSku = String(p?.sku || "").trim();
          if (!pSku) return false;
          if (isEdit && String(p?.id) === String(id)) return false; // exclude self
          return pSku === sku;
        });
        if (!cancelled) setSkuExists(exists);
      } catch (err) {
        console.error(err);
        if (!cancelled) setSkuExists(false);
      } finally {
        if (!cancelled) setCheckingSku(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [sku, isEdit, id]);

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
      Object.entries(formData).forEach(([k, v]) => {
        // avoid sending primary_index when editing existing images only (optional)
        if (isEdit && k === "primary_index") return;
        form.append(k, v ?? "");
      });

      // New uploads
      images.forEach((file) => form.append("images[]", file));

      if (isEdit) {
        // Laravel-friendly: POST with _method=PUT (or PATCH)
        form.append("_method", "PUT");

        await axios.post(`${apiUrl}/admin/products/${id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        // If user changed primary on existing images, persist that.
        // Optional: call a dedicated endpoint only when a change was made.
        const primary = existingImages.find((i) => i.is_primary === 1);
        if (primary) {
          try {
            await axios.post(
              `${apiUrl}/admin/products/${id}/images/${primary.id}/make-primary`,
              {
                is_primary: 1,
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
            );
          } catch (e) {
            console.warn("Primary image update failed (non-blocking).", e);
          }
        }

        alert("Product Updated Successfully");
      } else {
        // CREATE
        await axios.post(`${apiUrl}/admin/products`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        alert("Product Added Successfully");
      }

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setApiError(
        isEdit
          ? "Error updating product. Please review your inputs and try again."
          : "Error adding product. Please review your inputs and try again."
      );
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
            {isEdit ? "Edit Product" : "Create New Product"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-6xl mx-auto">
          {initialFetch ? (
            <div className="flex items-center justify-center py-10">
              <Spinner animation="border" />
            </div>
          ) : loading ? (
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
                      className={`w-full rounded-lg border p-2 pr-24 dark:bg-gray-700 dark:text-gray-100 ${
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
                    <option value={"no"}>No</option>
                    <option value={"yes"}>Yes</option>
                  </select>
                </div>
              </div>

              {/* Existing Images (edit mode) */}
              {isEdit && (
                <div>
                  <label className="block text-sm font-medium mb-1">Existing Images</label>
                  {existingImages?.length ? (
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative border rounded-md p-2">
                          <img
                            src={img.url}
                            alt={`img-${img.id}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="mt-2 flex items-center gap-2">
                            <label className="text-xs flex items-center gap-1">
                              <input
                                type="radio"
                                name="primary_existing"
                                checked={img.is_primary === 1}
                                onChange={() => changePrimaryExisting(img.id)}
                              />
                              Primary
                            </label>
                            <button
                              type="button"
                              onClick={() => deleteExistingImage(img.id)}
                              className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No images yet.</p>
                  )}
                </div>
              )}

              {/* New Images */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isEdit ? "Upload More Images" : "Images"}
                </label>
                <input
                  type="file"
                  multiple
                  onChange={fileChangeHandler}
                  className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-gray-100"
                />
                {imagePreviews?.length > 0 && (
                  <>
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative border rounded-md p-2">
                          <img
                            src={src}
                            alt={`preview-${i}`}
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                          {/* primary selector among NEW uploads only */}
                          {!isEdit && (
                            <label className="block text-xs mt-2">
                              <input
                                type="radio"
                                name="primary_index"
                                checked={Number(formData.primary_index) === i}
                                onChange={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    primary_index: i,
                                  }))
                                }
                              />{" "}
                              Primary
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                    {!isEdit && (
                      <p className="text-xs text-gray-500 mt-1">
                        First image is primary by default. You can change it above.
                      </p>
                    )}
                  </>
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
                {loading ? (isEdit ? "Updating..." : "Submitting...") : (isEdit ? "Update" : "Submit")}
              </button>
            </form>
          )}
        </div>
      </AdminLayout>
    </div>
  );
}
