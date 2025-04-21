export const dataComponents = [
    {
        id: 'Pages',
        label: 'Template Pages',
        children: [
            {
                id: 'Page',
                label: 'Page 1'
            },
            {
                id: 'page2',
                label: 'Page 2'
            },
        ]
    },
    {
        id: 'widget',
        label: 'Widget',
        children: [
            {
                id: 'ratings',
                label: 'Ratings',
                draggable: true,
                componentName: 'Ratings'
            },
            {
                id: 'navbar',
                label: 'Navbar',
                draggable: true,
                componentName: 'Navbar'
            },
            {
                id: 'arsip-cuti',
                label: 'ArsipCuti',
                draggable: true,
                componentName: 'ArsipCuti'
            },
            {
                id: 'kuota-cuti-saat-ini',
                label: 'Kuota Cuti Saat Ini',
                draggable: true,
                componentName: 'KuotaCutiSaatIni'
            },
            {
                id: 'list-date',
                label: 'List Date',
                draggable: true,
                componentName: 'ListDate'
            },
            {
                id: 'monitoring-kuota',
                label: 'Monitoring Kuota',
                draggable: true,
                componentName: 'MonitoringKuota'
            },
            {
                id: 'status-dokumen-cuti-dashboard',
                label: 'Status Dokumen Cuti Dashboard',
                draggable: true,
                componentName: 'StatusDokumenCutiDashboard'
            },
        ]
    }
]