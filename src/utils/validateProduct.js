const validateProduct = (data) => {
  if (typeof data.id !== 'number' || data.id < 1 ) return false;
  if (typeof data.name !== 'string' || data.name.length < 1 || data.name.length > 30) return false;
  if (typeof data.description !== 'string') return false;
  if (typeof data.price !== 'number' || data.price < 0) return false;
  if (!Array.isArray(data.tags) || !data.tags.every(i => typeof i === 'string')) return false;
  if (!Array.isArray(data.images) || !data.images.every(url => typeof url === 'string' && url.startsWith('http'))) return false;
  if (typeof data.createdAt !== 'string') return false;
  return true;
}

export default validateProduct;