import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export const getAllTasks = async (page : string,size : string,query : string): Promise<Task[]> => {
  const response: AxiosResponse<Task[]> = await api.get('/task',{
    params: {
        page: page,
        size: size,
        query: query
    }});
  return response.data;
};

export const getTaskById = async (id: number): Promise<Task> => {
  const response: AxiosResponse<Task> = await api.get(`/task/${id}`);
  return response.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response: AxiosResponse<Task> = await api.post('/task', task);
  return response.data;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const response: AxiosResponse<Task> = await api.put(`/task/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/task/${id}`);
};