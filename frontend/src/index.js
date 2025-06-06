import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Footer from "./components/footer";
import NotificationListener from "./components/NotificationListener";

function Root() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <NotificationListener isAuthenticated={isAuthenticated} />
      <App />
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
