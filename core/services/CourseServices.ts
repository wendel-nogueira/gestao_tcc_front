import { useApi } from "../hooks/useApi";
import { Course } from "../models/Course";
import { Edict } from "../models/Edict";

const url = "https://5cd4e4d3fa8bcbbb21cbbcfb21ced38e.loophole.site";

export function CouseServices() {
  const api = useApi();

  const fetchCourses = async () => {
    const response = await api.get<Course[]>(`${url}${url}/api/course`);
    return response.data;
  };

  const fetchCourse = async (id: string) => {
    const response = await api.get<Course>(`${url}/api/couse/${id}`);
    return response.data;
  };

  const createCourse = async (course: Course) => {
    const response = await api.post<Course>(`${url}/api/course`, course);
    return response.data;
  };

  const updateCourse = async (course: Course) => {
    const response = await api.put<Course>(`${url}/api/course/${course.id}`, course);
    return response.data;
  };

  const removeCourse = async (course: Course) => {
    const response = await api.delete<Course>(`${url}/api/course/${course.id}`);
    return response.data;
  };

  const addEdictCourse = async (course: Course, edict: Edict) => {
    const response = await api.post<Course>(`${url}/api/course/${course.id}/edict`, edict);
    return response.data;
  };

  const removeEdictCourse = async (course: Course, edict: Edict) => {
    const response = await api.post<Course>(`${url}/api/course/${course.id}/edict/${edict.id}`);
    return response.data;
  };



  return {
    fetchCourses,
    fetchCourse,
    createCourse,
    updateCourse,
    removeCourse,
    addEdictCourse,
    removeEdictCourse,
  };
}
