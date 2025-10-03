import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "./NoteModal";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";
      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredNotes = search
        ? data.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.description.toLowerCase().includes(search.toLowerCase())
          )
        : data;
      setNotes(filteredNotes);
      console.log(data);
    } catch (err) {
      setError("Failed to fetch notes");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);
  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(
        notes.map((note) => (note._id === newNote._id ? newNote : note))
      );
    } else {
      setNotes([...notes, newNote]);
    }

    setEditNote(null);
    setIsModalOpen(false);
  };
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen pb-28">
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />
      <button onClick={() => setIsModalOpen(true)} className="fab elevate text-2xl">
        <span className="relative z-10 pb-1">+</span>
      </button>
      {notes.length === 0 ? (
        <div className="mt-20 text-center text-gray-300">
          <div className="mx-auto w-full max-w-lg glass card p-8 elevate">
            <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
            <p className="text-gray-400">Create your first note to get started.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary mt-6">
              New note
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <div className="card glass p-5 elevate break-words" key={note._id}>
              <h3 className="text-lg font-semibold text-white mb-2">{note.title}</h3>
              <p className="text-gray-300 mb-4 whitespace-pre-wrap break-words">{note.description}</p>
              <p className="text-xs text-gray-400 mb-4">
                {new Date(note.updatedAt).toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleEdit(note)} className="btn btn-muted">
                  Edit
                </button>
                <button onClick={() => handleDelete(note._id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
