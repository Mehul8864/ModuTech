import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import "./liked.css";

const Liked = () => {
    const navigate = useNavigate();
    const likeGadgets = useSelector((state) => state.like.likeGadgets);
    console.log("Liked Gadgets:", likeGadgets);
    const navigateToDetailPage = (gadget) => {
        console.log(gadget);
        navigate(`/page/${gadget._id}`, { state: { gadgetDetails: gadget } });
    };
    return (
        <div>
            <Nav />
            <div className="liked-page-header">
                <h2>Your Wishlist</h2>
                <p>All your favorite gadgets in one place</p>
            </div>
            {likeGadgets.length === 0 ? (
                <div className="no-liked-message">
                    <p>No liked gadgets yet.</p>
                    <p>Start exploring and save your favorite items!</p>
                    <a href="/page" className="btn-primary">Browse Products</a>
                </div>
            ) : (
                <ul className="like_main_box_created">
                    {likeGadgets.map((gadget) => (
                        <li
                            className="like_list"
                            key={gadget._id}
                            onClick={() => navigateToDetailPage(gadget)}
                        >
                            <div className="like_gadget">
                                <img src={gadget.imageUrl} alt={gadget.title} />
                            </div>
                            <div className="like-product-content">
                                <div className="like_gadget_title">
                                    <h3>{gadget.title}</h3>
                                </div>
                                <div className="like_gadget_message">
                                    <p>{gadget.message}</p>
                                </div>
                                <div className="like_price">
                                    <div className="like_bookmark_shape">
                                        <p>${gadget.price}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Liked;