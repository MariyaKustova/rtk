import { BaseResponse as BasePostsResponse } from "./baseTypes";

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface PostsResponse extends BasePostsResponse {
  posts: Post[];
}

export interface Tag {
  slug: string;
  name: string;
  url: string;
}

export interface FormValues {
  title: string;
  tags: string[];
  body: string;
}
