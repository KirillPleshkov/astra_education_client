import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DisciplineStartPage from "./pages/DisciplineStartPage";
import Navbar from "./components/Navbar";
import "./style.css";
import DisciplinePage from "./pages/DisciplinePage";
import LoginPage from "./pages/LoginPage";
import UserProvider from "./contexts/UserContext";
import CurriculumPage from "./pages/CurriculumPage";
import DisciplineConstructor from "./pages/teacher_pages/DisciplineConstructor";
import CurriculumConstructor from "./pages/teacher_pages/CurriculumConstructor";
import ModuleConstructor from "./pages/teacher_pages/ModuleConstructor";
import ModulePage from "./pages/ModulePage";
import ProfilePage from "./pages/ProfilePage";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import TeacherDisciplinePage from "./pages/TeacherDisciplinePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route element={<Navbar />}>
              <Route path="/" element={<HomePage />} />

              <Route
                path="/discipline/:disciplineId/:moduleId"
                element={<DisciplinePage />}
              />
              <Route
                path="/discipline/:disciplineId/"
                element={<DisciplineStartPage />}
              />

              <Route path="curriculum" element={<CurriculumPage />} />

              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/module_constructor"
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

              <Route path="/module/:moduleId" element={<ModulePage />} />

              <Route path="/me" element={<ProfilePage />} />

              <Route
                path="/teacher/:teacherId"
                element={<TeacherProfilePage />}
              />

              <Route
                path="/teacher_disciplines"
                element={<TeacherDisciplinePage />}
              />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
