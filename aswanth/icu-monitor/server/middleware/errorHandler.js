module.exports = (err, req, res, next) => {
  console.error('❌', err.message);
  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: msgs.join('. ') });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `Duplicate value for ${field}` });
  }
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
};