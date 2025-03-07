/* import { useState, useEffect } from "react";
import { Task } from "../types/types";

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (task: Omit<Task, "id" | "status">) => Promise<void>;
  onCancel?: () => void;
}

const TaskForm = ({ initialData, onSubmit, onCancel }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

 
  const [isEditing, setIsEditing] = useState(false);

 
  useEffect(() => {
    if (initialData) {
      setIsEditing(true);
      setFormData({
        title: initialData.title,
        description: initialData.description,
        dueDate: new Date(initialData.dueDate).toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);

    
    setIsEditing(false);

    if (!initialData) {
      setFormData({ title: "", description: "", dueDate: "" });
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", dueDate: "" });
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <div className="task-form-container">
   
      {!isEditing && !initialData && (
        <button
          className="create-new-button"
          onClick={() => setIsEditing(true)}
        >
          Create New Task
        </button>
      )}

      {(isEditing || initialData) && (
        <form
          data-testid="task-form"
          onSubmit={handleSubmit}
          className="task-form"
        >
          <input
            type="text"
            data-testid="title-input"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            type="date"
            data-testid="due-date-input"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
 */

/* import React, { useState } from "react";

interface TaskFormProps {
  onSubmit: (taskData: {
    title: string;
    description: string;
    dueDate: string;
  }) => void;
  onCancel: () => void;
  initialData?: { title: string; description: string; dueDate: string };
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [showForm, setShowForm] = useState(initialData ? true : false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate });
    setTitle("");
    setDescription("");
    setDueDate("");
    if (!initialData) {
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setShowForm(false);
    onCancel();
  };

  return (
    <div>
      <div
        className={
          showForm ? "task-form-container" : "hidden task-form-container"
        }
      >
        <form
          data-testid="task-form"
          className="task-form"
          onSubmit={handleSubmit}
        >
          <input
            data-testid="title-input"
            placeholder="Title"
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            data-testid="due-date-input"
            required
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="form-actions">
            <button
              className="cancel-button"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button className="submit-button" type="submit">
              {initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
      {!showForm && (
        <button className="create-new-button" onClick={() => setShowForm(true)}>
          Create New Task
        </button>
      )}
    </div>
  );
};

export default TaskForm;
 */

import React, { useState, useEffect } from "react";

interface TaskFormProps {
  onSubmit: (taskData: {
    title: string;
    description: string;
    dueDate: string;
  }) => void;
  onCancel: () => void;
  initialData?: { title: string; description: string; dueDate: string };
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [dueDate, setDueDate] = useState(initialData?.dueDate.substring(0, 10)); // Initialize as empty string

  useEffect(() => {
    if (initialData?.dueDate) {
      setDueDate(initialData.dueDate.substring(0, 10));
    } else {
      setDueDate("");
    }
  }, [initialData?.dueDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate });
    setTitle("");
    setDescription("");
    setDueDate("");
    if (!initialData) {
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setShowForm(false);
    onCancel();
  };

  const [showForm, setShowForm] = useState(initialData ? true : false);

  return (
    <div>
      <div
        className={
          showForm ? "task-form-container" : "hidden task-form-container"
        }
      >
        <form
          data-testid="task-form"
          className="task-form"
          onSubmit={handleSubmit}
        >
          <input
            data-testid="title-input"
            placeholder="Title"
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            data-testid="due-date-input"
            required
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="form-actions">
            <button
              className="cancel-button"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button className="submit-button" type="submit">
              {initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
      {!showForm && (
        <button className="create-new-button" onClick={() => setShowForm(true)}>
          Create New Task
        </button>
      )}
    </div>
  );
};

export default TaskForm;
