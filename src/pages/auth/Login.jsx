import React, { useState } from "react";
import { TextField, Button, Typography, Box, Card, CardContent, Link } from "@mui/material";
import { loginUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginUser(username, password);
      alert(response.message);
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);
      navigate("/layoutmanagerv4");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f0f2f5">
      <Card sx={{ maxWidth: 400, width: "100%", p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleLogin} fullWidth sx={{ mt: 2 }}>
            Login
          </Button>

          {/* Teks untuk Register */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Belum punya akun?{" "}
            <Link href="/register" underline="hover" color="primary">
              Register di sini
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
