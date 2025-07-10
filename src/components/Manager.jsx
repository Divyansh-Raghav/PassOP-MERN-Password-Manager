import React, { useEffect, useState } from "react";
import { FaRegCopy, FaEye, FaEyeSlash, FaPlus, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordArray, setPasswordArray] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const backendUrl = "http://localhost:3002";

  useEffect(() => {
    fetch(`${backendUrl}/`)
      .then((res) => res.json())
      .then((data) => setPasswordArray(data));
  }, []);
  
  const fetchData = async () => {
  const res = await fetch(`${backendUrl}/`);
  const data = await res.json();
  setPasswordArray(data);
};


  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  const savePassword = async () => {
    await fetchData(); // inside your savePassword

  if (!website || !username || !password) return toast.error("Please fill all fields");

  if (editId) {
    const res = await fetch(`${backendUrl}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: website, username, password }),
    });
    const result = await res.json();

    if (result.modifiedCount === 1) {
      const updated = passwordArray.map((entry) =>
        entry._id === editId ? { ...entry, site: website, username, password } : entry
      );
      setPasswordArray(updated);
      toast.success("Password updated!");
    } else {
      toast.error("Update failed!");
    }
  } else {
    const res = await fetch(`${backendUrl}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: website, username, password }),
    });
    const result = await res.json();
    if (result.insertedId) {
      const newEntry = { _id: result.insertedId, site: website, username, password };
      setPasswordArray([...passwordArray, newEntry]);
      toast.success("Password added!");
    }
  }

  setWebsite("");
  setUsername("");
  setPassword("");
  setEditId(null);
};


  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    await fetch(`${backendUrl}/${deleteId}`, { method: "DELETE" });
    setPasswordArray(passwordArray.filter((item) => item._id !== deleteId));
    setDeleteId(null);
    setShowConfirmModal(false);
    toast.success("Password deleted!");
  };

  const handleEdit = (entry) => {
    setWebsite(entry.site);
    setUsername(entry.username);
    setPassword(entry.password);
    setEditId(entry._id);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto mt-10 px-6 py-8 bg-slate-50 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-green-700">&lt;</span>Pass
          <span className="text-green-700 font-bold">OP /&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center mb-6">Your Own Password Manager</p>

        <div className="flex flex-col space-y-4">
          <input className="px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-400" type="text" placeholder="Enter Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} />
          <div className="flex flex-col md:flex-row gap-4">
            <input className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400" type="text" placeholder="Username or Email" value={username} onChange={(e) => setUsername(e.target.value)} />
            <div className="relative flex-1">
              <input className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-gray-600 hover:text-green-500">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <button onClick={savePassword} className="mt-2 flex items-center justify-center gap-2 self-start bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-all">
            {editId ? <><FaEdit /> Update</> : <><FaPlus /> Add Password</>}
          </button>
        </div>

        <div className="mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md bg-green-50">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Saved Passwords</h2>
          <div className="overflow-x-auto">
            <table className="table w-full text-left border-collapse">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-4 py-3">Website</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Password</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passwordArray.map((entry) => (
                  <tr key={entry._id} className="border-t border-gray-200">
                    <td className="px-4 py-3 break-words">
                      <div className="flex items-center gap-2">
                        <a href={entry.site} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline max-w-[200px]">{entry.site}</a>
                        <button onClick={() => copyToClipboard(entry.site)} className="text-green-600 hover:text-green-800"><FaRegCopy /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3 break-words">
                      <div className="flex items-center gap-2">
                        {entry.username}
                        <button onClick={() => copyToClipboard(entry.username)} className="text-green-600 hover:text-green-800"><FaRegCopy /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3 break-words">
                      <div className="flex items-center gap-2">
                        {entry.password}
                        <button onClick={() => copyToClipboard(entry.password)} className="text-green-600 hover:text-green-800"><FaRegCopy /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <button onClick={() => handleEdit(entry)} className="text-blue-600 hover:text-blue-800"><FaEdit size={20} /></button>
                      <button onClick={() => confirmDelete(entry._id)} className="text-red-600 hover:text-red-800"><MdDelete size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-6">Are you sure you want to delete this password?</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Manager;
