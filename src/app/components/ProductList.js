"use client"

import { useState, useEffect } from "react";
import productsData from "../data.json";

const ProductList = () => {
    const [cart, setCart] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]); // Modification pour suivre les produits sélectionnés

    useEffect(() => {
        setProducts(productsData);
    }, []);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const itemExists = prevCart.find((item) => item.name === product.name);
            if (itemExists) {
                return prevCart.map((item) =>
                    item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setSelectedProducts((prevSelectedProducts) => [...prevSelectedProducts, product]); // Ajout du produit sélectionné
    };

    const removeFromCart = (product) => {
        setCart((prevCart) => prevCart.filter((item) => item.name !== product.name));
        setSelectedProducts((prevSelectedProducts) => prevSelectedProducts.filter((item) => item.name !== product.name)); // Suppression du produit sélectionné
    };

    const updateQuantity = (product, delta) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.name === product.name && item.quantity + delta > 0
                    ? { ...item, quantity: item.quantity + delta }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const confirmOrder = () => {
        setShowConfirmation(true);
        document.body.classList.add('active'); // Ajout de la classe active sur le body de la page
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
        setCart([]);
        setSelectedProducts([]); // Réinitialisation des produits sélectionnés après la confirmation de la commande
        document.body.classList.remove('active'); // Retirer la classe active du body de la page
    };

    const getImageForScreenSize = (image) => {
        if (!image) return '';

        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) return image.mobile || '';
            if (window.innerWidth < 768) return image.tablet || '';
            if (window.innerWidth >= 1440) return image.desktop || '';
        }
        return image.mobile || '';
    };

    const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="container">
            <h1 className="title">Desserts</h1>
            <div className="products">
                {products.map((product) => (
                    <div key={product.name} className="product-card">
                        <img
                            src={process.env.PUBLIC_URL + getImageForScreenSize(product.image)}
                            alt={product.name}
                            className={`product-image ${selectedProducts.find((item) => item.name === product.name) ? 'border-red-700 border-2' : ''}`}
                        />
                        <div className="description">
                            <p className="category">{product.category}</p>
                            <h2 className="name">{product.name}</h2>
                            <p className="price">${product.price.toFixed(2)}</p>
                        </div>
                        {cart.find((item) => item.name === product.name) ? (
                            <div className="add-to-cart remove">
                                <button onClick={() => updateQuantity(product, -1)} className="quantity-button">-</button>
                                <span className="quantity">
                                    {cart.find((item) => item.name === product.name).quantity}
                                </span>
                                <button onClick={() => updateQuantity(product, 1)} className="quantity-button">+</button>
                            </div>
                        ) : (
                            <button onClick={() => addToCart(product)} className="add-to-cart">
                                <img src="../../../images/icon-add-to-cart.svg" alt="add to cart" />
                                Add to Cart
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="cart">
                <h2>Your Cart ({totalItemsInCart})</h2>
                {cart.length === 0 ? (
                    <div className="box-image">
                        <img src="../../../images/illustration-empty-cart.svg" alt="empty cart" />
                        <p>Your added items will appear here</p>
                    </div>
                ) : (
                    <>
                        <ul>
                            {cart.map((item) => (
                                <li key={item.name} className="list-cart">
                                    <span className="cart-name">{item.name}</span>
                                    <div className="cart-ckeck">
                                        <p className="cart-quantity">{item.quantity} x</p>
                                        <p className="cart-price"> @ ${item.price.toFixed(2)}</p>
                                        <p className="cart-total"> ${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item)} className="remove-button">X</button><hr></hr>
                                </li>
                            ))}
                        </ul>
                        <div className="total-price">
                            <p>Order Total</p> <span>${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                        </div>
                        <div className="carbon">
                            <img src="../../../images/icon-carbon-neutral.svg" alt="carbon" />
                            <span>This is a <strong>carbon-neutral</strong> delivery</span>
                        </div>
                        <button onClick={confirmOrder} className="confirm-order">Confirm Order</button>
                    </>
                )}
            </div>
            {showConfirmation && (
                <div className="modal">
                    <div className="modal-content">
                        <img className="icon" src="../../../images/icon-order-confirmed.svg" alt="confirmation" />
                        <h2>Order Confirmed</h2>
                        <p className="modal-description">We hape you enjoy your food!</p>
                        <ul className="list">
                            {cart.map((item) => (
                                <>
                                    <li key={item.name} className="list-item">
                                        <img
                                            src={process.env.PUBLIC_URL + getImageForScreenSize(item.image)}
                                            alt={item.name}
                                            className="image-thubnail"
                                        />
                                        <span className="list-name">{item.name}</span>
                                        <div className="list-description">
                                            <span className="list-quantity"> {item.quantity} x</span>
                                            <span className="list-price"> @ ${item.price.toFixed(2)}</span>
                                            <span className="list-total"> ${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </li>
                                    <hr></hr>
                                </>
                            ))}
                            <div className="total-price">
                            <p>Order Total</p> <span className="prices">${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                            </div>
                        </ul>
                        <button onClick={closeConfirmation} className="close-modal">Start New Order</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
