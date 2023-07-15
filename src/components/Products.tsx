import { useAppSelector } from "../store/hooks";
import Product from "./Product";
import { fetchProducts } from "../features/products";
import useDispatchFetch from "../useDispatchFetch";

const Products: React.FC = () => {
  //   useEffect(() => {
  //     const controller = new AbortController();
  //     async function fetchProducts() {
  //       try {
  //         const signal = controller.signal;
  //         const res = await fetch("http://localhost:5000/products", {
  //           signal,
  //         });
  //         const data = await res.json();
  //         console.log(data);
  //       } catch (e) {
  //         if (e instanceof Error) {
  //           if (e.name === "AbortError") {
  //             console.error(e.message);
  //           }
  //         } else {
  //           console.log(e);
  //         }
  //       }
  //     }
  //     fetchProducts();
  //     return () => {
  //       controller.abort();
  //     };
  //   }, []);

  const {
    loading,
    list: products,
    error,
  } = useAppSelector((state) => state.products);

  useDispatchFetch(fetchProducts);

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  } else if (error) {
    return <h2 className="error">{error}</h2>;
  } else {
    return (
      <div className="products">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    );
  }
};

export default Products;
