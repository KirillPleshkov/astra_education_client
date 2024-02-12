import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ModulePage from "./pages/ModulePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="module/:moduleId" element={<ModulePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
