import React from "react"
import ReactDOM from "react-dom/client"
import { createHashRouter, RouterProvider } from "react-router-dom"

// Import our pages
import HomePage from "./pages/HomePage.jsx"
import SlidePage from "./pages/SlidePage.jsx"
import VotingPage from "./pages/VotingPage.jsx"

//Import our components

const router = createHashRouter([
  {
    path: "",
    element: <HomePage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/slide/:slideId",
    element: <SlidePage />
  },
  {
    path: "/vote/:slideId",
    element: <VotingPage />
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);



