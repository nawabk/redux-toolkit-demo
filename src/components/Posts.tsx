import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPosts } from "../features/post";

const Posts = () => {
  const dispatch = useAppDispatch();
  const { loading, list, error } = useAppSelector((state) => state.post);

  useEffect(() => {
    // async function helper() {
    //   try {
    //     const actionResult = await dispatch(fetchPosts());
    //     const promiseResult = unwrapResult(actionResult);
    //     console.log(promiseResult);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    // helper();
    dispatch(fetchPosts());
  }, [dispatch]);

  let jsx;
  if (loading) {
    jsx = <h2>Loading...</h2>;
  } else if (error !== "") {
    jsx = <pre>{error}</pre>;
  } else {
    jsx = list.map((post) => (
      <div className="post" key={post.id}>
        <p>Title : {post.title}</p>
      </div>
    ));
  }
  return <div className="posts">{jsx}</div>;
};

export default Posts;
