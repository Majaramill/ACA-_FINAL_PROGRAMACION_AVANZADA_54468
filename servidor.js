"use strict";

/**
 * =====================================================================
 *  PUNTO DE ENTRADA DE LA API
 *  Ejecutar con:  node servidor.js   (o  npm start)
 *  Abrir:         http://localhost:3000
 * =====================================================================
 */

const express = require("express");
const rutas = require("./src/rutas");

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.json());   // permite recibir JSON en el body
app.use("/api", rutas);    // todas las rutas quedan bajo /api

/* ---------------- Pagina de inicio con los endpoints -------------- */
app.get("/", (req, res) => {
  const endpoints = [
    ["GET /api/estudiantes", "1. Listar todos los estudiantes"],
    ["GET /api/estudiantes/:id", "2. Buscar estudiante por ID"],
    ["GET /api/estudiantes/carrera/:carrera", "3. Buscar por carrera"],
    ["GET /api/estudiantes/aprobados", "4. Aprobados (promedio >= 3.0)"],
    ["GET /api/estudiantes/reprobados", "5. Reprobados (promedio < 3.0)"],
    ["GET /api/estadisticas/promedio", "6. Promedio general"],
    ["GET /api/estadisticas/mejor", "7. Mejor estudiante"],
    ["GET /api/estadisticas/peor", "8. Estudiante con menor promedio"],
    ["GET /api/estadisticas/carreras", "9. Conteo por carrera"],
    ["GET /api/estudiantes/semestre/:semestre", "10. Buscar por semestre"],
    ["GET /api/estudiantes/mayores/:edad", "11. Mayores de cierta edad"],
    ["GET /api/reporte", "12. Reporte académico general"],
    ["GET /api/ranking", "Reto: ranking por promedio"]
  ];

  let filas = "";
  for (let i = 0; i < endpoints.length; i++) {
    const ruta = endpoints[i][0];
    const url = ruta.replace("GET ", "")
      .replace(":id", "4")
      .replace(":carrera", "Ingeniería de Sistemas")
      .replace(":semestre", "5")
      .replace(":edad", "22");

    filas += `<tr><td><a href="${encodeURI(url)}">${ruta}</a></td><td>${endpoints[i][1]}</td></tr>`;
  }

  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>API Gestión de Estudiantes</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 40px auto; max-width: 820px; color: #222; }
    h1 { border-bottom: 2px solid #444; padding-bottom: 8px; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    td { border-bottom: 1px solid #ddd; padding: 10px 8px; font-size: 15px; }
    td:first-child { font-family: ui-monospace, monospace; white-space: nowrap; }
    a { color: #0b5cd5; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>API Gestión de Estudiantes</h1>
  <p>Node.js + Express. Haga clic en cualquier ruta para probarla.</p>
  <table>${filas}</table>
</body>
</html>`);
});

/* ------------------------- Ruta no encontrada --------------------- */
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada.", ruta: req.originalUrl });
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});