import { Post, Tag } from "@model/postsTypes";
import { rtkApi } from "./rtkApi";

const BASE_URL = "/posts";

const postsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<Post[], undefined>({
      query: () => ({
        url: BASE_URL,
      }),
      providesTags: ["Posts"],
    }),
    getPostById: build.query<Post, string>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
      }),
    }),
    createPost: build.mutation<
      Post,
      { title: string; userId: number; tags: string[]; body: string }
    >({
      query: (post) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body: {
          ...post,
          reactions: {
            likes: 0,
            dislikes: 0,
          },
        },
      }),
      invalidatesTags: ["Posts"],
    }),
    editPost: build.mutation<Post, Post>({
      query: (post) => ({
        url: `${BASE_URL}/${post.id}`,
        method: "put",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    deletePost: build.mutation<Post, number>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Posts"],
    }),
    getTagsList: build.query<Tag[], undefined>({
      query: () => ({
        url: "/tags",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useGetTagsListQuery,
} = postsApi;
