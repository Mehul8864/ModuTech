import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { clearUser, setUser } from "../../authSlice";
import { useNavigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import "./profile.css";

const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");

    useEffect(() => {
        if (user) {
            setEditedName(user.displayName || "");
            setEditedEmail(user.email || "");
        }
    }, [user]);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                dispatch(clearUser());
                navigate("/");
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    };

    const handleSaveProfile = async () => {
        if (!auth.currentUser) return;
        
        setIsUpdating(true);
        setUpdateMessage("");
        
        try {
            await updateProfile(auth.currentUser, {
                displayName: editedName
            });
            
            // Update the Redux store with the new user data
            const updatedUser = {
                ...user,
                displayName: editedName
            };
            dispatch(setUser(updatedUser));
            
            setUpdateMessage("Profile updated successfully!");
            setIsEditing(false);
            
            setTimeout(() => {
                setUpdateMessage("");
            }, 3000);
        } catch (error) {
            console.error("Profile update error:", error);
            setUpdateMessage("Failed to update profile. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedName(user?.displayName || "");
        setEditedEmail(user?.email || "");
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div>
                <Nav />
                <div className="profile-container">
                    <div className="profile-card">
                        <h2>Please Sign In</h2>
                        <p>You need to be signed in to view your profile.</p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate("/signin")}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Nav />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="profile-info">
                            {isEditing ? (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        placeholder="Display Name"
                                        className="profile-input"
                                    />
                                    <input
                                        type="email"
                                        value={editedEmail}
                                        onChange={(e) => setEditedEmail(e.target.value)}
                                        placeholder="Email"
                                        className="profile-input"
                                        disabled
                                    />
                                </div>
                            ) : (
                                <div className="profile-display">
                                    <h2>{user.displayName || "Anonymous User"}</h2>
                                    <p className="profile-email">{user.email}</p>
                                    <p className="profile-joined">
                                        Joined: {new Date(user.metadata?.creationTime).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {updateMessage && (
                        <div className={`update-message ${updateMessage.includes('success') ? 'success' : 'error'}`}>
                            {updateMessage}
                        </div>
                    )}

                    <div className="profile-actions">
                        {isEditing ? (
                            <div className="edit-actions">
                                <button 
                                    className="btn-primary"
                                    onClick={handleSaveProfile}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                                <button 
                                    className="btn-secondary"
                                    onClick={handleCancelEdit}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="view-actions">
                                <button 
                                    className="btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                                <button 
                                    className="btn-secondary"
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-stats">
                        <div className="stat-card">
                            <h3>Quick Actions</h3>
                            <div className="quick-actions">
                                <button 
                                    className="action-btn"
                                    onClick={() => navigate("/liked")}
                                >
                                    <span>❤️</span>
                                    View Wishlist
                                </button>
                                <button 
                                    className="action-btn"
                                    onClick={() => navigate("/page")}
                                >
                                    <span>🛍️</span>
                                    Browse Products
                                </button>
                                <button 
                                    className="action-btn"
                                    onClick={() => navigate("/create")}
                                >
                                    <span>➕</span>
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;