import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/Store";
import Spinner from "./views/spinner/Spinner";
// import './_mockApis';
import "./utils/i18n";
import { QueryClientProvider } from "react-query";
import queryClient from "./utils/queryClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./theme/toast_custom.css"
//import { initAnimationLoop } from "./utils/couchAnim";

const root = ReactDOM.createRoot(document.getElementById("root"));

//initAnimationLoop();

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <BrowserRouter basename="/evivve3">
          <App />
          <ToastContainer position="bottom-left" />
        </BrowserRouter>
      </Suspense>
    </Provider>
  </QueryClientProvider>
);
