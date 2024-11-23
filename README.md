## Servicio Login LDAP
Servicio que permite validar en el directorio activo el usuario y las contraseña de un usuario de red, si las credenciales son correctar se genera un token de jsonwebtoken y se muestran los grupos a los que pertenece el usuario

## Configuración

1. Clonar el repositorio:
- git clone https://github.com/fsalazar89/ws-login-ldap-jwt

2. Configurar las variables de entorno:

- Crea un archivo con el nombre `.env` en la raíz del proyecto, en este archivo se deben almacenar las variables de entorno necesarias para el proyecto.
- PORT_APP
- TOKEN_AUTHORIZATION
- SECRET_TOKEN_JWT
- LADP_SERVIDOR
- LADP_DN
- LADP_CLAVE


## Despliegue
1. Entrr a la carpeta del proyecto. ```cd ws-login-ldap-jwt```
2. Ejecutar el script ````sh run.sh```:


## Consumo de se los servicios "login_ldap"
* Metodo: POST
* Url: http://localhost:XXXX/api/login_ldap
* Headers:
```
{
    "authorization":"xxxxxxxxx",
}
```
* Body:
```
{
    "usuario":"xxxxxxx",
    "clave":"xxxxxxx",
    "token_expira":"1h"
}
```

## Consumo de se los servicios "validar_token"
* Metodo: POST
* Url: http://localhost:XXXX/api/validar_token
* Headers:
```
{
    "authorization":"xxxxxxxxx",
}
```
* Body:
```
{
    "token":"xxxxxxx"
}
```
