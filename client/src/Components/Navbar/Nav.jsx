import React from "react";
import { Link, NavLink } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../Navbar/nav.css";
import Img from "../../images/logo.png";
import { Avatar } from "@material-ui/core";
import useNavigation from "./NavFunctions";
import CartIcon from "../Cart/CartIcon";

function Nav() {
    const { authUser, userSignOut, toggleDropdown } = useNavigation();
    return (
        <div className="all">
            <div className="Nav">
                <img className="nav_logo" src={Img} alt="Gadgetry Logo" />
                
                <div className="linksection">
                    <NavLink className="navlink" to="/">
                        Home
                    </NavLink>
                    <NavLink className="navlink" to="/gadget">
                        Gadgets
                    </NavLink>
                    <NavLink className="navlink" to="/create">
                        Create
                    </NavLink>
                    <NavLink className="navlink" to="/page">
                        Browse
                    </NavLink>
                    <NavLink className="navlink" to="/productlist">
                        Products
                    </NavLink>
                    <button className="sign_out_btn" onClick={userSignOut}>
                        {authUser ? "Sign Out" : "Sign In"}
                    </button>
                </div>

                <div className="icon_container">
                    {authUser && (
                        <Avatar className="avatar" onClick={toggleDropdown}>
                            <p className="avatar_text">
                                {authUser.email.slice(0, 2).toUpperCase()}
                            </p>
                        </Avatar>
                    )}
                    <div className="dropdown" id="profile-dropdown">
                        <Link to="/profile">View Profile</Link>
                        <Link to="/profile">Edit Profile</Link>
                        <a href="#" onClick={userSignOut}>
                            Sign Out
                        </a>
                    </div>
                    <Link to="/liked">
                        <FavoriteBorderIcon className="like_icon" />
                    </Link>
                    <CartIcon />
                </div>
            </div>
        </div>
    );
}
export default Nav;