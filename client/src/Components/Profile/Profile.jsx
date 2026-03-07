// src/components/Profile/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
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

  const isMountedRef = useRef(true);
  const messageTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      isMountedRef.current = false;
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setEditedName(user.displayName || "");
      setEditedEmail(user.email || "");
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      if (!isMountedRef.current) return;
      setUpdateMessage("Failed to sign out. Try again.");
      messageTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) setUpdateMessage("");
      }, 3000);
    }
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    const trimmedName = (editedName || "").trim();

    // Nothing changed
    if (trimmedName === (user?.displayName || "").trim()) {
      setUpdateMessage("No changes to save.");
      messageTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) setUpdateMessage("");
      }, 2000);
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    setUpdateMessage("");

    try {
      await updateProfile(auth.currentUser, { displayName: trimmedName });

      // Optionally reload current user to ensure fields are refreshed
      // (some firebase setups may require auth.currentUser.reload())
      try {
        // eslint-disable-next-line no-unused-expressions
        auth.currentUser?.reload && (await auth.currentUser.reload());
      } catch (reloadErr) {
        // non-fatal
        console.warn("Failed to reload user after update:", reloadErr);
      }

      // Update Redux store with the new user fields (use the latest auth.currentUser if available)
      const latestUser = auth.currentUser
        ? {
            ...user,
            displayName: auth.currentUser.displayName || trimmedName,
            photoURL: auth.currentUser.photoURL ?? user?.photoURL,
            email: auth.currentUser.email ?? user?.email,
          }
        : { ...user, displayName: trimmedName };

      dispatch(setUser(latestUser));

      if (!isMountedRef.current) return;
      setUpdateMessage("Profile updated successfully!");
      setIsEditing(false);

      messageTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) setUpdateMessage("");
      }, 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      if (!isMountedRef.current) return;
      setUpdateMessage("Failed to update profile. Please try again.");
    } finally {
      if (isMountedRef.current) setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.displayName || "");
    setEditedEmail(user?.email || "");
    setIsEditing(false);
  };

  // defensive joined date rendering
  const joinedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : "N/A";

  if (!user) {
    return (
      <div>
        <Nav />
        <div className="profile-container">
          <div className="profile-card">
            <h2>Please Sign In</h2>
            <p>You need to be signed in to view your profile.</p>
            <button className="btn-primary" type="button" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const saveDisabled = isUpdating || (editedName || "").trim().length === 0;

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
                    aria-label="Display name"
                  />
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder="Email"
                    className="profile-input"
                    disabled
                    aria-label="Email (not editable)"
                  />
                </div>
              ) : (
                <div className="profile-display">
                  <h2>{user.displayName || "Anonymous User"}</h2>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-joined">Joined: {joinedDate}</p>
                </div>
              )}
            </div>
          </div>

          {updateMessage && (
            <div className={`update-message ${updateMessage.toLowerCase().includes("success") ? "success" : "error"}`}>
              {updateMessage}
            </div>
          )}

          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <button className="btn-primary" type="button" onClick={handleSaveProfile} disabled={saveDisabled}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button className="btn-secondary" type="button" onClick={handleCancelEdit} disabled={isUpdating}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="view-actions">
                <button className="btn-primary" type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
                <button className="btn-secondary" type="button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn" type="button" onClick={() => navigate("/liked")}>
                  <span>❤️</span> View Wishlist
                </button>
                <button className="action-btn" type="button" onClick={() => navigate("/page")}>
                  <span>🛍️</span> Browse Products
                </button>
                <button className="action-btn" type="button" onClick={() => navigate("/create")}>
                  <span>➕</span> Add Product
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