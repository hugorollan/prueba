import { createBrowserRouter } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import Home from "./Home";
import { ParkingDashboard } from "./pages/ParkingDashboard/ParkingDashboard";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/dashboard",
      element: <ParkingDashboard />,
    },
    {
      // This is the route defined in your application's redirect URL
      path: "/auth/callback",
      element: <AuthCallback />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
