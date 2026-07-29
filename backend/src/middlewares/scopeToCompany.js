const scopeToCompany = (req, res, next) => {
  if (!req.user || !req.user.companyId) {
    return res.status(401).json({ message: 'Unauthorized: missing company context' });
  }
  
  // Attach companyId to a standard location or let controllers use req.user.companyId
  // This is a marker middleware to ensure the request is properly scoped
  next();
};

module.exports = scopeToCompany;
