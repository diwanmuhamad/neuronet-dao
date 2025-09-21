"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearCart, getCartItems, onCartChange } from "@/src/utils/cart";
import { useAuth } from "@/src/contexts/AuthContext";
import { buyItemById } from "@/src/utils/purchase";

const CheckoutSection = () => {
  const [items, setItems] = useState(getCartItems());
  const { identity, principal, icpBalance, refreshICPBalance } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    const off = onCartChange(setItems);
    return () => off();
  }, []);
  const subtotal = useMemo(() => items.reduce((s: number, i: any) => s + i.price * i.quantity, 0), [items]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setMessage("Your cart is empty");
      return;
    }
    if (!principal) {
      setMessage("Please connect your wallet to place order");
      return;
    }
    setPlacing(true);
    setMessage("");
    try {
      // Purchase items sequentially; could be parallel with care about ledger limits
      for (const i of items) {
        for (let q = 0; q < (i.quantity ?? 1); q++) {
          const res = await buyItemById(
            { identity, principal, icpBalance, refreshICPBalance },
            i.id
          );
          if (!res.ok) {
            setMessage(res.message || "Failed to buy an item");
            setPlacing(false);
            return;
          }
        }
      }
      clearCart();
      setMessage("Order placed successfully!");
      // Redirect to marketplace prompt after 2 seconds
      setTimeout(() => {
        router.push("/marketplace/prompt");
      }, 2000);
    } catch (err) {
      setMessage("Failed to place order");
    }
    setPlacing(false);
  };
  return (
    <section className="checkout-m fade-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__header">
              <h2 className="light-title fw-7 text-white title-animation mt-12">
                CheckOut
              </h2>
            </div>
          </div>
        </div>
        <div className="row gaper">
          {/* <div className="col-12 col-lg-7">
            <div className="checkout-m__form">
              <div className="intro">
                <h4>Shipping Address</h4>
              </div>
            </div>
          </div> */}
          <div className="col-12 col-lg-12 order-first order-lg-last">
            <div className="checkout-m__content fade-top">
              <h5 className="mt-12 text-white fw-6">Your Order</h5>
              <hr />
              {items.map((i: any) => (
                <div className="item-signle" key={i.id}>
                  <div className="item-thumb">
                    <div className="thumb">
                      <Image src={i.imageUrl} alt="Image" priority width={60} height={60} />
                    </div>
                    <div className="cart-content">
                      <p>{i.name}</p>
                      <p>{i.price.toFixed(2)} ICP</p>
                    </div>
                  </div>
                  <div className="item-qty">
                    <span>{i.quantity}</span>
                  </div>
                </div>
              ))}
              <div className="item-overview">
                <p>
                  <span>Delivery</span>
                  <span>0 ICP</span>
                </p>
                <p>
                  <span>Discount</span>
                  <span>0 ICP</span>
                </p>
              </div>
              <div className="item-total">
                <h3>Total</h3>
                <h3>{subtotal.toFixed(2)} ICP</h3>
              </div>
            </div>
            <form onSubmit={handlePlaceOrder}>
                <div className="section__cta text-start">
                  <button type="submit" className="btn btn--primary" disabled={placing || items.length === 0}>
                    {placing ? "Placing..." : "Place Order"}
                  </button>
                </div>
              </form>
              {message && (
                <div className="alert alert-info mt-3">{message}</div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSection;
