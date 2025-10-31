import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toggleLike } from "../../reducers/gadgets";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { selectUser } from "../../authSlice";
import "./page.css";
import Nav from "../Navbar/Nav";

const GadgetList = () => {
    const [gadgets, setGadgets] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const likeGadgets = useSelector((state) => state.like.likeGadgets);
    const storedUser = useSelector(selectUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });
        return () => {
            listen();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5001/gadgets/"
                );
                setGadgets(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    const navigateToDetailPage = (gadget) => {
        console.log(gadget);
        navigate(`/page/${gadget._id}`, { state: { gadgetDetails: gadget } });
    };
    const handleLikeToggle = (gadget) => {
        // Check if user is authenticated before allowing like action
        if (!authUser && !storedUser) {
            alert("Please sign in to like gadgets.");
            return;
        }
        dispatch(toggleLike(gadget));
    };

    return (
        <div className="page">
            <Nav />
            <div className="page-header">
                <h1>Browse Gadgets</h1>
                <p>Discover amazing gadgets and add them to your collection</p>
            </div>
            <div className="main_box_created">
                {gadgets.length === 0 ? (
                    <div className="no-gadgets">
                        <h3>No gadgets available</h3>
                        <p>Check back later for new products!</p>
                    </div>
                ) : (
                    gadgets.map((gadget) => (
                        <div
                            className="list card"
                            key={gadget._id}
                            onClick={() => navigateToDetailPage(gadget)}
                        >
                            <div className="gadget">
                                <img src={gadget.imageUrl} alt={gadget.title} />
                                <div className="bookmark_shape">
                                    ${gadget.price}
                                </div>
                            </div>
                            <div className="product-content">
                                <div className="gadget_title">
                                    <h3>{gadget.title}</h3>
                                </div>
                                <div className="gadget_message">
                                    <p>{gadget.message}</p>
                                </div>
                                <div className="price">
                                    <div className="price-value">
                                        ${gadget.price}
                                    </div>
                                    <button
                                        className="like_btn_card"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLikeToggle(gadget);
                                        }}
                                    >
                                        {likeGadgets.some(
                                            (liked) => liked._id === gadget._id
                                        ) ? (
                                            <FavoriteIcon className="liked_icon_card" />
                                        ) : (
                                            <FavoriteBorderIcon className="like_icon_card" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GadgetList;