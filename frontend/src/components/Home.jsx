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
  const totalCredits = notes
    .filter(n => n.type === 'credit')
    .reduce((sum, n) => sum + (typeof n.amount === "number" ? n.amount : Number(n.amount) || 0), 0);
  
  const totalDebits = notes
    .filter(n => n.type === 'debit')
    .reduce((sum, n) => sum + (typeof n.amount === "number" ? n.amount : Number(n.amount) || 0), 0);
  
  const grandTotal = totalCredits - totalDebits;

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
      <div className="mb-4 rounded-lg border border-white/10 bg-gray-900/70 px-4 py-3">
        <h2 className="text-xl font-semibold tracking-tight">Financial Ledger</h2>
      </div>

      {/* Summary section */}
      <div className="mb-6 bg-gray-900/80 border border-white/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="p-4">
            <div className="text-sm text-gray-400">Total Credited</div>
            <div className="mt-1 text-lg font-semibold text-green-400">₹ {totalCredits.toFixed(2)}</div>
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-400">Total Debited</div>
            <div className="mt-1 text-lg font-semibold text-red-400">₹ {totalDebits.toFixed(2)}</div>
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-400">Balance</div>
            <div className="mt-1 text-lg font-bold text-white">₹ {grandTotal.toFixed(2)}</div>
          </div>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <colgroup>
                <col />
                <col style={{ width: '8rem' }} />
                <col style={{ width: '8rem' }} />
                <col style={{ width: '10rem' }} />
              </colgroup>
              <thead className="bg-black/40 text-gray-300">
                <tr className="border-b border-white/10">
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2 text-right pr-6">Credit</th>
                  <th className="px-3 py-2 text-right pl-6 border-l border-white/10">Debit</th>
                  <th className="px-3 py-2 text-right pl-6 border-l border-white/10">Actions</th>
                </tr>
              </thead>
              <tbody>
              {notes.map((note, idx) => (
                <tr key={note._id} className="border-b border-white/10">
                  <td className="px-3 py-3 align-top">
                    <div className="text-white font-medium break-words">{note.title}</div>
                    <div className="text-gray-300 whitespace-pre-wrap break-words">{note.description}</div>
                    <div className="text-xs text-gray-500 mt-2">{new Date(note.updatedAt).toLocaleString()}</div>
                  </td>
                  <td className="px-3 py-3 align-top text-right pr-6">
                    {note.type === 'credit' ? (
                      <span className="text-green-400 font-semibold">
                        ₹ {Number(note.amount || 0).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top text-right pl-6 border-l border-white/10">
                    {note.type === 'debit' ? (
                      <span className="text-red-400 font-semibold">
                        ₹ {Number(note.amount || 0).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top pl-6 border-l border-white/10">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(note)} className="btn btn-muted">Edit</button>
                      <button onClick={() => handleDelete(note._id)} className="btn btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
              <tfoot>
                <tr className="bg-black/20">
                  <td className="px-3 py-3 font-semibold text-white">Total</td>
                  <td className="px-3 py-3 font-bold text-green-400 text-right pr-6">₹ {totalCredits.toFixed(2)}</td>
                  <td className="px-3 py-3 font-bold text-red-400 text-right pl-6 border-l border-white/10">₹ {totalDebits.toFixed(2)}</td>
                  <td className="px-3 py-3"></td>
                </tr>
                <tr className="bg-black/30">
                  <td className="px-3 py-3 font-bold text-white">Balance</td>
                  <td className="px-3 py-3 font-bold text-indigo-200 text-right" colSpan="2">₹ {grandTotal.toFixed(2)}</td>
                  <td className="px-3 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
