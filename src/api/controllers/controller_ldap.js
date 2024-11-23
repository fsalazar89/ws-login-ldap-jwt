const LdapService = require("../models/modelo_ldap");

class ControllerLoginLdap {
  constructor() {
    this.ldapService = new LdapService();
  }

  generarTokenJwt = async (usuario, tiempoExpira) => {
    const jwt = require("jsonwebtoken");
    const payload = { usuario };
    const secretKey = process.env.SECRET_TOKEN_JWT;
    try {
      const tokenJwt = await jwt.sign(payload, secretKey, {
        expiresIn: tiempoExpira,
      });
      return tokenJwt;
    } catch (error) {
      return false;
    }
  };

  gruposJSON = (grupos) => {
    let listaGrupos = [];
    grupos.map((linea) => {
      const partes = linea.split(",");
      const objeto = {};
      partes.forEach((item) => {
        const [clave, valor] = item.split("=");
        objeto[clave] = valor;
      });
      listaGrupos.push(objeto.CN);
    });
    return listaGrupos;
  };

  login = async (req, res) => {
    const usuarioRed = req.body.usuario;
    let usuario;
    let validCredentials;
    try {
      await this.ldapService.conecatarLDAP();
      usuario = await this.ldapService.buscarUsuario(usuarioRed);

      if (!usuario) {
        res.status(401).json({
          estado: false,
          mensaje: `El usuario no existe en el LDAP`,
          respuesta: null,
        });
        return;
      } else {
        validCredentials = await this.ldapService.validarClave(
          usuario.dn,
          req.body.clave
        );
      }

      if (validCredentials) {
        const token = await this.generarTokenJwt(
          req.body.usuario,
          req.body.token_expira
        );

        if (token) {
          const jsonGrupos = this.gruposJSON(usuario.memberOf);
          res.status(200).json({
            estado: true,
            mensaje: `Consulta Exitosa`,
            respuesta: {
              token: token,
              usuario: usuario.cn,
              grupos: jsonGrupos,
            },
          });
          return;
        } else {
          res.status(401).json({
            estado: false,
            mensaje: `Fallo la generacion del token de sesion`,
            respuesta: null,
          });
          return;
        }
      } else {
        res.status(401).json({
          estado: false,
          mensaje: `Credenciales incorrectas`,
          respuesta: null,
        });
        return;
      }
    } catch (err) {
      res.status(401).json({
        estado: false,
        mensaje: `Error inesperado, por favor validar con la mesa de ayuda`,
        respuesta: null,
      });
      return;
    } finally {
      this.ldapService.desconectarLDAP();
    }
  };

  validarToken = (req, res) => {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({
        estado: false,
        mensaje: `Token no proporcionado`,
        respuesta: null,
      });
    }
    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, `${process.env.SECRET_TOKEN_JWT}`);

      if (!decoded.usuario) {
        res.status(401).json({
          estado: false,
          mensaje: `No autorizado`,
          respuesta: null,
        });
      } else {
        res.status(200).json({
          estado: true,
          mensaje: `Validacion Exitosa`,
          respuesta: true,
        });
      }
    } catch (error) {
      if (error.message == "jwt expired") {
        res.status(401).json({
          estado: false,
          mensaje: `Token Expiro`,
          respuesta: null,
        });
      } else {
        res
          .status(401)
          .json({
            estado: false,
            mensaje: `Error en el servicio de validacion de token`,
            respuesta: null,
          });
      }
    }
  };
}

module.exports = ControllerLoginLdap;
