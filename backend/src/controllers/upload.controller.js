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
        // The public URL can be constructed if the bucket is public
        publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${data.path}`
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateSignedUrl
};
