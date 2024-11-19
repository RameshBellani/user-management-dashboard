import { useState } from "react";
import api from '../services/api'

const UserForm = ({ user, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (user) {
            // Simulate success for PUT
            console.log("Updating user:", formData);
            // Optionally mock the API response
            const updatedUser = { ...user, ...formData };
            onUserAdded(updatedUser); // Update parent state with the edited user
        } else {
            // POST new user
            const response = await api.post("/users", formData);
            const newUser = { ...formData, id: response.data.id || Date.now() }; 
            onUserAdded(newUser); 
        }
        onClose();
    } catch (error) {
        setError("Failed to submit the form.");
        console.error("Error submitting form:", error);
    }
};


  return (
      <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
          />
          <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
          />
          <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
              }
              required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
              Cancel
          </button>
      </form>
  );
};

export default UserForm;
