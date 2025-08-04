const role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).send('Unauthorized');
    
    const userRoles = req.user.roles.map(role => role.name);
    const isAllowed = allowedRoles.some(role => userRoles.includes(role));
    
    if (!isAllowed) return res.status(403).send('Forbidden');
    next();
  };
};

module.exports = role;