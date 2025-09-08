// ProductSlider.jsx
import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./Http";

export default function ProductSlider() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function showProductInfo() {
      try {
        const res = await axios.get(`${apiUrl}/admin/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setProduct(res?.data?.data || null);
        setCurrentImage(0);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    showProductInfo();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6 text-red-600">Product not found</div>;

  // Build images list: primary first, then others
  const images = [
    product.primary_image_url,
    ...(Array.isArray(product.images) ? product.images.map((x) => x?.image_url).filter(Boolean) : []),
  ].filter(Boolean);

  const hasImages = images.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
            {hasImages ? (
              images.map((src, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded overflow-hidden ${
                    currentImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500 px-2 py-1">No images</div>
            )}
          </div>

          {/* Main Image */}
          <div className="relative flex-1 order-1 lg:order-2">
            <div className="relative aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              <img
                src={hasImages ? images[currentImage] : "/placeholder.svg"}
                alt={product.title || "Product image"}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {product.title || "Product"}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">₹{product.price ?? 0}</span>
            {product.comparable_price ? (
              <span className="text-xl text-gray-500 line-through">₹{product.comparable_price}</span>
            ) : "Comparable Price"}
          </div>

          <div className="flex items-center gap-3">
            {product.description ? (
              <span className="text-xl text-gray-500 line-through">₹{product.comparable_price}</span>
            ) : "Product Description"}
          </div>

          {/* SKU */}
          {product.sku ? (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">SKU:</span> {product.sku}
            </p>
          ) : null}

          <button
            className="w-full lg:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded font-semibold"
            onClick={() => navigate("/cart")}
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Bottom Tabs (simple) */}
      <div className="tab-switch mt-8">
        <Tab.Container defaultActiveKey="description">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="description">Description</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reviews">Reviews</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="p-3">
            <Tab.Pane eventKey="description">
              <div className="font-bold text-gray-900 mb-4 mt-2 px-1 py-2">
                {product.title || "Product"}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {product.description || "No description available."}
              </p>
            </Tab.Pane>

            <Tab.Pane eventKey="reviews">
              <p className="text-sm text-gray-600">No reviews yet.</p>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
}
