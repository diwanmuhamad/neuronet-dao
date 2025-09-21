"use client";
import { useState } from "react";
import Image from "next/image";
import { updateItemQuantity } from "@/src/utils/cart";
import SecureImage from "../SecureImage";

const CartSingleItem = ({ item, onDelete }: any) => {
  const [quantity, setQuantity] = useState(parseInt(item.quantity, 10));
  const price = parseFloat(item.price);

  const cartItemPrice = () => {
    return (quantity * price).toFixed(2);
  };

  const increaseQuantity = () => {};

  const decreaseQuantity = () => {};

  const removeItem = () => {
    onDelete();
  };

  return (
    <tr className="cart-item-single-m">
      <td className="cart-single-product">
        <div className="thumb">
          <SecureImage src={item.imageUrl} alt="Image" width={80} height={80} />
        </div>
        <div className="cart-content">
          <p>{item.name}</p>
          <div className="item-review">
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
          </div>
        </div>
      </td>
      <td>
        <p>
          ICP<span className="item-price">{price.toFixed(2)}</span>
        </p>
      </td>
      <td>
        <div className="measure">
          <span className="item-quantity">1</span>
        </div>
      </td>
      <td>
        <div className="amount">
          <p>
            ICP<span className="total-price">{cartItemPrice()}</span>
          </p>
        </div>
      </td>
      <td className="cart-cta">
        <button className="remove-item" onClick={removeItem}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </td>
    </tr>
  );
};

export default CartSingleItem;
