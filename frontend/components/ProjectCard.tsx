"use client";

import Link from "next/link";
import { Project } from "@/types";
import { deleteProject } from "@/lib/api";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  onDeleted: () => void;
}

export default function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    if (!confirm("Delete this project and all its tasks?")) return;

    setDeleting(true);
    try {
      await deleteProject(project.id);
      onDeleted();
    } catch {
      alert("Failed to delete project");
      setDeleting(false);
    }
  };

  const date = new Date(project.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/dashboard/${project.id}`} className="block group">
      <div
        className="rounded-lg p-6 h-full transition-all duration-200 group-hover:border-accent/50"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div
            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent-glow)" }}
          >
            <span className="text-accent text-xs font-mono font-medium">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 font-mono text-xs text-text-muted hover:text-danger transition-all duration-200 disabled:opacity-40"
          >
            {deleting ? (
              <span className="font-mono text-xs">...</span>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            )}
          </button>
        </div>

        {/* Name */}
        <h3 className="font-sans font-semibold text-text-primary mb-2 line-clamp-1">
          {project.name}
        </h3>

        {/* Description */}
        {project.description && (
          <p className="font-mono text-xs text-text-secondary line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto">
          <span className="font-mono text-xs text-text-muted">{date}</span>
        </div>
      </div>
    </Link>
  );
}
