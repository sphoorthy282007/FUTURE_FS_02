import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import * as XLSX from "xlsx";

function Leads() {
  const [leads, setLeads] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("New");

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

const leadsPerPage = 5;

  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/leads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeads(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addLead = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/leads",
        {
          name,
          email,
          phone,
          source,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Lead Added Successfully");

      clearForm();
      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const updateLead = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/leads/${editId}`,
        {
          name,
          email,
          phone,
          source,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Lead Updated Successfully");

      setEditId(null);
      clearForm();
      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const editLead = (lead) => {
    setEditId(lead.id);

    setName(lead.name);
    setEmail(lead.email);
    setPhone(lead.phone);
    setSource(lead.source);
    setStatus(lead.status);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const fetchNotes = async (leadId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get(`/notes/${leadId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNotes(res.data);
    setSelectedLead(leadId);
  } catch (error) {
    console.log(error);
  }
};

const addNote = async () => {
  if (!noteText.trim()) return;

  try {
    const token = localStorage.getItem("token");

    await API.post(
      "/notes",
      {
        lead_id: selectedLead,
        note_text: noteText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNoteText("");
    fetchNotes(selectedLead);
  } catch (error) {
    console.log(error);
  }
};

const deleteNote = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await API.delete(`/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchNotes(selectedLead);
  } catch (error) {
    console.log(error);
  }
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(leads);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Leads"
  );

  XLSX.writeFile(
    workbook,
    "CRM_Leads.xlsx"
  );
};

  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSource("");
    setStatus("New");
  };
const filteredLeads = leads.filter((lead) => {
  const matchesSearch =
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase()) ||
    lead.source.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    filterStatus === "All" ||
    lead.status === filterStatus;

  return matchesSearch && matchesStatus;
});

const indexOfLastLead = currentPage * leadsPerPage;
const indexOfFirstLead = indexOfLastLead - leadsPerPage;

const currentLeads = filteredLeads.slice(
  indexOfFirstLead,
  indexOfLastLead
);

const totalPages = Math.ceil(
  filteredLeads.length / leadsPerPage
);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(135deg,#0f172a,#1e3a8a,#312e81)",
        color: "white",
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: "center",
          fontSize: "50px",
          fontWeight: "700",
          letterSpacing: "1px",
          marginBottom: "40px",
          textShadow: "0px 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        Lead Management
      </motion.h1>

      {/* Edit Mode */}
      {editId && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#fbbf24",
            fontWeight: "bold",
            fontSize: "22px",
          }}
        >
          ✏️ Editing Lead ID: {editId}
        </div>
      )}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "50px",
          padding: "25px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        }}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={inputStyle}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
        </select>

        {editId ? (
          <button
            onClick={updateLead}
            style={{
              ...buttonStyle,
              background: "#f59e0b",
            }}
          >
            Update Lead
          </button>
        ) : (
          <button
            onClick={addLead}
            style={{
              ...buttonStyle,
              background: "#22c55e",
            }}
          >
            Add Lead
          </button>
        )}
      </motion.div>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px",
  }}
>
  <input
    type="text"
    placeholder="🔍 Search Leads..."
    value={search}
   onChange={(e) => {
  setFilterStatus(e.target.value);
  setCurrentPage(1);
}}
    style={{
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      width: "250px",
    }}
  />

  <select
    value={filterStatus}
    onChange={(e) => {
  setFilterStatus(e.target.value);
  setCurrentPage(1);
}}
    style={{
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      width: "180px",
    }}
  >
    <option value="All">All Status</option>
    <option value="New">New</option>
    <option value="Contacted">Contacted</option>
    <option value="Converted">Converted</option>
  </select>
  <button
  onClick={exportToExcel}
  style={{
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Export Excel
</button>
</div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          width="100%"
          cellPadding="20"
          style={{
            borderCollapse: "collapse",
            textAlign: "center",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {currentLeads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.id}</td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>{lead.source}</td>

                <td>
                  <span
                    style={{
                      padding: "10px 18px",
                      borderRadius: "999px",
                      fontWeight: "bold",
                      background:
                        lead.status === "Converted"
                          ? "#22c55e"
                          : lead.status === "Contacted"
                          ? "#f59e0b"
                          : "#3b82f6",
                    }}
                  >
                    {lead.status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => editLead(lead)}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Edit
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        `Are you sure you want to delete ${lead.name}?`
                      );

                      if (confirmDelete) {
                        deleteLead(lead.id);
                      }
                    }}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </button>
                </td>
                 <td>
  <button
    onClick={() => fetchNotes(lead.id)}
    style={{
      background: "#8b5cf6",
      color: "white",
      border: "none",
      padding: "10px 16px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Notes
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
  style={{
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  }}
>
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    style={{
      padding: "10px 15px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    }}
  >
    Previous
  </button>

  <span
    style={{
      padding: "10px",
      fontWeight: "bold",
    }}
  >
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
    style={{
      padding: "10px 15px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    }}
  >
    Next
  </button>
</div>
      
      {selectedLead && (
  <div
    style={{
      marginTop: "40px",
      padding: "25px",
      borderRadius: "20px",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
    }}
  >
    <h2>📝 Notes For Lead ID: {selectedLead}</h2>

    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Write note..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "10px",
          border: "none",
        }}
      />

      <button
        onClick={addNote}
        style={{
          background: "#22c55e",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Add Note
      </button>
    </div>

    {notes.length === 0 ? (
      <p>No Notes Found</p>
    ) : (
      notes.map((note) => (
        <div
          key={note.id}
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        >
          <p>{note.note_text}</p>

          <button
            onClick={() => deleteNote(note.id)}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Delete Note
          </button>
        </div>
      ))
    )}
  </div>
)}
    </div>
  );
}

const inputStyle = {
  width: "220px",
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.15)",
  outline: "none",
  background: "rgba(255,255,255,0.10)",
  color: "white",
  fontSize: "16px",
  backdropFilter: "blur(10px)",
};

const buttonStyle = {
  color: "white",
  border: "none",
  padding: "15px 25px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};

export default Leads;
