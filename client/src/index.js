import React from "react";
import ReactDOM from "react-dom";
import Providers from './providers/Providers.comp'
import App from "./App";
import './config/config'

ReactDOM.render(
  <Providers>
    <App />
  </Providers>,
  document.getElementById("root")
);
