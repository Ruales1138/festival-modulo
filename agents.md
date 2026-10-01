Instrucciones para el trabajo con la base de datos (compartida entre todos los equipos):

1. **Sincronización:** Usen siempre el comando npm run sync para actualizar el esquema.
2. **No usar:** Nunca ejecuten prisma migrate ni prisma db push, ya que borrarían las tablas de los demás equipos.
3. **Variables de entorno:** No suban el archivo .env a GitHub; únicamente el .env.example, sin la contraseña.

Reglas generales:

1. **Autenticación:** El backend usa JWT con expiración de 30 minutos, y los roles (admin, usuario, etc.) están en el token; no es necesario volver a consultar a la base para validar cada request.
2. **Archivo .env:** Debe contener todas las claves listadas en .env.example, y si falta alguna, hay que añadirla ahí antes de subirlo.

la base de datos es en el puerto 5432, no en el 3000.

