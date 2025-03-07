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
    onSubmit({ title, description, dueDate: dueDate || "" });
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
