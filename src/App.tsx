import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./contexts/auth_context";
import Routes from "./routes/routes";

type Props = {};

const App = (props: Props) => {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;
