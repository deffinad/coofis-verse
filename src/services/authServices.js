import axios from "axios";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");

  return token && token.length === 50;
};

export const getUserByUsername = async (username) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found. Please login first.");

    const response = await axios.get(
      `http://localhost:3000/api/auth/user/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch user data");
  }
};
