"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CartSingleItem from "./CartSingleItem";
import {
  getCartItems,
  onCartChange,
  removeItemFromCart,
} from "@/src/utils/cart";

const CartSection = () => {
  const [cartItems, setCartItems] = useState(getCartItems());

  useEffect(() => {
    const off = onCartChange(setCartItems);
    return () => off();
  }, []);

  const handleDelete = (itemId: number) => {
    removeItemFromCart(itemId);
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0),
    [cartItems]
  );

  return (
    <section className="cart-m">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="cart-m-inner">
              <div className="intro">
                <h2 className="light-title fw-7 text-white mt-12">
                  Cart
                </h2>
              </div>
              <div className="cart-t-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item: any) => {
                      return (
                        <CartSingleItem
                          key={item.id}
                          item={item}
                          onDelete={() => handleDelete(item.id)}
                        />
                      );
                    })}
                  </tbody>
                </table>
                <h4 className="text-center fw-6 text-white empty-cart-m">
                  {cartItems.length === 0 ? "Your Cart Is Empty" : ""}
                </h4>
              </div>
              <div className="cart__wrapper-footer">
                {/* <form action="#" method="post">
                  <input
                    type="text"
                    name="promo-code"
                    id="promoCode"
                    placeholder="Promo code"
                  />
                  <button type="submit" className="btn btn--secondary">
                    Apply Code
                  </button>
                </form> */}
                <div className="text-white fw-6">Subtotal: {subtotal.toFixed(2)} ICP</div>
                <Link href="/checkout" className="btn btn--primary fw-6">Checkout</Link>
              </div>
              <div className="cart-content-cta text-center">
                <Link href="/marketplace">
                  Continue Shopping
                  <span className="material-symbols-outlined">
                    trending_flat
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartSection;
