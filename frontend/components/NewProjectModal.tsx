"use client";

import { useState } from "react";
import { createProject } from "@/lib/api";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface NewProjectModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function NewProjectModal({
  onClose,
  onCreated,
}: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    try {
      await createProject(name.trim(), description.trim());
      onCreated(); // Tell the parent to refresh the project list
      onClose(); // Close the modal
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop — clicking outside closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* Modal card — stop clicks from bubbling to the backdrop */}
      <div
        className="w-full max-w-md rounded-lg p-8 animate-slide-up"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-bright)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans font-bold text-lg text-text-primary tracking-tight">
            New Project
          </h2>
          <button
            onClick={onClose}
            className="font-mono text-text-muted hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <Input
            label="Project Name"
            value={name}
            onChange={setName}
            placeholder="e.g. Portfolio Website"
            error={error}
          />
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full bg-bg-secondary text-text-primary border border-border-dim rounded px-4 py-3 font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
