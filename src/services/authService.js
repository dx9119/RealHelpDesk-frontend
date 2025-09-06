import axiosInstance from "./axiosInstance";
export const HOST = 'https://beta-test.RealHelpDesk.ru:8443'
const API_BASE_URL = HOST+'/api/v1/auth';

export const registerUser = async (formData, captchaId) => {
  const response = await axiosInstance.post(
      `/api/v1/auth/register?capId=${captchaId}`,
      formData,
      { withCredentials: true }
  );
  return response.data;
};


export const loginUser = async (credentials) => {
  const response = await axiosInstance.post(`${API_BASE_URL}/login`, credentials, {
    withCredentials: true
  });
  return response.data;
};
