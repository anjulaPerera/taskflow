"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProjects } from "@/lib/api";
import { Project } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import NewProjectModal from "@/components/NewProjectModal";
import Button from "@/components/Button";

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-12 animate-fade-in">
            <div>
              <p
                className="font-mono text-sm font-medium uppercase tracking-widest mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {greeting()},
              </p>
              <h1 className="font-sans font-bold text-4xl text-text-primary tracking-tight">
                {user?.name || "Developer"}
              </h1>
              <p
                className="font-mono text-sm font-medium mt-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {projects.length === 0
                  ? "No projects yet"
                  : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <Button onClick={() => setShowModal(true)}>+ New Project</Button>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "var(--border)",
              marginBottom: "3rem",
            }}
          />

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-lg animate-pulse"
                  style={{ background: "var(--bg-card)" }}
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-mono text-sm text-danger">{error}</p>
              <Button variant="ghost" onClick={fetchProjects} className="mt-4">
                Retry
              </Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <div
                className="w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <span className="text-2xl">□</span>
              </div>
              <h2 className="font-sans font-semibold text-text-primary mb-2">
                No projects yet
              </h2>
              <p className="font-mono text-sm text-text-muted mb-8">
                Create your first project to get started
              </p>
              <Button onClick={() => setShowModal(true)}>Create Project</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDeleted={fetchProjects}
                />
              ))}
            </div>
          )}
        </main>

        {showModal && (
          <NewProjectModal
            onClose={() => setShowModal(false)}
            onCreated={fetchProjects}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
