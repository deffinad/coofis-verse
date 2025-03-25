export const DocsArsipCuti = [
    {
        "id": 1,
        "type": 'tableHeader',
        "children": [
            {
                'id': 1.1,
                'parent_id': 1,
                'title': 'Jenis Cuti',
                'field': 'jenisCuti'
            },
            {
                'id': 1.2,
                'parent_id': 1,
                'title': 'Tipe Dokumen',
                'field': 'tipeDokumen'
            },
            {
                'id': 1.3,
                'parent_id': 1,
                'title': 'Mulai',
                'field': 'mulai'
            },
            {
                'id': 1.4,
                'parent_id': 1,
                'title': 'Selesai',
                'field': 'selesai'
            },
            {
                'id': 1.5,
                'parent_id': 1,
                'title': 'Durasi',
                'field': 'durasi'
            },
            {
                'id': 1.6,
                'parent_id': 1,
                'title': 'Status',
                'field': 'status'
            },
            {
                'id': 1.7,
                'parent_id': 1,
                'title': 'Tindakan',
                'field': 'tindakan'
            }
        ]
    },
    {
        "id": 2,
        "type": 'tableCell',
        "pagination": 1,
        "children": [
            {
                'id': 2.1,
                'parent_id': 2,
                'jenisCuti': 'Cuti Tahunan',
                'tipeDokumen': 'Pengajuan Cuti',
                'mulai': '14-01-2025',
                'selesai': '04-10-2024',
                'durasi': '7 hari',
                'status': 'Selesai',
                'tindakan' : '1'
            },
            {
                'id': 2.1,
                'parent_id': 2,
                'jenisCuti': 'Cuti Tahunan',
                'tipeDokumen': 'Pembatalan Cuti',
                'mulai': '14-01-2025',
                'selesai': '04-10-2024',
                'durasi': '7 hari',
                'status': 'Selesai',
                'tindakan' : '2',
                'dialogTeks' : 'Apakah Anda yakin untuk menghapus dokumen ini?'
            },
            {
                'id': 2.1,
                'parent_id': 2,
                'jenisCuti': 'Cuti Tahunan',
                'tipeDokumen': 'Pengajuan Cuti',
                'mulai': '14-01-2025',
                'selesai': '04-10-2024',
                'durasi': '7 hari',
                'status': 'Selesai',
                'tindakan' : '4'
            }
        ]
    },
]