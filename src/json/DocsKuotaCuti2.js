export const KuotaCuti2 = [
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
                'title': 'Kuota',
                'field': 'kuota'
            },
            {
                'id': 1.3,
                'parent_id': 1,
                'title': 'Mulai Dipakai',
                'field': 'mulaiDipakai'
            },
            {
                'id': 1.4,
                'parent_id': 1,
                'title': 'Akhir Dipakai',
                'field': 'akhirDipakai'
            },
            {
                'id': 1.5,
                'parent_id': 1,
                'title': 'Akan Aktif Mulai',
                'field': 'akanAktifMulai'
            }
        ]
    },
    {
        "id": 2,
        "type": 'tableCell',
        "children": [
            {
                'id': 2.1,
                'parent_id': 2,
                'jenisCuti': 'Cuti Tahunan',
                'kuota': 90 ,
                'mulaiDipakai': '-',
                'akhirDipakai': '-',
                'akanAktifMulai': '-' 
            },
        ]
    },
]