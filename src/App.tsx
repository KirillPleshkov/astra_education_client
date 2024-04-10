import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DisciplineStartPage from "./pages/DisciplineStartPage";
import Navbar from "./components/Navbar";
import "./style.css";
import DisciplinePage from "./pages/DisciplinePage";
import LoginPage from "./pages/LoginPage";
import UserProvider from "./contexts/UserContext";
import MainConstructor from "./pages/teacher_pages/MainConstructor";
import ModuleConstructor from "./pages/teacher_pages/ModuleConstructor";
import CurriculumPage from "./pages/CurriculumPage";
import DisciplineConstructor from "./pages/teacher_pages/DisciplineConstructor";
import CurriculumConstructor from "./pages/teacher_pages/CurriculumConstructor";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
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

              <Route path="curriculum" element={<CurriculumPage />} />

              <Route path="/login" element={<LoginPage />} />

              <Route path="/main_constructor" element={<MainConstructor />} />

              <Route
                path="/module_constructor/:moduleId"
                element={<ModuleConstructor />}
              />

              <Route
                path="/discipline_constructor"
                element={<DisciplineConstructor />}
              />

              <Route
                path="/curriculum_constructor"
                element={<CurriculumConstructor />}
              />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
