import { Task } from "../types/types";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskItem = ({ task, onEdit, onDelete, onToggle }: TaskItemProps) => {
  return (
    <div className={`task-item ${task.status}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          <button
            onClick={() => onToggle(task.id)}
            className={task.status === "completed" ? "success" : "primary"}
          >
            {task.status === "completed" ? "Undo" : "Complete"}
          </button>

          {task.status !== "completed" && (
            <button onClick={() => onEdit(task)} className="warning">
              Edit
            </button>
          )}

          <button onClick={() => onDelete(task.id)} className="danger">
            Delete
          </button>
        </div>
      </div>

      {task.description && <p>{task.description}</p>}

      <div className="task-footer">
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        <span className={`status-badge ${task.status}`}>{task.status}</span>
      </div>
    </div>
  );
};

export default TaskItem;
