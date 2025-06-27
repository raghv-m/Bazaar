const roles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

const isAdmin = roles('admin');
const isVendor = roles('vendor', 'admin');
const isCustomer = roles('customer', 'vendor', 'admin');

module.exports = {
  roles,
  isAdmin,
  isVendor,
  isCustomer
}; 