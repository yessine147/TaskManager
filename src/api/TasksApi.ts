import axios, { AxiosResponse } from "axios";

// Base URL for the API
const BASE_URL = "http://localhost:3000";

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Interface for representing a Task object
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

// Function to fetch all tasks from the API
export const getAllTasks = async (
  page: string,
  size: string,
  query: string
): Promise<any> => {
  // Make a GET request to '/tasks' endpoint with pagination and search parameters
  const response: AxiosResponse<any> = await api.get("/tasks", {
    params: {
      page: (parseInt(page) - 1).toString(), // Convert page to 0-based index
      size: size,
      query: query,
    },
  });
  // Return response data containing list of tasks
  return response.data;
};

// Function to fetch a specific task by ID from the API
export const getTaskById = async (id: number): Promise<Task> => {
  // Make a GET request to '/tasks/{id}' endpoint
  const response: AxiosResponse<Task> = await api.get(`/tasks/${id}`);
  // Return response data containing task details
  return response.data;
};

// Function to create a new task via POST request to the API
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  // Make a POST request to '/tasks' endpoint with task data
  const response: AxiosResponse<Task> = await api.post("/tasks", task);
  // Return response data containing newly created task details
  return response.data;
};

// Function to update an existing task via PUT request to the API
export const updateTask = async (
  id: number,
  task: Partial<Task>
): Promise<Task> => {
  // Make a PUT request to '/tasks/{id}' endpoint with updated task data
  const response: AxiosResponse<Task> = await api.put(`/tasks/${id}`, task);
  // Return response data containing updated task details
  return response.data;
};

// Function to delete a task via DELETE request to the API
export const deleteTask = async (id: number): Promise<void> => {
  // Make a DELETE request to '/tasks/{id}' endpoint
  await api.delete(`/tasks/${id}`);
};
