import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DisciplineStartPage from "./pages/DisciplineStartPage";
import Navbar from "./components/Navbar";
import "./style.css";
import DisciplinePage from "./pages/DisciplinePage";
import LoginPage from "./pages/LoginPage";
import UserProvider from "./contexts/UserContext";
import ModuleConstructor from "./pages/teacher_pages/ModuleConstructor";

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

              <Route path="/login" element={<LoginPage />} />

              <Route
                path="module_constructor"
                element={<ModuleConstructor />}
              />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
