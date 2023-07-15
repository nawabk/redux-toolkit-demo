import { addToCart } from "../features/cart";
import { useAppDispatch } from "../store/hooks";
import { Cart_Operation, type Product as ProductType } from "../types";

const Product: React.FC<{ product: ProductType }> = ({ product }) => {
  const { title, price, quantity } = product;
  const dispatch = useAppDispatch();
  return (
    <div className="product">
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p>Price : {price}/pc</p>
        <p>Total * {quantity} </p>
      </div>
      <div className="product-actions">
        <button
          className="product-btn"
          onClick={() =>
            dispatch(
              addToCart({
                productId: product.id,
                operation: Cart_Operation.ADD,
              })
            )
          }
        >
          +
        </button>
        <button
          className="product-btn"
          onClick={() =>
            dispatch(
              addToCart({
                productId: product.id,
                operation: Cart_Operation.REMOVE,
              })
            )
          }
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Product;
