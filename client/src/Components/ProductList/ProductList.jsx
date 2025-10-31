import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import "./productlist.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5001/gadgets");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            // Ensure data is an array
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            setProducts([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const navigateToDetailPage = (product) => {
        navigate(`/page/${product._id}`, { state: { gadgetDetails: product } });
    };

    if (loading) {
        return (
            <div>
                <Nav />
                <div className="productlist-container">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Nav />
                <div className="productlist-container">
                    <div className="error-message">
                        <h2>Oops! Something went wrong</h2>
                        <p>{error}</p>
                        <button 
                            className="btn-primary"
                            onClick={fetchProducts}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Nav />
            <div className="productlist-container">
                <div className="productlist-header">
                    <h1>All Products</h1>
                    <p>Discover our complete collection of gadgets</p>
                </div>

                {products.length === 0 ? (
                    <div className="no-products">
                        <div className="no-products-icon">📦</div>
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
                    <div className="products-grid">
                        {Array.isArray(products) && products.map((product) => (
                            <div
                                key={product._id}
                                className="product-card"
                                onClick={() => navigateToDetailPage(product)}
                            >
                                <div className="product-image">
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.title}
                                        onError={(e) => {
                                            e.target.src = "/placeholder-image.jpg";
                                        }}
                                    />
                                </div>
                                <div className="product-content">
                                    <h3 className="product-title">{product.title}</h3>
                                    <p className="product-description">
                                        {product.message.length > 100 
                                            ? `${product.message.substring(0, 100)}...` 
                                            : product.message
                                        }
                                    </p>
                                    <div className="product-footer">
                                        <span className="product-price">${product.price}</span>
                                        <button className="view-details-btn">
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