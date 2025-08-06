import * as actionTypes from '../../shared/constants/ActionTypes';

// Data mock ini akan menggantikan konten statis di komponen Dashboard Anda.
// Perhatikan properti `gridSize` yang akan membuat layout Anda lebih dinamis.
const mockDashboardData = [
  { id: 'proj-summary', title: 'Ringkasan Proyek', content: 'Ini adalah ringkasan status proyek Anda saat ini. Konten di sini bisa berupa grafik, daftar tugas, dll.', gridSize: { xs: 12, sm: 6, md: 8 } },
  { id: 'notif-1', title: 'Notifikasi Terbaru', content: 'Anda memiliki 3 notifikasi baru.', gridSize: { xs: 12, sm: 6, md: 4 } },
  { id: 'user-stats', title: 'Statistik Pengguna', content: 'Data statistik pengguna aktif dan kunjungan.', gridSize: { xs: 12, sm: 12, md: 6 } },
  { id: 'task-list', title: 'Daftar Tugas', content: 'Tugas yang perlu diselesaikan hari ini.', gridSize: { xs: 12, sm: 12, md: 6 } },
  { id: 'activity-feed', title: 'Aktivitas Tim', content: 'Farel baru saja menyelesaikan tugas "Desain UI".', gridSize: { xs: 12, sm: 6, md: 4 } },
  { id: 'system-update', title: 'Pembaruan Sistem', content: 'Sistem akan di-maintenance pada pukul 23:00.', gridSize: { xs: 12, sm: 6, md: 4 } },
  { id: 'weekly-report', title: 'Laporan Mingguan', content: 'Laporan mingguan Anda sudah siap untuk dilihat.', gridSize: { xs: 12, sm: 6, md: 4 } },
];

export const fetchDashboardData = () => async (dispatch) => {
  dispatch({ type: actionTypes.FETCH_DASHBOARD_DATA_START });
  try {
    // Di aplikasi nyata, di sini Anda akan melakukan panggilan API.
    // Kita simulasikan dengan timeout untuk meniru proses asynchronous.
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch({
      type: actionTypes.FETCH_DASHBOARD_DATA_SUCCESS,
      payload: mockDashboardData,
    });
  } catch (error) {
    dispatch({ type: actionTypes.FETCH_DASHBOARD_DATA_FAILURE, payload: error.message });
  }
};

