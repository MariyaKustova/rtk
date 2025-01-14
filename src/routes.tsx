import App from "./App";
import { RoutePath } from "@model/baseTypes";
import PostCard from "./pages/PostsPage/components/PostCard";
import PostsPage from "./pages/PostsPage";
import TodosPage from "./pages/TodosPage";

export const routes = [
  {
    path: RoutePath.MAIN,
    element: <App />,
    children: [
      {
        path: RoutePath.POSTS,
        title: "Posts",
        element: <PostsPage />,
        children: [
          {
            path: RoutePath.POST_ITEM,
            title: "Post",
            element: <PostCard />,
          },
        ],
      },
      {
        path: RoutePath.TODOS,
        title: "Todos",
        element: <TodosPage />,
      },
    ],
  },
];
