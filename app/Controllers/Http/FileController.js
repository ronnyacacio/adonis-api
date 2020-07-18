'use strict';

const Helpers = use('Helpers');
const File = use('App/Models/File');

class FileController {
  async store({ request, response }) {
    try {
      if (!request.file('file')) return;

      const upload = request.file('file', { size: '2mb' });

      const filename = `${Date.now()}.${upload.subtype}`;

      await upload.move(Helpers.tmpPath('uploads'), {
        name: filename,
      });

      if (!upload.moved()) throw upload.error();

      const file = await File.create({
        file: filename,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      });

      return file;
    } catch (err) {
      return response.status(err.status).send({ error: 'erro' });
    }
  }

  async show({ params, response }) {
    try {
      const file = await File.findOrFail(params.id);

      return response.download(Helpers.tmpPath(`uploads/${file.file}`));
    } catch (err) {
      return response.status(err.status).send({ error: 'Image not exists!' });
    }
  }
}

module.exports = FileController;
