import axios from "axios";
import { Curriculum } from "../../pages/teacher_pages/CurriculumConstructor";

function fetchEducationalLevels() {
  return axios.get<Curriculum["educational_level"][]>(
    `${import.meta.env.VITE_BACKEND_URL}curriculum/educational_level/`
  );
}

export { fetchEducationalLevels };
