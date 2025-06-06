import api from "../api/axios";

const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

const register = (data) => {
  return api.post("/auth/register", data);
};

export default { login, register };
