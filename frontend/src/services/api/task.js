import api from "./axios";

export const getTasks = async ({ page = 1, limit = 10, search = "", status = "" } = {}) => {
  const res = await api.get("/tasks", {
    params: {
      page,
      limit,
      ...(search && { search }),
      ...(status && { status }),
    },
  });
  return res.data; 
};

export const getTaskById = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data; 
};

export const createTask = async ({ title, description, status }) => {
  const res = await api.post("/tasks", { title, description, status });
  return res.data; 
};

export const updateTask = async (id, { title, description, status }) => {
  const res = await api.put(`/tasks/${id}`, { title, description, status });
  return res.data; 
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data; 
};

