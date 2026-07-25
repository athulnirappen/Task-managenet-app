import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import TaskModal from "../components/taskmodel";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api/task";

const LIMIT = 5;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  
  const fetchTasks = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    
    const params = { page, limit: LIMIT };
    if (search.trim()) params.search = search.trim();
    if (statusFilter) params.status = statusFilter;

    const result = await getTasks(params);
    setTasks(result.data || []);
    setTotalPages(result.pagination?.totalPages || 1);
  } catch (err) {
    setError(err.response?.data?.msg || "Could not load tasks.");
  } finally {
    setLoading(false);
  }
}, [page, search, statusFilter]);

 
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTasks();
    }, 350);

    return () => clearTimeout(timeout);
  }, [fetchTasks]);

  const handleAddClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      handleCloseModal();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.msg || "Could not save task.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.msg || "Could not delete task.");
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-black">
              Your Tasks
            </h1>

            <button
              onClick={handleAddClick}
              className="px-4 py-2 text-sm font-medium rounded-md bg-[#5b8def] text-white hover:bg-[#4a7cdb] transition-colors"
            >
              + Add Task
            </button>
          </div>

          <div className="flex gap-3 mb-5">
            <input
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-[#2c2f3a] rounded-md text-sm text-black focus:outline-none focus:border-[#5b8def]"
            />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-[#2c2f3a] rounded-md text-sm text-black focus:outline-none focus:border-[#5b8def]"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3.5 py-2.5 rounded-md mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-12 text-sm text-[#9a9da8]">
              Loading…
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="text-center py-12 text-sm text-[#9a9da8] border border-dashed border-[#2c2f3a] rounded-lg">
              No tasks match your search or filter.
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-white border border-[#2c2f3a] rounded-lg px-4 py-3"
                >
                  <div>
                    <h2 className="text-sm font-medium text-black">
                      {task.title}
                    </h2>
                    {task.description && (
                      <p className="text-xs text-[#9a9da8] mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#5b8def] text-[#0e0f13] hover:bg-[#4a7cdb] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md border border-[#2c2f3a] text-[#e5637a] hover:border-[#e5637a] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-black">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-md border border-[#2c2f3a] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-md border border-[#2c2f3a] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingTask}
      />
    </div>
  );
};

export default Dashboard;