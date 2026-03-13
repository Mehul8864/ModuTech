import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import "./productlist.css";

const API_BASE =
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, "")) ||
  "http://localhost:5001";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products - supports AbortController for cleanup
  const fetchProducts = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/gadgets`, { signal });

      if (!res.ok) {
        // try to parse error message from server
        let serverMessage = "";
        try {
          const errData = await res.json();
          serverMessage = errData?.message || "";
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(serverMessage || `Failed to fetch products: ${res.status}`);
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      // If aborted, do nothing
      if (err.name === "AbortError") return;
      setProducts([]);
      setError(err.message || "Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  const navigateToDetailPage = useCallback(
    (product) => {
      if (!product || !product._id) return;
      navigate(`/page/${product._id}`, { state: { gadgetDetails: product } });
    },
    [navigate]
  );

  const handleCardKeyDown = (e, product) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateToDetailPage(product);
    }
  };

  const formatPrice = (value) => {
    const number = Number(value) || 0;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(number);
    } catch {
      return `$${number.toFixed(2)}`;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <Nav />
        <div className="productlist-container">
          <div className="loading-spinner">
            <div className="spinner" aria-hidden />
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Nav />
        <div className="productlist-container">
          <div className="error-message" role="alert" aria-live="polite">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                className="btn-primary"
                onClick={() => {
                  const controller = new AbortController();
                  fetchProducts(controller.signal);
                }}
              >
                Try Again
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div>
      <Nav />
      <div className="productlist-container">
        <div className="productlist-header">
          <h1>All Products</h1>
          <p>Discover our complete collection of gadgets</p>
        </div>

        {products.length === 0 ? (
          <div className="no-products" role="status" aria-live="polite">
            <div className="no-products-icon" aria-hidden>
              📦
            </div>
            <h2>No products available</h2>
            <p>Be the first to add a product to our collection!</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/create")}
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="products-grid" role="list">
            {products.map((product) => (
              <div
                key={product._id}
                className="product-card"
                role="button"
                tabIndex={0}
                onClick={() => navigateToDetailPage(product)}
                onKeyDown={(e) => handleCardKeyDown(e, product)}
                aria-label={`View details for ${product.title || "product"}`}
              >
                <div className="product-image">
                  <img
                    src={product.imageUrl || "/placeholder-image.jpg"}
                    alt={product.title ? `${product.title} image` : "product image"}
                    loading="lazy"
                    onError={(e) => {
                      // prevent infinite loop if placeholder also fails
                      const target = e.target;
                      if (target && target.onerror) target.onerror = null;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.title || "Untitled"}</h3>
                  <p className="product-description">
                    {product.message
                      ? product.message.length > 100
                        ? `${product.message.substring(0, 100)}...`
                        : product.message
                      : "No description available."}
                  </p>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <button
                      className="view-details-btn"
                      onClick={(e) => {
                        // prevent card onClick double-trigger
                        e.stopPropagation();
                        navigateToDetailPage(product);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="productlist-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate("/page")}
          >
            Browse by Category
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/create")}
          >
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;