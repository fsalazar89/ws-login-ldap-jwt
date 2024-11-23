const ldap = require('ldapjs');

class LdapService {
  
  constructor() {
    this.client = null;
    this.serverUrl = process.env.LADP_SERVIDOR;
    this.bindDN = process.env.LADP_DN;
    this.bindPassword = process.env.LADP_CLAVE;
  }

  conecatarLDAP() {
    this.client = ldap.createClient({
      url: this.serverUrl,
      reconnect: true,
    });

    return new Promise((resolve, reject) => {
      this.client.bind(this.bindDN, this.bindPassword, (err) => {
        if (err) {
          console.error('Error conectando con el LDAP:', err.message);
          return reject(err);
        }
        console.log('Conexion exitosa con el LDAP');
        resolve();
      });
    });
  }

  buscarUsuario(username) {
    const baseDN = 'DC=flamingo,DC=com,DC=co';
    const options = {
      filter: `(sAMAccountName=${username})`, // Filtra por el nombre del usuario
      scope: 'sub', // Busca en todos los niveles jerárquicos
      attributes: ['cn', 'sAMAccountName', 'memberOf', 'employeeID'], // Atributos a retornar
    };

    return new Promise((resolve, reject) => {
      this.client.search(baseDN, options, (err, res) => {
        if (err) {
          return reject(err);
        }

        let result = null;

        res.on('searchEntry', (entry) => {
          result = entry.object;
        });

        res.on('error', (err) => {
          reject(err);
        });

        res.on('end', (resultStatus) => {
          if (resultStatus.status !== 0) {
            return reject(new Error('Fallo la consulta del usuario en el LDAP'));
          }
          resolve(result);
        });
      });
    });
  }

  validarClave(username, password) {
    const validarUsuario = ldap.createClient({
      url: this.serverUrl,
    });

    return new Promise((resolve, reject) => {
      validarUsuario.bind(username, password, (err) => {
        validarUsuario.unbind();
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  desconectarLDAP() {
    if (this.client) {
      this.client.unbind((err) => {
        if (err) {
          console.error('Error desconectando LDAP:', err.message);
        } else {
          console.log('Conexion cerrada LDAP');
        }
      });
    }
  }
  
}

module.exports = LdapService;