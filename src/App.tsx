import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DisciplineStartPage from "./pages/DisciplineStartPage";
import Navbar from "./components/Navbar";
import "./style.css";
import DisciplinePage from "./pages/DisciplinePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Navbar />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/discipline/:curriculumId/:disciplineId/:moduleId"
              element={<DisciplinePage />}
            />
            <Route
              path="/discipline/:curriculumId/:disciplineId/"
              element={<DisciplineStartPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
