import { useEffect } from "react";
import "./App.css";
import LandingPage from "@/components/LandingPage";
import { cryptoWaitReady } from "@polkadot/util-crypto";

function App() {
  useEffect(() => {
    cryptoWaitReady();
  }, []);
  return <LandingPage />;
}

export default App;
