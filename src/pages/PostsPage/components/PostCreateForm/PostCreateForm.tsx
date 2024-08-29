import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";

import { FormValues } from "@model/postsTypes";
import {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetTagsListQuery,
} from "@api/postsApi";
import { initialValues } from "./constants";
import { FieldsNames } from "./types";
import { getRandomInt } from "../../../../utils";

import s from "./PostCreateForm.module.scss";

interface PostCreateFormProps {
  open: boolean;
  onClose: () => void;
}

const PostCreateForm = ({ open, onClose }: PostCreateFormProps) => {
  const { data: posts = [] } = useGetPostsQuery(undefined);

  const postsUserIds = [...new Set(posts.map(({ userId }) => userId))];

  const { data: tagsList, error } = useGetTagsListQuery(undefined);
  const [addPost] = useCreatePostMutation();

  if (error) {
    toast.error("Error loading...");
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const onSubmit = ({ title, body, tags }: FormValues) => {
    addPost({
      title,
      userId: postsUserIds[getRandomInt(postsUserIds.length - 1)],
      tags,
      body,
    });

    onClose();
  };

  return (
    <Dialog maxWidth={"md"} fullWidth open={open} onClose={onClose}>
      <DialogTitle>Create a new post</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name={FieldsNames.TITLE}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                onChange={onChange}
                autoFocus
                required
                label={"Title of post"}
                fullWidth
                variant="standard"
                className={s.PostCreateForm__control}
                error={Boolean(errors?.[FieldsNames.TITLE])}
              />
            )}
          />
          <Controller
            name={FieldsNames.TAGS}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormControl className={s.PostCreateForm__control} fullWidth>
                <InputLabel id="tagsId">Tag</InputLabel>
                <Select
                  defaultValue={[]}
                  value={value}
                  onChange={onChange}
                  labelId="tagsId"
                  id="demo-simple-select"
                  label="Tags"
                  fullWidth
                  multiple
                  error={Boolean(errors?.[FieldsNames.TAGS])}
                >
                  {tagsList?.map(({ slug, name }) => (
                    <MenuItem key={slug} value={slug}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name={FieldsNames.BODY}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                onChange={onChange}
                required
                label={"Text of post"}
                fullWidth
                variant="standard"
                multiline
                minRows={3}
                maxRows={6}
                className={s.PostCreateForm__control}
                error={Boolean(errors?.[FieldsNames.BODY])}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={!isDirty || !isValid}
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostCreateForm;
