import React from "react";
import Nav from "../Navbar/Nav";
import { Link } from "react-router-dom";
import "./gadget.css";

function Gadget() {
    return (
        <div className="Gadget">
            <Nav />
            <div className="gadget-page-content">
                <div className="gadget-hero">
                    <h1>Explore Our Gadget Categories</h1>
                    <p>Find the perfect gadget for your needs from our curated collection</p>
                </div>
                
                <div className="categories-grid">
                    <div className="category-card">
                        <div className="category-icon">📱</div>
                        <h3>Mobile & Tablets</h3>
                        <p>Latest smartphones, tablets, and mobile accessories</p>
                        <Link to="/page" className="btn-primary">Browse</Link>
                    </div>
                    
                    <div className="category-card">
                        <div className="category-icon">💻</div>
                        <h3>Laptops & Computers</h3>
                        <p>High-performance laptops and desktop computers</p>
                        <Link to="/page" className="btn-primary">Browse</Link>
                    </div>
                    
                    <div className="category-card">
                        <div className="category-icon">🎧</div>
                        <h3>Audio & Headphones</h3>
                        <p>Premium headphones, speakers, and audio equipment</p>
                        <Link to="/page" className="btn-primary">Browse</Link>
                    </div>
                    
                    <div className="category-card">
                        <div className="category-icon">⌚</div>
                        <h3>Wearables</h3>
                        <p>Smart watches, fitness trackers, and wearable tech</p>
                        <Link to="/page" className="btn-primary">Browse</Link>
                    </div>
                    
                    <div className="category-card">
                        <div className="category-icon">🏠</div>
                        <h3>Smart Home</h3>
                        <p>IoT devices, smart speakers, and home automation</p>
                        <Link to="/page" className="btn-primary">Browse</Link>
                    </div>
                    
                    <div className="category-card">
                        <div className="category-icon">🎮</div>
                        <h3>Gaming</h3>
                        <p>Gaming consoles, accessories, and peripherals</p>
                        <Link to="/page" className="btn-primary">Browse</Link>
                    </div>
                </div>
                
                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/page" className="action-card">
                            <div className="action-icon">🔍</div>
                            <h4>Browse All Products</h4>
                            <p>See our complete collection</p>
                        </Link>
                        
                        <Link to="/create" className="action-card">
                            <div className="action-icon">➕</div>
                            <h4>Add New Product</h4>
                            <p>List your own gadget</p>
                        </Link>
                        
                        <Link to="/liked" className="action-card">
                            <div className="action-icon">❤️</div>
                            <h4>Your Wishlist</h4>
                            <p>View saved items</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Gadget;