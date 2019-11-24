import axiosService from "../commons/axios.service";
import { API_ENDPOINT } from "../constants/index.constants";

const url = "schedule";
const urls = "schedules";

export const getListSchedule = () => {
   return axiosService.get(`${API_ENDPOINT}/${urls}`);
};

export const getScheduleById = idSchedule => {
   return axiosService.get(`${API_ENDPOINT}?idSchedule=${idSchedule}`);
};

export const postSchedule = data => {
   return axiosService.post(`${API_ENDPOINT}/${url}`, data);
};

export const deleteSchedule = idSchedule => {
   return axiosService.delete(
      `${API_ENDPOINT}/${url}?idSchedule=${idSchedule}`
   );
};

export const patchSchedule = data => {
   return axiosService.patch(`${API_ENDPOINT}/${url}`, data);
};
