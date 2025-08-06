import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import BentoCard from "../../shared/components/BentoCard";
import { fetchDashboardData } from "../../redux/actions/dashboardActions";

// --- KOMPONEN UTAMA DASHBOARD ---
const DashboardPage = () => {
  const dispatch = useDispatch();
  const { loading, cards, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Mengambil data saat komponen pertama kali di-render
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Menampilkan indikator loading saat data diambil
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Menampilkan pesan error jika terjadi kegagalan
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Gagal memuat data dashboard: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Render kartu secara dinamis dari Redux state, menghilangkan duplikasi */}
        {cards.map((card) => (
          <Grid item key={card.id} xs={card.gridSize.xs} sm={card.gridSize.sm} md={card.gridSize.md}>
            <BentoCard title={card.title}>
              <Typography variant="body2" color="text.secondary">{card.content}</Typography>
            </BentoCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
