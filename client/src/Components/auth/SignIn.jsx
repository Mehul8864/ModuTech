import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthDetails } from "../Other/AuthDetails";
import { Link } from "react-router-dom";
import "./auth.css";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const signIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthDetails />
            <div className="auth-page">
                <div className="sign-in-container">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account to continue</p>
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <form className="auth-form" onSubmit={signIn}>
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
                        
                        <button className="auth-button" type="submit" disabled={loading}>
                            {loading && <span className="loading-spinner"></span>}
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                    
                    <div className="auth-divider">or</div>
                    
                    <Link to="/signup" className="auth-link-button">
                        Create New Account
                    </Link>
                    
                    <div className="auth-footer">
                        <p>
                            <Link to="/">← Back to Home</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignIn;