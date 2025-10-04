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
  const total = notes.reduce(
    (sum, n) => sum + (typeof n.amount === "number" ? n.amount : Number(n.amount) || 0),
    0
  );

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
      <div className="mb-6 rounded-lg border border-white/10 bg-gray-900/70 px-4 py-3">
        <h2 className="text-xl font-semibold tracking-tight">Ledger</h2>
        <div className="mt-2 grid grid-cols-2 text-sm text-gray-400">
          <span>Amount</span>
          <span>Description</span>
        </div>
      </div>
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
        <div className="glass card p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-gray-300">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 w-16">S.No</th>
                <th className="px-4 py-3 w-40">Amount</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 w-48 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, idx) => (
                <tr key={note._id} className="border-b border-white/10">
                  <td className="px-4 py-4 align-top text-gray-400">{idx + 1}</td>
                  <td className="px-4 py-4 align-top text-indigo-300 font-semibold">
                    ₹ {Number(note.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-white font-medium break-words">{note.title}</div>
                    <div className="text-gray-300 whitespace-pre-wrap break-words">{note.description}</div>
                    <div className="text-xs text-gray-500 mt-2">{new Date(note.updatedAt).toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(note)} className="btn btn-muted">Edit</button>
                      <button onClick={() => handleDelete(note._id)} className="btn btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-4 py-4 font-semibold text-white" colSpan="2">Total</td>
                <td className="px-4 py-4 font-bold text-indigo-200">₹ {total.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
