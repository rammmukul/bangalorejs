function admin (req, res) {
  if (req.session.admin) {
    res.status(200).send('User Authentified')
  } else {
    res.status(403).send('Invalid User')
  }
}

module.exports = admin
