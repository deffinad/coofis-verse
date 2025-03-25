import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/validate",
          {
            username,
            token,
          }
        );

        if (response.data.isValid) {
          setIsValid(true);
        } else {
          alert("Token tidak valid. Silakan login ulang.");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/login");
        }
      } catch (error) {
        alert(error.response?.data?.error || "Terjadi kesalahan");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (isValid === null) {
    return <p>Loading...</p>;
  }

  return isValid ? children : null;
};

export default ProtectedRoute;
