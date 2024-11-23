#!/bin/bash

echo "Despliegue de servicio LDAP"
# Se el contenedro actual
docker stop login-ldap-jwt
# Se elimina el contenedor actual
docker rm login-ldap-jwt
# Se elimina la imgan actual
docker rmi login-ldap-jwt
# Crear imagen
npm run docker_build
# Ejecutar contenedor
npm run docker_start
