export default (req, res, next) => {
  if (!req.user) {
    res.error.authRequired()
    return
  }
  next()
}
