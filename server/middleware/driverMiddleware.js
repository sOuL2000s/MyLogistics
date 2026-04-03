const driver = (req, res, next) => {
  if (req.user && (req.user.role === 'driver' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a driver');
  }
};

module.exports = driver;

module.exports = driver;