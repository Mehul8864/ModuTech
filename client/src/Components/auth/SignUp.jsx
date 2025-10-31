import React, { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import "./auth.css";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const signUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update the user's display name
            if (displayName) {
                await updateProfile(userCredential.user, {
                    displayName: displayName
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="sign-in-container">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join us and start exploring amazing gadgets</p>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form className="auth-form" onSubmit={signUp}>
                    <div className="form-group">
                        <label className="form-label">Display Name</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Enter your display name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button className="auth-button" type="submit" disabled={loading}>
                        {loading && <span className="loading-spinner"></span>}
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                
                <div className="auth-divider">or</div>
                
                <Link to="/signin" className="auth-link-button">
                    Already Have an Account? Sign In
                </Link>
                
                <div className="auth-footer">
                    <p>
                        <Link to="/">← Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;