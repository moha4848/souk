import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  // ...existing routes
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});
