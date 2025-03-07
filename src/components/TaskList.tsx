import { Task } from "../types/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskList = ({ onEdit, tasks, onDelete, onToggle }: TaskListProps) => {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <div className="empty-state">
          No tasks found. Create your first task!
        </div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            onEdit={onEdit}
            key={task.id}
            task={task}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
