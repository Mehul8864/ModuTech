// src/components/Gadget/Gadget.jsx
import React, { memo } from "react";
import Nav from "../Navbar/Nav";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./gadget.css";

const categories = [
  {
    id: "mobile",
    icon: "📱",
    title: "Mobile & Tablets",
    desc: "Latest smartphones, tablets, and mobile accessories",
    to: "/mobile",
  },
  {
    id: "laptops",
    icon: "💻",
    title: "Laptops & Computers",
    desc: "High-performance laptops and desktop computers",
    to: "/laptops",
  },
  {
    id: "audio",
    icon: "🎧",
    title: "Audio & Headphones",
    desc: "Premium headphones, speakers, and audio equipment",
    to: "/audio",
  },
  {
    id: "wearables",
    icon: "⌚",
    title: "Wearables",
    desc: "Smart watches, fitness trackers, and wearable tech",
    to: "/wearables",
  },
  {
    id: "smart-home",
    icon: "🏠",
    title: "Smart Home",
    desc: "IoT devices, smart speakers, and home automation",
    to: "/smart-home",
  },
  {
    id: "gaming",
    icon: "🎮",
    title: "Gaming",
    desc: "Gaming consoles, accessories, and peripherals",
    to: "/gaming",
  },
];

const CategoryCard = memo(function CategoryCard({ icon, title, desc, to }) {
  return (
    <article className="category-card" aria-labelledby={`cat-${title}`}>
      <div className="category-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 id={`cat-${title}`} className="category-title">
        {title}
      </h3>
      <p className="category-desc">{desc}</p>
      <Link to={to} className="btn-primary" aria-label={`Browse ${title}`}>
        Browse
      </Link>
    </article>
  );
});

CategoryCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  to: PropTypes.string,
};

const ActionCard = memo(function ActionCard({ icon, title, desc, to }) {
  return (
    <Link to={to} className="action-card" aria-label={title}>
      <div className="action-icon" aria-hidden="true">
        {icon}
      </div>
      <h4 className="action-title">{title}</h4>
      <p className="action-desc">{desc}</p>
    </Link>
  );
});

ActionCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  to: PropTypes.string,
};

function Gadget() {
  return (
    <main className="Gadget">
      <Nav />
      <div className="gadget-page-content container">
        <header className="gadget-hero" aria-labelledby="gadget-hero-title">
          <h1 id="gadget-hero-title">Explore Our Gadget Categories</h1>
          <p>Find the perfect gadget for your needs from our curated collection</p>
        </header>

        <section
          className="categories-grid"
          aria-label="Gadget categories"
          role="list"
        >
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              icon={c.icon}
              title={c.title}
              desc={c.desc}
              to={c.to}
            />
          ))}
        </section>

        <section className="quick-actions" aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title">Quick Actions</h2>
          <div className="actions-grid">
            <ActionCard
              icon="🔍"
              title="Browse All Products"
              desc="See our complete collection"
              to="/products"
            />
            <ActionCard
              icon="➕"
              title="Add New Product"
              desc="List your own gadget"
              to="/create"
            />
            <ActionCard
              icon="❤️"
              title="Your Wishlist"
              desc="View saved items"
              to="/liked"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Gadget;