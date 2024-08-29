import { Post, PostsResponse, Tag } from "@model/postsTypes";
import { rtkApi } from "./rtkApi";

const BASE_URL = "/posts";

const postsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<Post[], undefined>({
      query: () => ({
        url: BASE_URL,
      }),
      transformResponse: (response: PostsResponse) => response.posts,
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
      query: ({ title, userId }) => ({
        url: `${BASE_URL}/add`,
        method: "POST",
        body: { title, userId },
      }),
      async onQueryStarted({ tags, body }, { dispatch, queryFulfilled }) {
        try {
          const { data: createdPost } = await queryFulfilled;
          dispatch(
            postsApi.util.updateQueryData(
              "getPosts",
              undefined,
              (posts: Post[]) => {
                posts.push({
                  ...createdPost,
                  reactions: {
                    likes: 0,
                    dislikes: 0,
                  },
                  tags,
                  body,
                });
              }
            )
          );
        } catch {}
      },
    }),
    editPost: build.mutation<Post, { title: string; id: number }>({
      query: ({ title, id }) => ({
        url: `${BASE_URL}/${id}`,
        method: "put",
        body: { title },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: editPost } = await queryFulfilled;
          dispatch(
            postsApi.util.updateQueryData(
              "getPosts",
              undefined,
              (posts: Post[]) =>
                posts.map((post) => {
                  if (post.id === editPost.id) {
                    return editPost;
                  }
                  return post;
                })
            )
          );
          dispatch(
            postsApi.util.updateQueryData(
              "getPostById",
              String(editPost.id),
              () => editPost
            )
          );
        } catch {}
      },
    }),
    deletePost: build.mutation<Post, number>({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "delete",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: deletedPost } = await queryFulfilled;
          dispatch(
            postsApi.util.updateQueryData(
              "getPosts",
              undefined,
              (posts: Post[]) => posts.filter(({ id }) => id !== deletedPost.id)
            )
          );
        } catch {}
      },
    }),
    getTagsList: build.query<Tag[], undefined>({
      query: () => ({
        url: `${BASE_URL}/tags`,
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
