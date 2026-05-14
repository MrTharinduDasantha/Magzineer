// Application entry point — Redux Provider, React Router, Toast notifications
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";
import { store } from "./app/store.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Redux store available to all components */}
    <Provider store={store}>
      {/* Client-side routing */}
      <BrowserRouter>
        <App />

        {/* Global toast notifications — light editorial theme */}
        <ToastContainer
          position="bottom-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
          toastStyle={{
            fontFamily: "Inter, sans-serif",
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
