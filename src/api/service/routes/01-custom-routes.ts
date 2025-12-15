export default {
  routes: [
    {
      method: 'GET',
      path: '/service/:documentId/export-pdf',
      handler: 'service.exportPdf',
      config: {
        auth: false,
      },
    },
  ],
};