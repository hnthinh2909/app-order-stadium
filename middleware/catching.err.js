module.exports.logErrors  = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

module.exports.clientErrorHandler  = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

module.exports.errorHandler = (err, req, res, next) => {
  res.status(500)
  res.render('error', { error: err })
}