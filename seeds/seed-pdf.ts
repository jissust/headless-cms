import fs from 'fs';
import path from 'path';

export default async function seedPdfTemplates(strapi) {
  const templateQuery = strapi.db.query(
    'plugin::strapi-plugin-pdf-creator.template'
  );

  const count = await templateQuery.count();
  if (count > 0) {
    strapi.log.info('⏭ PDF templates ya existen');
    return;
  }

  const uploadService = strapi.plugin('upload').service('upload');

  const uploadPdf = async (fileName: string) => {
    
    const filePath = path.resolve(
      process.cwd(),
      'seeds/pdf/',
      fileName
    );

    strapi.log.info(`FILEPATH: ${filePath}`)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }
    
    const stat = fs.statSync(filePath);
    const [file] = await uploadService.upload({
      data: {},
      files: {
        filepath: filePath,
        originalFilename: fileName,
        mimetype: 'application/pdf',
        size: stat.size,
      },
    });
    
    strapi.log.info("Documento cargado: ", file.id)
    
    return file;
  };

  const remito = await uploadPdf("remito.pdf");
  const service = await uploadPdf('servicio_tecnico.pdf');

  await templateQuery.create({
    data: {
      name: 'Remito',
      collectionName: 'api::remito.remito',
      enabled: true,
      flatten_document: true,
      file: remito.id,
    },
  });

  await templateQuery.create({
    data: {
      name: 'Service',
      collectionName: 'api::service.service',
      enabled: true,
      flatten_document: true,
      file: service.id,
    },
  });
  
  strapi.log.info('✔ Seed PDF ejecutado correctamente');
}
