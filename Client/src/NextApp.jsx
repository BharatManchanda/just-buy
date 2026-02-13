"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import store, { persistor } from "./store/redux/store";
import LoadingIndicator from "./Components/Common/LoadingIndicator";

const NextApp = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingIndicator />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

export default NextApp;
