export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  dueDate: string;
}

export interface User {
  id: string;
  username: string;
}


export interface AuthFormData {
  username: string;
  password: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
}