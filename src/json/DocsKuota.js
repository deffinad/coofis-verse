export const DataKuota = [
    {
        'id': 1,
        'title':'Cuti Tahunan 2023',
        'count' : 2,
        'color' : '#9E9E9E',
        'children' : [
            {
            'id' : 1.1,
            'parent_id' : 1,
            'title' : 'Kuota',
            'count' : 6
            },
            {
            'id' : 1.2,
            'parent_id' : 1,
            'title' : 'Penggunaan',
            'count' : 2
            },
            {
            'id' : 1.3,
            'parent_id' : 1,
            'title' : 'Sisa',
            'count' : 4
            }
        ]
    },
    {
        'id': 2,
        'title':'Cuti Tahunan 2024',
        'count' : 3,
        'color' : '#616161',
        'children' : [
            {
            'id' : 2.1,
            'parent_id' : 2,
            'title' : 'Kuota',
            'count' : 6
            },
            {
            'id' : 2.2,
            'parent_id' : 2,
            'title' : 'Penggunaan',
            'count' : 2
            },
            {
            'id' : 2.3,
            'parent_id' : 2,
            'title' : 'Sisa',
            'count' : 4
            }
        ]
    },
    {
        'id': 3,
        'title':'Cuti Tahunan 2025',
        'count' : 1,
        'color' : '#EA001E',
        'children' : [
            {
            'id' : 3.1,
            'parent_id' : 3,
            'title' : 'Kuota',
            'count' : 6
            },
            {
            'id' : 3.2,
            'parent_id' : 3,
            'title' : 'Penggunaan',
            'count' : 2
            },
            {
            'id' : 3.3,
            'parent_id' : 3,
            'title' : 'Sisa',
            'count' : 4
            }
        ]
    }
]