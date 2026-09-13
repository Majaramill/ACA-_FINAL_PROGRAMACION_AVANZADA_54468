"use strict";

/**
 * =====================================================================
 *  GENERADOR DE EVIDENCIAS
 * =====================================================================
 *  Un solo comando que:
 *    1. Ejecuta consola.js y guarda su salida
 *    2. Levanta el servidor, consulta los 13 endpoints y guarda las
 *       respuestas
 *    3. Apaga el servidor solo
 *
 *  COMO SE USA:
 *    node evidencia.js
 *
 *  QUE GENERA (carpeta "evidencia/"):
 *    01-consola.txt   salida completa de node consola.js
 *    02-express.txt   peticion y respuesta de cada endpoint
 *
 *  El servidor se levanta en el puerto 3100 y no en el 3000, para no
 *  chocar si ya tiene uno corriendo con npm start.
 * =====================================================================
 */

const { execFileSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const CARPETA = path.join(__dirname, "evidencia");
const PUERTO = 3100;
const BASE = `http://localhost:${PUERTO}`;

/* ------------------------------------------------------------------ */
/*  Lista de endpoints a consultar                                     */
/* ------------------------------------------------------------------ */

const ENDPOINTS = [
  { punto: "1",    url: "/api/estudiantes",                            nota: "Listar todos" },
  { punto: "2",    url: "/api/estudiantes/4",                          nota: "Buscar por ID (existe)" },
  { punto: "2b",   url: "/api/estudiantes/99",                         nota: "ID inexistente -> 404" },
  { punto: "2c",   url: "/api/estudiantes/abc",                        nota: "ID invalido -> 400" },
  { punto: "3",    url: "/api/estudiantes/carrera/Ingenieria de Sistemas", nota: "Buscar por carrera" },
  { punto: "4",    url: "/api/estudiantes/aprobados",                  nota: "Aprobados" },
  { punto: "5",    url: "/api/estudiantes/reprobados",                 nota: "Reprobados" },
  { punto: "6",    url: "/api/estadisticas/promedio",                  nota: "Promedio general" },
  { punto: "7",    url: "/api/estadisticas/mejor",                     nota: "Mejor estudiante" },
  { punto: "8",    url: "/api/estadisticas/peor",                      nota: "Menor promedio" },
  { punto: "9",    url: "/api/estadisticas/carreras",                  nota: "Conteo por carrera" },
  { punto: "10",   url: "/api/estudiantes/semestre/5",                 nota: "Por semestre" },
  { punto: "11",   url: "/api/estudiantes/mayores/22",                 nota: "Mayores de 22" },
  { punto: "12",   url: "/api/reporte",                                nota: "Reporte general" },
  { punto: "reto", url: "/api/ranking",                                nota: "Ranking" },
  { punto: "404",  url: "/api/ruta-que-no-existe",                     nota: "Ruta inexistente" }
];

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */

function separador(texto) {
  return "\n" + "=".repeat(70) + "\n" + texto + "\n" + "=".repeat(70) + "\n";
}

function fechaLegible() {
  const d = new Date();
  const dos = (n) => (n < 10 ? "0" + n : String(n));
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()} ` +
         `${dos(d.getHours())}:${dos(d.getMinutes())}:${dos(d.getSeconds())}`;
}

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------ */
/*  Paso 1: evidencia de la consola                                    */
/* ------------------------------------------------------------------ */

function generarEvidenciaConsola() {
  console.log("1/2  Ejecutando consola.js ...");

  const salida = execFileSync(process.execPath, ["consola.js"], {
    cwd: __dirname,
    encoding: "utf8"
  });

  const contenido =
    "EVIDENCIA DE EJECUCION EN CONSOLA\n" +
    "Proyecto: Gestion de Estudiantes (Node.js)\n" +
    "Comando:  node consola.js\n" +
    "Fecha:    " + fechaLegible() + "\n" +
    salida;

  const destino = path.join(CARPETA, "01-consola.txt");
  fs.writeFileSync(destino, contenido, "utf8");

  console.log("     Guardado en evidencia/01-consola.txt");
}

/* ------------------------------------------------------------------ */
/*  Paso 2: evidencia de la API                                        */
/* ------------------------------------------------------------------ */

function levantarServidor() {
  return new Promise((resolve, reject) => {
    const servidor = spawn(process.execPath, ["servidor.js"], {
      cwd: __dirname,
      env: Object.assign({}, process.env, { PORT: String(PUERTO) })
    });

    let arrancado = false;

    servidor.stdout.on("data", (dato) => {
      if (!arrancado && String(dato).indexOf("escuchando") !== -1) {
        arrancado = true;
        resolve(servidor);
      }
    });

    servidor.stderr.on("data", (dato) => {
      if (!arrancado) {
        reject(new Error("El servidor no arranco:\n" + String(dato)));
      }
    });

    setTimeout(() => {
      if (!arrancado) {
        reject(new Error("El servidor no respondio en 10 segundos."));
      }
    }, 10000);
  });
}

async function generarEvidenciaExpress() {
  console.log("2/2  Levantando el servidor en el puerto " + PUERTO + " ...");

  const servidor = await levantarServidor();
  await esperar(300);

  let contenido =
    "EVIDENCIA DE EJECUCION DE LA API (Express)\n" +
    "Proyecto: Gestion de Estudiantes (Node.js + Express)\n" +
    "Servidor: " + BASE + "\n" +
    "Fecha:    " + fechaLegible() + "\n";

  for (let i = 0; i < ENDPOINTS.length; i++) {
    const item = ENDPOINTS[i];
    const url = BASE + encodeURI(item.url);

    console.log(`     [${i + 1}/${ENDPOINTS.length}] ${item.url}`);

    contenido += separador(`PUNTO ${item.punto} — ${item.nota}`);
    contenido += "GET " + item.url + "\n\n";

    try {
      const respuesta = await fetch(url);
      const texto = await respuesta.text();

      contenido += "Codigo HTTP: " + respuesta.status + "\n";
      contenido += "Respuesta:\n";

      // se intenta formatear el JSON para que sea legible
      try {
        contenido += JSON.stringify(JSON.parse(texto), null, 2) + "\n";
      } catch (e) {
        contenido += texto + "\n";
      }
    } catch (error) {
      contenido += "ERROR: " + error.message + "\n";
    }
  }

  const destino = path.join(CARPETA, "02-express.txt");
  fs.writeFileSync(destino, contenido, "utf8");

  servidor.kill();
  console.log("     Guardado en evidencia/02-express.txt");
  console.log("     Servidor apagado.");
}

/* ------------------------------------------------------------------ */
/*  Ejecucion                                                          */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("\nGENERANDO EVIDENCIAS\n--------------------");

  if (!fs.existsSync(CARPETA)) {
    fs.mkdirSync(CARPETA);
  }

  generarEvidenciaConsola();
  await generarEvidenciaExpress();

  console.log("\nListo. Revise la carpeta evidencia/\n");
}

main().catch((error) => {
  console.error("\nOcurrio un error:", error.message, "\n");
  process.exit(1);
});