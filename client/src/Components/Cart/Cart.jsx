import React, { useState } from "react";
import "./cart.css";
import StripeCheckout from "react-stripe-checkout";
// import { loadStripe } from "@stripe/stripe-js";

const Cart = ({ cartItems, onRemoveFromCart, onClose }) => {
    const [showRemoveNotification, setShowRemoveNotification] = useState(false);

    const handleRemoveFromCart = (itemId) => {
        onRemoveFromCart(itemId);
        setShowRemoveNotification(true);
        setTimeout(() => {
            setShowRemoveNotification(false);
        }, 2000);
    };

    const makePayment = (token) => {
        const product = {
            name: `Cart Items (${cartItems.length} items)`,
            price: calculateTotal(),
            productBy: `Multiple items from cart`
        };

        const body = {
            token,
            product,
        };
        const headers = {
            "Content-Type": "application/json",
        };
        return fetch(`http://localhost:5001/payment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        })
            .then((response) => {
                console.log("RESPONSE ", response);
                const { status } = response;
                console.log("STATUS ", status);
                if (response.ok) {
                    alert("Payment successful! Thank you for your order.");
                    // Clear cart after successful payment
                    cartItems.forEach(item => onRemoveFromCart(item.id));
                    onClose();
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Payment failed. Please try again.");
            });
    };
    // /*Payment Stripe*/
    // const apiURL = "http://localhost:3000";
    // const makePayment = async () => {
    //     const stripe = await loadStripe(
    //         "pk_test_51Oqw7xSJ9xxwbGFGl3HWEclyl46PViE2nXyskN22ReCADSOUdLdZRtdLTts8cSzml2tOKz76XBTlM9BLvnRKkbqj00ui0soFnx"
    //     );
    //     const body = {
    //         products: cartItems,
    //     };
    //     const headers = {
    //         "Content-Type": "application/json",
    //     };
    //     const response = await fetch(`${apiURL}/create-checkout-session`, {
    //         method: "POST",
    //         headers: headers,
    //         body: JSON.stringify(body),
    //     });
    //     const session = await response.json();
    //     const result = stripe.redirectToCheckout({
    //         sessionId: session.id,
    //     });
    //     if (result.error) {
    //         console.log(result.error);
    //     }
    // }
    //     /*Till here*/

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
    };

    return (
        <>
            <div className="cart-backdrop" onClick={onClose}></div>
            <div className="cart_container">
                <div className="cart-header">
                    <h2>Shopping Cart</h2>
                    <button className="cart-close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>
            <div className="cart_items">
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <p>Your cart is empty</p>
                        <p>Add some gadgets to get started!</p>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div className="item_container" key={item.id}>
                            <img
                                className="cart_item_img"
                                src={item.img}
                                alt={item.name}
                            />
                            <div className="item_desc">
                                <div className="cart_item_name">{item.name}</div>
                                <div className="cart_item_price">${item.price}</div>
                            </div>
                            <button
                                className="remove_btn"
                                onClick={() => handleRemoveFromCart(item.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
            {cartItems.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total: ${calculateTotal()}</span>
                    </div>
                    <StripeCheckout
                        stripeKey="pk_test_51Oqw7xSJ9xxwbGFGl3HWEclyl46PViE2nXyskN22ReCADSOUdLdZRtdLTts8cSzml2tOKz76XBTlM9BLvnRKkbqj00ui0soFnx"
                        token={makePayment}
                        name="Checkout Cart"
                        amount={parseFloat(calculateTotal()) * 100}
                        shippingAddress
                        billingAddress
                    >
                        <button className="checkout-btn">
                            Proceed to Checkout - ${calculateTotal()}
                        </button>
                    </StripeCheckout>
                </div>
            )}
            {showRemoveNotification && (
                <div className="remove_notification">
                    Item removed from cart
                </div>
            )}
            </div>
        </>
    );
};

export default Cart;