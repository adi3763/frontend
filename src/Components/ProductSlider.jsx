"use client"


import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Tab, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import image1 from "../assets/images/Mens/five.jpg";
import image2 from "../assets/images/Mens/six.jpg";
import image3 from "../assets/images/Mens/seven.jpg";
import image4 from "../assets/images/Mens/eight.jpg";

export default function ProductSlider() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("M")

  const product = {
    name: "Dummy Product Title",
    price: 20,
    originalPrice: 18,
    rating: 4,
    reviews: 10,
    images: [
      image1,
      image2,
      image3,
      image4
    ],
    sizes: ["S", "M", "L", "XL"],
    features: ["100% Original Products", "Pay on delivery might be available", "Easy 15 days returns and exchanges"],
    sku: "DDXX2234",
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const goToImage = (index) => {
    setCurrentImage(index)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Images */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded overflow-hidden ${
                  currentImage === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative flex-1 order-1 lg:order-2">
            <div className="relative aspect-square bg-gray-100 rounded overflow-hidden">
              <img
                src={product.images[currentImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.reviews} Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {product.features.map((feature, index) => (
                <p key={index} className="text-sm text-gray-600">
                  {feature}
                </p>
              ))}
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 border rounded font-medium ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full lg:w-auto bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-3 rounded font-semibold mb-6"
            onClick={() => navigate('/cart')}
            >
              ADD TO CART
            </button>

            {/* SKU */}
            <p className="text-sm text-gray-600">
              <span className="font-semibold">SKU:</span> {product.sku}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="tab-switch">
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
            <div className="font-bold text-gray-900 mb-4 mt-2 px-1 py-2">{product.name}</div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            </div>

            <div className="space-y-2 mb-6">
              {product.features.map((feature, index) => (
                <p key={index} className="text-sm text-gray-600">
                  {feature}
                </p>
              ))}
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="reviews">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.reviews} Reviews</span>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>


    </div>
  )
}
