REPOSITORIO PARA APLICACIONES WEB, leer deberes añadidos:
- Añadido deber semana 1 (15-05-2026)
- Añadido deber semana 2, enfoque code first (24-05-2026)
- Añadido deber semana 3, (31-05-2026)
- **Añadido examen parcial 1 (05-06-2026)**

- Añadido deber semana 4, (07-06-2026)
- Añadido deber semana 5, (14-06-2026): Importante leer:
emplear npm install para hacerlo funcionar,
no incluye código del API (solo frontend),
hecho a partir de la actividad de preguntas y respuestas en clase
- Añadido deber semana 6, (21-06-2026): Importante leer:
ver "appsettings.json" para ajustar el servidor de tu dispositivo, usar update-database para crear la base de datos o emplear el archivo bak adjunto (para sql server), si no funciona, usa remove-migration y usa "add-migration primera", vuelve a usar el primer comando; en el frontend emplea "npm install". Recuerda añadir en la base de datos manualmente al usuario con lo siguiente si no usas el bak (requerido ya que hasheamos la contraseña):
INSERT INTO Usuarios (Nombre_Usuario, Contrasena) VALUES ('usuario', CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', '12345'), 2)). Con ello, activa tanto la api como el frontend para que funcione.
 - Añadido deber semana 7, (21-06-2026): Importante leer: Asegurate de ajustar app.module.ts del backend a tu base de datos y gestor
 - Añadido documento del PI, (21-06-2026)
 - **Añadido examen parcial 2, deber S8 (03-07-2026): Importante leer:** Hecho con Node y Angular, usa la base de datos restaurante.sql alojada en la carpeta, luego instala los componentes en el backend (npm init -y|npm install express mysql2 cors|npm install --save-dev nodemon) y en el frontend usar (npm install -g @angular/cli), de este modo el proyecto funcionará, verifica en el archivo db del backend que esté acorde a tu base de datos.
