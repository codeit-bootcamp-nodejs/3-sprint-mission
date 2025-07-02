export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.message.includes('NotFound')) {
    return res.status(404).json({ error: err.message });
  }
  if (err.name === 'ValidationError' || err.name === 'StructError') {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: '서버 내부 오류' });
}