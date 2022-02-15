import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import { PATHS } from "../constants/paths";
import { useAuth } from "../contexts/auth_context";
import Homepage from "./home";
import NotFoundPage from "./not_found";

const commonRoutes: RouteObject[] = [
  {
    index: true,
    element: <Homepage />,
  },
  {
    path: PATHS.homepage,
    element: <Homepage />,
  },
  {
    path: PATHS.notFound,
    element: <NotFoundPage />,
  },
];

export const protectedRoutes: RouteObject[] = [
  ...commonRoutes,
  {
    path: "/",
    // element: <Layout />,
    children: [
      {
        path: "*",
        element: <Navigate to={PATHS.notFound} replace />,
      },
    ],
  },
];

export const publicRoutes: RouteObject[] = [
  ...commonRoutes,
  {
    path: PATHS.login,
    element: <NotFoundPage />,
  },
  {
    path: PATHS.createBlogPost,
    element: <Navigate to={PATHS.login} replace />,
  },
  {
    path: "*",
    element: <Navigate to={PATHS.notFound} replace />,
  },
];

const Routes = () => {
  const auth = useAuth();
  const routes = useRoutes(auth.isLoggedIn ? protectedRoutes : publicRoutes);
  return routes;
};

export default Routes;
