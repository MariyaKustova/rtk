import React, { useEffect, useState } from "react";

import { Link, Route, Routes } from "react-router-dom";
import { Typography } from "@mui/material";
import { useStore } from "../../store";
import { RoutePath } from "../../model/baseTypes";
import PostItemPage from "./components/PostCard";
import { Loader } from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import PostItem from "./components/PostItem";
import PostCreateForm from "./components/PostCreateForm";

import s from "./PostsPage.module.scss";

const PostsPageComponent = () => {
  const { postsLoadingInitial: loadingInitial, posts, loadPosts } = useStore();
  const [openCreateForm, setOpenCreateForm] = useState(false);

  useEffect(() => {
    if (!posts.length) {
      loadPosts();
    }
  }, [loadPosts, posts]);

  return (
    <>
      <PageTitle title="Posts" onClick={() => setOpenCreateForm(true)} />
      {loadingInitial ? (
        <Loader />
      ) : (
        <div className={s.PostsPage__wrapper}>
          {posts.map(({ id, title, tags, body }) => (
            <Link
              key={id}
              className={s.PostsPage__link}
              to={RoutePath.POST_ITEM.replace(":id", String(id))}
            >
              <PostItem title={title} tags={tags} body={body} />
            </Link>
          ))}
        </div>
      )}
      {openCreateForm && (
        <PostCreateForm
          open={openCreateForm}
          onClose={() => setOpenCreateForm(false)}
        />
      )}
    </>
  );
};

const PostsPage = () => {
  return (
    <Routes>
      <Route path={"/"} element={<PostsPageComponent />} />
      <Route path={"/:id"} element={<PostItemPage />} />
      <Route
        path="*"
        element={
          <Typography variant="h4" component="div" color={"primary"}>
            Ресурс не найден
          </Typography>
        }
      />
    </Routes>
  );
};

export default PostsPage;
