import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import { AuthContextProvider, useAuthContext } from "./store/auth-context";
import ImageGeneration from "./components/ImageGeneration";
import ParticlesComponent from "./components/Particles";

function App() {
  const { token } = useAuthContext();
  return (
    <div className="bg-stone-800 min-h-screen py-8">
      <ParticlesComponent />
      <Header />
      <main className="mt-12 relative">
        {" "}
        {!token ? <AuthForm /> : <ImageGeneration />}
      </main>
    </div>
  );
}

export default App;
