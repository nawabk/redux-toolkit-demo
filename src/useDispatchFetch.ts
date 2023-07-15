import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";

function useDispatchFetch(method: Function) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    dispatch(method({ signal }));
    return () => {
      controller.abort();
    };
  }, [dispatch, method]);
}

export default useDispatchFetch;
