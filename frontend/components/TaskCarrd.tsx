"use client";

import { Task } from "@/types";
import { updateTaskStatus, deleteTask } from "@/lib/api";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  projectId: string;
  onUpdated: () => void;
}

const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    next: "in_progress" as const,
    nextLabel: "→ Start",
    color: "var(--text-muted)",
    bg: "rgba(255,255,255,0.04)",
  },
  in_progress: {
    label: "In Progress",
    next: "done" as const,
    nextLabel: "→ Complete",
    color: "var(--accent)",
    bg: "var(--accent-glow)",
  },
  done: {
    label: "Done",
    next: "todo" as const,
    nextLabel: "→ Reopen",
    color: "var(--success)",
    bg: "rgba(34, 197, 94, 0.1)",
  },
};

export default function TaskCard({
  task,
  projectId,
  onUpdated,
}: TaskCardProps) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const config = STATUS_CONFIG[task.status];

  const handleStatusChange = async () => {
    setUpdating(true);
    try {
      await updateTaskStatus(projectId, task.id, config.next);
      onUpdated();
    } catch {
      alert("Failed to update task");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this task?")) return;

    setDeleting(true);
    try {
      await deleteTask(projectId, task.id);
      onUpdated();
    } catch {
      alert("Failed to delete task");
      setDeleting(false);
    }
  };

  return (
    <div
      className="group rounded-lg p-5 transition-all duration-200 hover:border-border-bright"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className={`font-sans font-medium text-sm leading-snug flex-1 ${
            task.status === "done"
              ? "line-through text-text-muted"
              : "text-text-primary"
          }`}
        >
          {task.title}
        </h3>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all text-xs font-mono flex-shrink-0 disabled:opacity-40"
        >
          {deleting ? "..." : "×"}
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="font-mono text-xs text-text-secondary line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        {/* Status badge */}
        <span
          className="font-mono text-xs px-2.5 py-1 rounded-full"
          style={{ color: config.color, background: config.bg }}
        >
          {config.label}
        </span>

        {/* Advance status */}
        <button
          onClick={handleStatusChange}
          disabled={updating}
          className="font-mono text-xs text-text-muted hover:text-accent transition-colors disabled:opacity-40"
        >
          {updating ? "..." : config.nextLabel}
        </button>
      </div>
    </div>
  );
}
