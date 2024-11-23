class Middleware {
  autenticacion = (req, res, next) => {
    try {
      req.headers.authorization === `Bearer ${process.env.TOKEN_AUTHORIZATION}`
        ? next()
        : res.status(200).json({ mensaje: "No Autorizado" });
    } catch (err) {
      res
        .status(500)
        .json({ mensaje: "Ocurrio un error inesperado, valide nuevamente" });
    }
  };
}

module.exports = Middleware;
