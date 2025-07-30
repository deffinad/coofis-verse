import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

/**
 * Komponen Card yang dapat digunakan kembali dengan gaya bento.
 * Memiliki elevasi halus dan responsif.
 * @param {object} props - Properti komponen.
 * @param {string} props.title - Judul kartu.
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan di dalam kartu.
 * @param {object} [props.sx] - Properti style kustom untuk Box utama.
 */
const BentoCard = ({ title, children, sx }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 2,   
        ...sx            
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {title && (
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default BentoCard;
