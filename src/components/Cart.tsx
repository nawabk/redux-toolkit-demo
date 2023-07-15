import { useState } from "react";
import {
  addToCart,
  cartProductsSelector,
  fetchCartData,
} from "../features/cart";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import useDispatchFetch from "../useDispatchFetch";
import { Cart_Operation, type PopulatedCartProduct } from "../types";

const Cart = () => {
  useDispatchFetch(fetchCartData);
  const { loading, error, data } = useAppSelector((state) => state.cart);
  const [show, setShow] = useState<boolean>(false);
  const products = useAppSelector(cartProductsSelector);

  return (
    <div className="cart">
      <div className="cart-info" onClick={() => setShow((prev) => !prev)}>
        <h2 className="cart-title">My Cart</h2>
        <p className="cart-badge">{loading ? "..." : data.total}</p>
      </div>
      {show && <CartDetails error={error} products={products} />}
    </div>
  );
};

type Props = {
  error: string;
  products: PopulatedCartProduct[];
};
const CartDetails: React.FC<Props> = ({ error, products }) => {
  let cartDetails;
  const dispatch = useAppDispatch();
  function addClickHandler(productId: number, operation: Cart_Operation) {
    dispatch(addToCart({ productId, operation }));
  }

  if (error) {
    cartDetails = <h2>{error}</h2>;
  } else {
    if (products.length === 0) {
      cartDetails = <h2>No items added in the cart.</h2>;
    } else {
      cartDetails = products.map((product) => (
        <div className="cart-item" key={product.id}>
          <h2 className="cart-item-title">{product.title}</h2>
          <div className="cart-item-info">
            <p>Total : {product.count}</p>
            <p>Price : {product.totalPrice}</p>
          </div>
          <div className="cart-item-actions">
            <button
              onClick={() => addClickHandler(product.id, Cart_Operation.ADD)}
            >
              +
            </button>
            <button
              onClick={() => addClickHandler(product.id, Cart_Operation.REMOVE)}
            >
              -
            </button>
          </div>
        </div>
      ));
    }
  }
  return <div className="cart-details">{cartDetails}</div>;
};

export default Cart;
