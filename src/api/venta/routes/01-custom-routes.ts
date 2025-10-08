export default {
  routes: [
    {
      method: 'GET',
      path: '/venta/:documentId/export-pdf',
      handler: 'venta.exportPdf',
      config: {
        auth: false,
      },
    },
  ],
};