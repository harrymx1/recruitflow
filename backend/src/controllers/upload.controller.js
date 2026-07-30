const supabase = require('../config/supabase');

const generateSignedUrl = async (req, res, next) => {
  try {
    const { fileName, contentType, bucketName } = req.body;

    if (!fileName || !bucketName) {
      return res.status(400).json({ message: 'fileName and bucketName are required' });
    }

    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .createSignedUploadUrl(fileName);

    if (error) {
      console.error('Supabase signed URL error:', error);
      return res.status(500).json({ message: 'Gagal membuat signed URL', error: error.message });
    }

    res.json({
      message: 'Signed URL berhasil dibuat',
      data: {
        signedUrl: data.signedUrl,
        path: data.path,
        token: data.token,
        publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${data.path}`
      }
    });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    
    // Upload directly to supabase
    const { data, error } = await supabase
      .storage
      .from('documents')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ message: 'Gagal mengunggah dokumen', error: error.message });
    }

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/documents/${data.path}`;

    res.json({
      success: true,
      url: publicUrl
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateSignedUrl,
  uploadDocument
};
