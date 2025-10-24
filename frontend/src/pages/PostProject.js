import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, refreshAccessToken } from "./auth"; // ✅ token utils import
import "./ClientDashboard.css";

function PostProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    skills_required: "", // ✅ match backend field
    duration: "",         // ✅ match backend field
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = getToken();

    try {
      let res = await fetch("http://127.0.0.1:8000/api/projects/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // ✅ If token expired, try refreshing once
      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch("http://127.0.0.1:8000/api/projects/create/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            body: JSON.stringify(formData),
          });
        } else {
          throw new Error("Token expired, please login again");
        }
      }

      // ✅ If still not ok, log full response
      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Server Response:", text);
        alert("❌ Something went wrong!");
        return;
      }

      alert("✅ Project posted successfully!");
      navigate("/client-dashboard");
    } catch (err) {
      console.error("❌ PostProject Error:", err);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="nav-item" onClick={() => navigate("/client-dashboard")}>
          🏠 Dashboard
        </div>
        <div className="nav-item" onClick={() => navigate("/my-projects")}>
          📁 My Projects
        </div>
        <div className="nav-item" onClick={() => navigate("/post-project")}>
          ➕ Post Project
        </div>
      </div>

      <div className="main">
        <h2>Create Your Project</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            name="title"
            placeholder="Project Title"
            onChange={handleChange}
            required
          />
          <input
            name="budget"
            placeholder="Budget (₹)"
            type="number"
            onChange={handleChange}
            required
          />
          <input
            name="skills_required"
            placeholder="Required Skills"
            onChange={handleChange}
            required
          />
          <input
            name="duration"
            placeholder="Duration (e.g. 1 month)"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn">
            🚀 Post Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostProject;
