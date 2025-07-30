// FileName: /Dashboard.jsx (Setelah membuat BentoCard.jsx)
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import BentoCard from "../../shared/components/BentoCard";

// --- KOMPONEN UTAMA DASHBOARD ---
const DashboardPage = () => {
  return (
    <Box sx={{ p: 3, flexGrow: 1}}>
      <Grid container spacing={3}>
        {/* Menggunakan komponen BentoCard yang dapat digunakan kembali */}
        <Grid item xs={13} sm={6} md={8}>
          <BentoCard title="Ringkasan Proyek">
            <Typography variant="body2" color="text.secondary">
              Ini adalah ringkasan status proyek Anda saat ini. Konten di sini
              bisa berupa grafik, daftar tugas, dll.
            </Typography>
          </BentoCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <BentoCard title="Notifikasi Terbaru">
            <Typography variant="body2" color="text.secondary">
              Anda memiliki 3 notifikasi baru.
            </Typography>
          </BentoCard>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <BentoCard title="Statistik Pengguna">
            <Typography variant="body2" color="text.secondary">
              Data statistik pengguna aktif dan kunjungan.
            </Typography>
          </BentoCard>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <BentoCard title="Daftar Tugas">
            <Typography variant="body2" color="text.secondary">
              Tugas yang perlu diselesaikan hari ini.
            </Typography>
          </BentoCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <BentoCard title="Notifikasi Terbaru">
            <Typography variant="body2" color="text.secondary">
              Anda memiliki 3 notifikasi baru.
            </Typography>
          </BentoCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <BentoCard title="Notifikasi Terbaru">
            <Typography variant="body2" color="text.secondary">
              Anda memiliki 3 notifikasi baru.
            </Typography>
          </BentoCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <BentoCard title="Notifikasi Terbaru">
            <Typography variant="body2" color="text.secondary">
              Anda memiliki 3 notifikasi baru.
            </Typography>
          </BentoCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <BentoCard title="Notifikasi Terbaru">
            <Typography variant="body2" color="text.secondary">
              Anda memiliki 3 notifikasi baru.
            </Typography>
          </BentoCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
