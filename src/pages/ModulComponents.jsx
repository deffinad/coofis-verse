import { Box, Button, Drawer, Typography, TextField, MenuItem } from "@mui/material";
import { Components } from "remoteApp/Components";
import React, { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "inputProps";

const ModulComponents = () => {
  const [value, setValue] = useState(""); // State utama untuk input
  const [inputProps, setInputProps] = useState(null);
  const [editedProps, setEditedProps] = useState(null);

  // Load data dari Local Storage saat komponen pertama kali dirender
  useEffect(() => {
    const storedProps = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedProps) {
      const parsedProps = JSON.parse(storedProps);
      setInputProps(parsedProps);
      setEditedProps(parsedProps);
      setValue(parsedProps.value || "");
    }
  }, []);

  // Fungsi untuk menangkap props saat input diklik
  const handleInspect = (props) => {
    setInputProps(props);
    setEditedProps(props); // Duplikasi props untuk diedit sebelum disimpan
  };

  // Fungsi untuk mengubah nilai di form properties
  const handleChangeProps = (key, newValue) => {
    setEditedProps((prevProps) => ({
      ...prevProps,
      [key]: newValue,
    }));
  };

  // Fungsi untuk menyimpan perubahan props ke state dan local storage
  const handleSaveProps = () => {
    setInputProps(editedProps); // Simpan perubahan
    setValue(editedProps.value);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editedProps)); // Simpan ke Local Storage
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Drawer Kiri */}
      <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
        <Box sx={{ width: 240, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Daftar Komponen
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => console.log("Tambah Ratings")}
          >
            Ratings
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => console.log("Tambah Navbar")}
          >
            Navbar
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 5 }}>
        <Components.Input
          id={inputProps?.id || "rating"}
          name={inputProps?.name || "rating"}
          label={inputProps?.label || "Rating"}
          value={value}
          type={inputProps?.type || "text"}
          onChange={(e) => {
            const newValue = inputProps?.type === "number" ? Number(e.target.value) : e.target.value;
            setValue(newValue);
          }}
          onClick={() =>
            handleInspect({
              id: inputProps?.id || "",
              name: inputProps?.name || "",
              label: inputProps?.label || "",
              value: value,
              type: inputProps?.type || "text",
            })
          }
          sx={{ width:"100%" }}
          disabled
        />
      </Box>

      {/* Drawer Kanan (Properties Form) */}
      <Drawer variant="permanent" anchor="right" sx={{ width: 240 }}>
        <Box sx={{ width: 240, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Properties
          </Typography>
          {editedProps ? (
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {Object.keys(editedProps).map((key) => (
                key === "type" ? (
                  <TextField
                    select
                    key={key}
                    label={key}
                    value={editedProps[key]}
                    onChange={(e) => handleChangeProps(key, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="text">text</MenuItem>
                    <MenuItem value="number">number</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    key={key}
                    label={key}
                    value={editedProps[key]}
                    onChange={(e) => handleChangeProps(key, e.target.value)}
                    size="small"
                  />
                )
              ))}
              <Button variant="contained" color="primary" fullWidth onClick={handleSaveProps}>
                Save
              </Button>
            </Box>
          ) : (
            <Typography variant="body2">Klik input untuk melihat props</Typography>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default ModulComponents;
