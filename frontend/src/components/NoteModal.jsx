import React, { useEffect, useState } from "react";
import axios from "axios";

const NoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setError("");
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }

      const payload = { title, description };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (note) {
        const { data } = await axios.put(
          `/api/notes/${note._id}`,
          payload,
          config
        );
        onSave(data);
      } else {
        const { data } = await axios.post("/api/notes", payload, config);
        onSave(data);
      }
      setTitle("");
      setDescription("");
      setError("");
      onClose();
    } catch (err) {
      console.log("Note save error");
      setError("Failed to save error");
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md card glass p-6 sm:p-7 elevate">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {note ? "Edit Note" : "Create Note"}
        </h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="field"
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note Description"
              className="field"
              rows={5}
              required
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary">
              {note ? "Update" : "Create"}
            </button>
            <button type="button" onClick={onClose} className="btn btn-muted">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
