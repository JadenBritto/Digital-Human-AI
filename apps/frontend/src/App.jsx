import { useState } from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Scenario } from "./components/Scenario";
import { ChatInterface } from "./components/ChatInterface";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <>
      <Loader />
      <Leva collapsed hidden />
      {currentPage === "dashboard" ? (
        <Dashboard onNavigate={setCurrentPage} />
      ) : (
        <>
          <ChatInterface onNavigate={setCurrentPage} />
          <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
            <Scenario />
          </Canvas>
        </>
      )}
    </>
  );
}

export default App;
