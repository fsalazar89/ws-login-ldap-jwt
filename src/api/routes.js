const express = require("express");
const ControllerLoginLdap = require(`./controllers/controller_ldap`);
const Middleware = require("./middleware");
const route = express.Router();

const middleware = new Middleware();
const controllerLoginLdap = new ControllerLoginLdap();

//Rutas
route.get(
    "/", 
    middleware.autenticacion.bind(middleware), 
    (req, res) => res.json({ mensaje: "Servicio Login LDAP" })
);
route.post(
  "/login_ldap",
  middleware.autenticacion.bind(middleware),
  controllerLoginLdap.login.bind(controllerLoginLdap)
);
route.post(
  "/validar_token",
  middleware.autenticacion.bind(middleware),
  controllerLoginLdap.validarToken.bind(controllerLoginLdap)
);

module.exports = route;
