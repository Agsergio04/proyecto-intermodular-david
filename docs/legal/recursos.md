# Licencias de Recursos y Propiedad Intelectual

Fecha de actualización: 2025-12-10  
Proyecto: PreguntaT (repo: Agsergio04/proyecto-intermodular-david)  
Responsable de la documentación: Sergio Aragón García — preguntat@gmail.com

Este documento detalla las licencias y derechos de uso de los recursos técnicos, gráficos y servicios externos empleados en el proyecto. Mantenerlo actualizado cada vez que se añada, sustituya o retire un recurso.

---

## 1. Resumen del stack y licencias principales

- Frontend: React — licencia MIT  
- Backend: Node.js y Express — licencia MIT  
- ODM/BD: Mongoose — licencia MIT  
- Autenticación / Seguridad: bcrypt, jsonwebtoken — MIT  
- Peticiones HTTP: axios — MIT  
- CSS / UI: Tailwind CSS  — MIT (o indicar framework concreto si se usa otro)  
- Testing: Jest, Supertest — MIT  
- CI/CD: GitHub Actions — de uso conforme a GitHub 
- Bundlers / Herramientas de desarrollo: ESLint, Prettier, Nodemon — MIT 

Nota: la mayoría de las dependencias npm utilizadas en proyectos similares son MIT, pero cada paquete debe verificarse individualmente en su repositorio npm/GitHub.

---

## 2. Dependencias (NPM / Paquetes) — verifique y complete según package.json

| Paquete / Recurso | Uso en el proyecto | Licencia (ejemplo) | Fuente / URL |
|-------------------|--------------------|---------------------|--------------|
| react             | UI                 | MIT                 | https://reactjs.org/ |
| react-router-dom  | Enrutado frontend  | MIT                 | https://github.com/remix-run/react-router |
| axios             | Peticiones HTTP    | MIT                 | https://github.com/axios/axios |
| node              | Runtime backend    | MIT                 | https://nodejs.org/ |
| express           | Servidor API       | MIT                 | https://expressjs.com/ |
| mongoose (si)     | ODM MongoDB        | MIT                 | https://mongoosejs.com/ |
| bcrypt            | Hash contraseñas   | MIT                 | https://github.com/kelektiv/node.bcrypt.js |
| jsonwebtoken      | JWT auth           | MIT                 | https://github.com/auth0/node-jsonwebtoken |
| tailwindcss (si)  | Estilos            | MIT                 | https://tailwindcss.com/ |
| jest              | Tests unitarios    | MIT                 | https://jestjs.io/ |

Acción: revisar el fichero package.json del repositorio y completar esta tabla con la lista exacta y la licencia de cada dependencia (campo "license" en package.json y/o repositorio del paquete).

---

## 3. Recursos gráficos y multimedia

| Recurso           | Descripción / Uso              | Autor / Origen         | Licencia / Condición de uso | URL / Notas |
|-------------------|--------------------------------|------------------------|-----------------------------|-------------|
| Iconos UI         | Iconos UI (botones, acciones)  | Heroicons (ejemplo)    | MIT                         | https://heroicons.com/ |
| Imágenes          | Fotografías ilustrativas       | Unsplash (diversos)    | Unsplash License (uso gratuito; revisar atribución si aplica) | https://unsplash.com/ |
| Ilustraciones     | Ilustraciones en landing       | unDraw                 | CC BY 4.0  | https://undraw.co/ |
| Tipografías       | Fuente principal (ej.: Inter)  | Google Fonts           | SIL Open Font License (OFL)  | https://fonts.google.com/ |
| Logos / Marca     | Logotipo del proyecto          | Diseño propio / contratado | Indicar contrato o licencia del diseñador si se usó tercero | (documentar) |

Acción: para cada recurso gráfico utilizado en el frontend se debe:
- Guardar la fuente/URL y la licencia en esta tabla.
- Añadir la atribución en /ABOUT o en el pie de página si la licencia lo exige.
- Conservar copia de la licencia en /docs/licenses/ si procede.

---

## 4. Servicios externos / APIs / Infraestructura

| Servicio / API     | Uso                            | Términos / Límite / Licencia | URL |
|--------------------|--------------------------------|-------------------------------|-----|
| MongoDB Atlas      | Base de datos (hosting)        | Plan gratuito con límites; revisar SLA y condiciones | https://www.mongodb.com/atlas |
| Vercel / Render / Railway | Hosting frontend/backend | Planes freemium; revisar condiciones de uso | (según servicio usado) |
| GitHub Actions     | CI/CD                          | Uso sujeto a condiciones GitHub | https://github.com/features/actions |
| SendGrid / Mailgun | Emails transaccionales         | Plan gratuito con límites; revisar TOS | https://sendgrid.com/ |
| Google Analytics (si) | Analítica web               | Política de privacidad y anonimización de IP requerida | https://analytics.google.com/ |

Acción: documentar en este fichero el servicio exacto contratado, plan y
