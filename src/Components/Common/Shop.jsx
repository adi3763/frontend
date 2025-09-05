import React, { useEffect, useMemo, useState, useCallback } from "react";
import Layout from "./Layout";
import BreadCrumb from "../BreadCrumb";
import five from "../../assets/images/Mens/five.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Http";

export const Shop = () => {
  // --- Data ---
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  // --- UI/UX state ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Filters ---
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set());
  const [selectedBrandIds, setSelectedBrandIds] = useState(new Set());

  // Axios instance (adds token automatically)
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
      },
    });
    return instance;
  }, []);

  // Fetch everything in parallel
  useEffect(() => {
    const ac = new AbortController();
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [catRes, brandRes, prodRes] = await Promise.all([
          api.get("/admin/category", { signal: ac.signal }),
          api.get("/admin/brand", { signal: ac.signal }),
          api.get("/admin/products", { signal: ac.signal }),
        ]);

        const cats = catRes?.data?.data || catRes?.data?.categories || [];
        const brs = brandRes?.data?.data || brandRes?.data?.brands || [];
        const prods = prodRes?.data?.products || prodRes?.data?.data || [];

        setCategories(Array.isArray(cats) ? cats : []);
        setBrands(Array.isArray(brs) ? brs : []);
        setProducts(Array.isArray(prods) ? prods : []);

        // Useful logs after state is actually set
        console.log("Fetched categories:", cats);
        console.log("Fetched brands:", brs);
        console.log("Fetched products:", prods);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
          setError("Failed to load shop data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    return () => ac.abort();
  }, [api]);

  // Toggle helpers
  const toggleId = useCallback((setFn) => (id) => {
    setFn((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);
  const toggleCategory = toggleId(setSelectedCategoryIds);
  const toggleBrand = toggleId(setSelectedBrandIds);

  const clearFilters = () => {
    setSelectedCategoryIds(new Set());
    setSelectedBrandIds(new Set());
  };

  // Filtered products (client-side)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catOk =
        selectedCategoryIds.size === 0 ||
        selectedCategoryIds.has(String(p?.category_id ));
      const brandOk =
        selectedBrandIds.size === 0 ||
        selectedBrandIds.has(String(p?.brand_id));
      return catOk && brandOk;
    });
  }, [products, selectedCategoryIds, selectedBrandIds]);

  // Small card component
  const ProductCard = ({ item }) => {
    const title = item?.title || "Featured Title";
    const price = item?.price ? `₹${item.price}` : "₹0";
    const oldPrice = item?.comparable_price ? `₹${item.comparable_price}` : "";
    const imgSrc =
      item?.primary_image?.image_url ||
      five; // fallback
    const to = item?.id ? `/product/${item.id}` : "/product";

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
        <img src={imgSrc} alt={title} className="w-full h-72 object-cover" />
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 cursor-pointer">
            <Link to={`/product/${item.id}`}>{title}</Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            <span className="text-base font-semibold text-gray-900">
              {price}
            </span>{" "}
            {oldPrice && (
              <span className="text-gray-400 line-through text-sm">
                {oldPrice}
              </span>
            )}
          </p>
        </div>
      </div>
    );
  };

  // Loading skeletons
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="w-full h-72 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="">
      <Layout>
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Optional: breadcrumb if you use it */}
          {/* <BreadCrumb title="Shop" /> */}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Shop</h1>
            {(selectedCategoryIds.size > 0 || selectedBrandIds.size > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm rounded-md border px-3 py-1.5 hover:bg-gray-50"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* LEFT FILTERS + RIGHT PRODUCTS */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Filters */}
            <aside className="categories-box lg:col-span-3 space-y-6">
              {/* Categories */}
              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                <h2 className="mb-3 text-base font-semibold text-gray-800">
                  Categories
                </h2>
                <ul className="space-y-2 text-sm max-h-[340px] overflow-auto pr-1">
                  {loading && categories.length === 0
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <li key={i} className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      ))
                    : categories.map((c) => {
                        const id = String(c?.id ?? c?.value ?? "");
                        const name = c?.name ?? c?.title ?? "Unnamed";
                        const checked = selectedCategoryIds.has(id);
                        return (
                          <li key={id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={checked}
                              onChange={() => toggleCategory(id)}
                            />
                            <span className="text-gray-700">{name}</span>
                          </li>
                        );
                      })}
                </ul>
              </div>

              {/* Brands */}
              <div className="brands-box rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                <h2 className="mb-3 text-base font-semibold text-gray-800">
                  Brands
                </h2>
                <ul className="space-y-2 text-sm max-h-[340px] overflow-auto pr-1">
                  {loading && brands.length === 0
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <li key={i} className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      ))
                    : brands.map((b) => {
                        const id = String(b?.id ?? b?.value ?? "");
                        const name = b?.name ?? b?.title ?? "Unnamed";
                        const checked = selectedBrandIds.has(id);
                        return (
                          <li key={id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={checked}
                              onChange={() => toggleBrand(id)}
                            />
                            <span className="text-gray-700">{name}</span>
                          </li>
                        );
                      })}
                </ul>
              </div>
            </aside>

            {/* Products */}
            <section className="products-box lg:col-span-9">
              <div className="px-0 sm:px-2 md:px-6 lg:px-8">
                {loading && products.length === 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 p-6 text-center text-gray-600">
                    No products match your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((p) => (
                      <ProductCard key={p?.id ?? Math.random()} item={p} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Shop;
