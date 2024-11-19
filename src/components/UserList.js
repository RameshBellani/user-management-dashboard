import React, { useState, useEffect } from "react";
import api from "../services/api";
import UserForm from "./UserForm";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users?_page=${page}&_limit=5`);
      setUsers((prev) => [
        ...prev,
        ...response.data.filter(
          (newUser) => !prev.some((user) => user.id === newUser.id)
        ), // Ensure no duplicate users
      ]);
      if (response.data.length === 0) setHasMore(false); // No more data to fetch
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Add new user
  const addUser = (newUser) => {
    const uniqueId = newUser.id || Date.now(); // Fallback to a unique ID
    setUsers((prev) => [{ ...newUser, id: uniqueId }, ...prev]);
  };

  // Update an existing user
  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch {
      setError("Failed to delete user.");
    }
  };

  // Load more users
  const loadMore = () => setPage((prev) => prev + 1);

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      <button onClick={() => setIsEditing(true)}>Add User</button>
      {isEditing && (
        <UserForm
          user={currentUser}
          onClose={() => setIsEditing(false)}
          onUserAdded={(user) =>
            currentUser ? updateUser(user) : addUser(user)
          }
        />
      )}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
          <div className="user-info">
            <h3>
              {user.name} - {user.email}
            </h3>
            {user.department && <p className="department">{user.department}</p>}
          </div>
          <button
            onClick={() => {
              setCurrentUser(user);
              setIsEditing(true);
            }}
          >
            Edit
          </button>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </li>
        
        ))}
      </ul>
      {hasMore && (
        <button onClick={loadMore} className="load-more">
          Load More
        </button>
      )}
    </div>
  );
};

export default UserList;
