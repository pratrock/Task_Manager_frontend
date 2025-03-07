import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { Task } from "../types/types";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        await api.get("/auth/verify");
        const { data } = await api.get("/tasks");
        setTasks(data);
      } catch (error) {
        console.error("Session initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("refreshToken")) {
      initializeSession();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks");
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("accessToken")) {
      fetchTasks();
    }
  }, [renderTrigger]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner" />
      </div>
    );
  }

  const handleCreate = async (taskData: Omit<Task, "id" | "status">) => {
    const { data } = await api.post("/tasks", taskData);
    setTasks([...tasks, data]);
    setShowForm(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
    setRenderTrigger((prev) => prev + 1);
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedTask = {
      ...task,
      status: task.status === "pending" ? "completed" : "pending",
    };
    const { data } = await api.put(`/tasks/${id}`, updatedTask);
    setTasks(tasks.map((t) => (t.id === id ? data : t)));
  };

  const handleUpdate = async (taskData: Omit<Task, "id" | "status">) => {
    if (!editingTask) return;

    try {
      const { data } = await api.put(`/tasks/${editingTask.id}`, {
        ...taskData,
        status: editingTask.status,
      });
      setTasks(tasks.map((t) => (t.id === editingTask.id ? data : t)));
      setEditingTask(undefined);
      setShowForm(false);
      setRenderTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTask(undefined);
    setShowForm(false);
  };

  return (
    <div className="dashboard">
      <h1>My Tasks</h1>

      {showForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdate : handleCreate}
          initialData={editingTask}
          onCancel={handleCancel}
        />
      )}

      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
      <button
        onClick={() => {
          setEditingTask(undefined);
          setShowForm(true);
        }}
      >
        Create New Task
      </button>
    </div>
  );
};

export default Dashboard;
