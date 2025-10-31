import Nav from "../Navbar/Nav";
import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
    return (
        <div className="Home">
            <Nav />
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome to <span className="brand-name">Gadgetry</span>
                    </h1>
                    <p className="hero-description">
                        Discover the latest and greatest gadgets that will transform your daily life. 
                        From cutting-edge technology to innovative solutions, we've got everything you need.
                    </p>
                    <div className="hero-actions">
                        <Link to="/page" className="btn-primary hero-btn">
                            Browse Products
                        </Link>
                        <Link to="/create" className="btn-secondary hero-btn">
                            Add Product
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="floating-card">
                        <div className="card-icon">📱</div>
                        <h3>Latest Tech</h3>
                        <p>Cutting-edge gadgets</p>
                    </div>
                    <div className="floating-card">
                        <div className="card-icon">⚡</div>
                        <h3>Fast Delivery</h3>
                        <p>Quick & reliable</p>
                    </div>
                    <div className="floating-card">
                        <div className="card-icon">🛡️</div>
                        <h3>Secure</h3>
                        <p>Safe & trusted</p>
                    </div>
                </div>
            </div>
            
            <div className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose Gadgetry?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Easy Discovery</h3>
                            <p>Find exactly what you're looking for with our intuitive search and filtering system.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💝</div>
                            <h3>Wishlist</h3>
                            <p>Save your favorite items and never lose track of the gadgets you love.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🛒</div>
                            <h3>Smart Cart</h3>
                            <p>Seamless shopping experience with our intelligent cart management system.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⭐</div>
                            <h3>Quality Assured</h3>
                            <p>Every product is carefully curated to ensure the highest quality standards.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;