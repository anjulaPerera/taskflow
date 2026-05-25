"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjects, getTasks, createTask } from "@/lib/api";
import { Project, Task } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTask, setShowNewTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([
        getProjects(),
        getTasks(projectId),
      ]);
   const found = projectsData.find((p: Project) => p.id === projectId);
   if (!found) {
     router.push("/dashboard");
     return;
   }
   setProject(found);
   setTasks(tasksData);
    } catch {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setCreating(true);
    try {
      await createTask(projectId, taskTitle.trim(), taskDesc.trim());
      setTaskTitle("");
      setTaskDesc("");
      setShowNewTask(false);
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 animate-fade-in">
            <Link
              href="/dashboard"
              className="font-mono text-sm font-medium hover:text-accent transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              Projects
            </Link>
            <span style={{ color: "var(--text-muted)" }} className="text-sm">
              /
            </span>
            <span
              className="font-mono text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {project?.name || "..."}
            </span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-10 animate-fade-in">
            <div>
              <h1 className="font-sans font-bold text-4xl text-text-primary tracking-tight">
                {project?.name}
              </h1>
              {project?.description && (
                <p
                  className="font-sans text-base font-medium mt-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.description}
                </p>
              )}
              <p
                className="font-mono text-sm font-medium mt-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} ·{" "}
                {done.length} completed
              </p>
            </div>
            <Button onClick={() => setShowNewTask(!showNewTask)}>
              {showNewTask ? "Cancel" : "+ Add Task"}
            </Button>
          </div>

          {/* New task inline form */}
          {showNewTask && (
            <div
              className="rounded-lg p-6 mb-8 animate-slide-up"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--accent)",
              }}
            >
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent mb-5">
                New Task
              </h3>
              <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
                <Input
                  label="Title"
                  value={taskTitle}
                  onChange={setTaskTitle}
                  placeholder="What needs to be done?"
                />
                <Input
                  label="Description (optional)"
                  value={taskDesc}
                  onChange={setTaskDesc}
                  placeholder="Add more detail..."
                />
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowNewTask(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={creating}>
                    Add Task
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "var(--border)",
              marginBottom: "2.5rem",
            }}
          />

          {/* Kanban columns */}
          {loading ? (
            <p className="font-mono text-sm text-text-muted">
              Loading tasks...
            </p>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <p className="font-sans font-semibold text-text-primary mb-2">
                No tasks yet
              </p>
              <p className="font-mono text-sm text-text-muted">
                Add your first task to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
              {/* To Do */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="flex items-center gap-2 mb-4 pb-3"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "var(--text-muted)" }}
                  />
                  <span className="font-mono text-xs uppercase tracking-widest text-text-secondary font-medium">
                    To Do
                  </span>
                  <span
                    className="font-mono text-xs ml-auto px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {todo.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {todo.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projectId={projectId}
                      onUpdated={fetchData}
                    />
                  ))}
                  {todo.length === 0 && (
                    <p
                      className="font-mono text-xs text-center py-10"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No tasks
                    </p>
                  )}
                </div>
              </div>

              {/* In Progress */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-bright)",
                }}
              >
                <div
                  className="flex items-center gap-2 mb-4 pb-3"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "var(--accent)" }}
                  />
                  <span className="font-mono text-xs uppercase tracking-widest text-text-secondary font-medium">
                    In Progress
                  </span>
                  <span
                    className="font-mono text-xs ml-auto px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--accent-glow)",
                      color: "var(--accent)",
                    }}
                  >
                    {inProgress.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {inProgress.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projectId={projectId}
                      onUpdated={fetchData}
                    />
                  ))}
                  {inProgress.length === 0 && (
                    <p
                      className="font-mono text-xs text-center py-10"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No tasks
                    </p>
                  )}
                </div>
              </div>

              {/* Done */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="flex items-center gap-2 mb-4 pb-3"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "var(--success)" }}
                  />
                  <span className="font-mono text-xs uppercase tracking-widest text-text-secondary font-medium">
                    Done
                  </span>
                  <span
                    className="font-mono text-xs ml-auto px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      color: "var(--success)",
                    }}
                  >
                    {done.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {done.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projectId={projectId}
                      onUpdated={fetchData}
                    />
                  ))}
                  {done.length === 0 && (
                    <p
                      className="font-mono text-xs text-center py-10"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No tasks
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
