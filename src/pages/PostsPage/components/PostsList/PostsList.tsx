import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useStore } from "../../../../store";
import { RoutePath } from "../../../../model/baseTypes";
import PostItem from "../PostItem";
import { Loader } from "../../../../components/Loader";

import s from "./PostsList.module.scss";

const PostsList = () => {
  const { postsLoadingInitial, loadPosts, posts } = useStore();

  useEffect(() => {
    if (!posts.length) {
      loadPosts();
    }
  }, [loadPosts, posts]);

  return (
    <>
      {postsLoadingInitial ? (
        <Loader />
      ) : (
        <div className={s.PostsList}>
          {posts.map(({ id, title, tags, body }) => (
            <Link
              key={id}
              className={s.PostsList__link}
              to={RoutePath.POST_ITEM.replace(":id", String(id))}
            >
              <PostItem title={title} tags={tags} body={body} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default PostsList;
