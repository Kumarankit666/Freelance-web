import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/projects/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProjects(projects.filter((p) => p.id !== id));
      else alert("Failed to delete project");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>📊 Client Dashboard</h2>
        <button
          onClick={() => navigate("/post-project")}
          style={{ backgroundColor: "#007bff", color: "white", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
        >
          ➕ Create Project
        </button>
      </div>

      <h3>🗂️ My Projects</h3>
      {projects.length === 0 ? (
        <p>You haven't posted any project yet.</p>
      ) : (
        projects.map((project, i) => (
          <div key={i} style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #dee2e6", marginBottom: "10px" }}>
            <h4>{project.title}</h4>
            <p>💰 Budget: {project.budget}</p>
            <p>🧠 Skills: {project.skills}</p>
            <p>📅 Duration: {project.duration}</p>

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => navigate(`/project/${project.id}`)} style={{ background: "#007bff", color: "white", padding: "6px 12px", borderRadius: "8px", border: "none", marginRight: "10px", cursor: "pointer" }}>
                View Applications
              </button>
              <button onClick={() => navigate(`/edit-project/${project.id}`)} style={{ background: "#ffc107", color: "black", padding: "6px 12px", borderRadius: "8px", border: "none", marginRight: "10px", cursor: "pointer" }}>
                Edit Project
              </button>
              <button onClick={() => handleDeleteProject(project.id)} style={{ background: "red", color: "white", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Delete Project
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ClientDashboard;
