import "./App.css";
import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import ApolloAppProvider from "./ApolloProvider";

function App() {
  return (
    <ApolloAppProvider>
      <Navbar />
      <Outlet />
    </ApolloAppProvider>
  );
}

export default App;
