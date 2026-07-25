import React from "react";
import { useState, useEffect } from "react";

const TaskModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus("PENDING");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    } else if (title.trim().length > 100) {
      newErrors.title = "Title must be under 100 characters.";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required.";
    } else if (description.trim().length > 500) {
      newErrors.description = "Description must be under 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    try {
      await onSave({ title: title.trim(), description: description.trim(), status });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-black mb-4">
          {isEditMode ? "Edit Task" : "Add Task"}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#9a9da8] uppercase tracking-wide mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm text-black focus:outline-none transition-colors ${
                errors.title
                  ? "border-red-400 focus:border-red-400"
                  : "border-[#2c2f3a] focus:border-[#5b8def]"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#9a9da8] uppercase tracking-wide mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md text-sm text-black focus:outline-none resize-none transition-colors ${
                errors.description
                  ? "border-red-400 focus:border-red-400"
                  : "border-[#2c2f3a] focus:border-[#5b8def]"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-[#9a9da8] uppercase tracking-wide mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-[#2c2f3a] rounded-md text-sm text-black focus:outline-none focus:border-[#5b8def]"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md border border-[#2c2f3a] text-black hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium rounded-md bg-[#5b8def] text-white hover:bg-[#4a7cdb] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving…" : isEditMode ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;