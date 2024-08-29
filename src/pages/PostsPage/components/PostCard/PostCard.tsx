import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { skipToken } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

import { Loader } from "@core/Loader";
import Controls from "@core/Controls";
import { RoutePath } from "@model/baseTypes";
import {
  useDeletePostMutation,
  useEditPostMutation,
  useGetPostByIdQuery,
} from "@api/postsApi";
import { PostDialog } from "./components/PostDialog";

import s from "./PostCard.module.scss";

const PostCard = () => {
  const { id } = useParams();

  const { data: post, error, isLoading } = useGetPostByIdQuery(id ?? skipToken);

  const [deletePost] = useDeletePostMutation();
  const [editPost] = useEditPostMutation();
  const navigate = useNavigate();

  const [editPostId, setEditPostId] = useState<number | null>(null);

  const onCloseDialog = () => setEditPostId(null);

  const handleDeletePost = () => {
    if (post?.id) {
      deletePost(post.id);
    }

    navigate(RoutePath.POSTS);
  };

  const handleEditPost = (value: string) => {
    if (value.length && post?.title !== value && editPostId) {
      editPost({ id: editPostId, title: value });
    }
    onCloseDialog();
    navigate(RoutePath.POSTS);
  };

  if (error) {
    toast.error("Error loading post...");
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {post && (
            <>
              <div className={s.PostCard}>
                <IconButton
                  className={s.PostCard__backBtn}
                  onClick={() => navigate(RoutePath.POSTS)}
                >
                  <ArrowBackIosNewRoundedIcon className={s.PostCard__icon} />
                </IconButton>
                <Typography color={"primary"} variant="h5">
                  {post.title}
                </Typography>
                <Typography variant="subtitle1" color={"primary"}>
                  {post.tags.map((tag) => "#" + tag).join("")}
                </Typography>
                <Typography variant="body1">{post.body}</Typography>
                <div className={s.PostCard__wrapper}>
                  <Controls
                    onEdit={() => setEditPostId(post.id)}
                    onDelete={handleDeletePost}
                  />
                </div>
              </div>
              {Boolean(editPostId) && (
                <PostDialog
                  open={Boolean(editPostId)}
                  onClose={onCloseDialog}
                  value={post?.title}
                  onChange={handleEditPost}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default PostCard;
