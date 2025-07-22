const validateArticle = (data) => {
  if (typeof data.id !== 'number' || data.id < 1) return false;
  if (typeof data.title !== 'string' || data.title.length < 1 || data.title.length > 50) return false;
  if (typeof data.content !== 'string' || data.content.length < 1) return false;
  if (typeof data.image !== 'string' || !data.image.startsWith('http')) return false;
  if (typeof data.createdAt !== 'string') return false;
  if (typeof data.updatedAt !== 'string') return false;
  return true;
}

export default validateArticle;