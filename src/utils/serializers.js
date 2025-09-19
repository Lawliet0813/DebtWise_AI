function sanitizeUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

module.exports = {
  sanitizeUser,
};
