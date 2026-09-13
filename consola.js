"use strict";

/**
 * =====================================================================
 *  CAPA DE PRESENTACION EN CONSOLA
 * =====================================================================
 *  Aqui SI se usa console.log. Este archivo solo muestra datos,
 *  no calcula nada: todo el calculo vive en src/funciones.js
 *
 *  Ejecutar con:  node consola.js
 * =====================================================================
 */

const { estudiantes } = require("./src/datos");
const f = require("./src/funciones");

/* ---------------------- Helpers de impresion ---------------------- */

function linea(titulo) {
  console.log("\n" + "-".repeat(55));
  console.log(titulo.toUpperCase());
  console.log("-".repeat(55));
}

function imprimirEstudiantes(lista) {
  if (lista.length === 0) {
    console.log("No se encontraron estudiantes.");
    return;
  }

  for (let i = 0; i < lista.length; i++) {
    const e = lista[i];
    console.log(
      `ID: ${e.id} | ${e.nombre.padEnd(10)} | Edad: ${e.edad} | ` +
      `${e.carrera.padEnd(22)} | Sem: ${e.semestre} | Promedio: ${e.promedio}`
    );
  }
  console.log(`Total: ${lista.length} estudiante(s)`);
}

function imprimirEstudiante(e) {
  if (e === null) {
    console.log("Estudiante no encontrado.");
    return;
  }
  console.log(`Nombre:   ${e.nombre}`);
  console.log(`Edad:     ${e.edad}`);
  console.log(`Carrera:  ${e.carrera}`);
  console.log(`Semestre: ${e.semestre}`);
  console.log(`Promedio: ${e.promedio}`);
}

/* ----------------------- Punto 12: reporte ------------------------ */

function imprimirReporte(estudiantes) {
  const r = f.generarReporte(estudiantes);

  console.log("\n========== REPORTE ACADÉMICO ==========\n");
  console.log(`Total de estudiantes:            ${r.totalEstudiantes}`);
  console.log(`Estudiantes aprobados:           ${r.aprobados}`);
  console.log(`Estudiantes reprobados:          ${r.reprobados}`);
  console.log(`Promedio general:                ${r.promedioGeneral}`);
  console.log(
    `Mejor estudiante:                ${r.mejorEstudiante.nombre} (${r.mejorEstudiante.promedio})`
  );
  console.log(
    `Estudiante con menor promedio:   ${r.peorEstudiante.nombre} (${r.peorEstudiante.promedio})`
  );
  console.log("\n========================================");
}

/* ------------------------- Reto: ranking -------------------------- */

function imprimirRanking(estudiantes) {
  const ordenados = f.ordenarPorPromedio(estudiantes, true);

  console.log("\n===== RANKING =====\n");
  for (let i = 0; i < ordenados.length; i++) {
    console.log(`${i + 1}. ${ordenados[i].nombre} - ${ordenados[i].promedio}`);
  }
  console.log("\n===================");
}

/* ------------------------ Ejecucion general ----------------------- */

function main() {
  linea("1. Listado de todos los estudiantes");
  imprimirEstudiantes(f.listarEstudiantes(estudiantes));

  linea("2. Buscar estudiante por ID (id = 4)");
  imprimirEstudiante(f.buscarPorId(estudiantes, 4));

  linea("2b. Buscar un ID que no existe (id = 99)");
  imprimirEstudiante(f.buscarPorId(estudiantes, 99));

  linea("3. Estudiantes de Ingeniería de Sistemas");
  imprimirEstudiantes(f.buscarPorCarrera(estudiantes, "Ingeniería de Sistemas"));

  linea("4. Estudiantes aprobados (promedio >= 3.0)");
  imprimirEstudiantes(f.obtenerAprobados(estudiantes));

  linea("5. Estudiantes reprobados (promedio < 3.0)");
  imprimirEstudiantes(f.obtenerReprobados(estudiantes));

  linea("6. Promedio general");
  console.log(`Promedio general: ${f.calcularPromedioGeneral(estudiantes)}`);

  linea("7. Mejor estudiante");
  imprimirEstudiante(f.mejorEstudiante(estudiantes));

  linea("8. Estudiante con menor promedio");
  imprimirEstudiante(f.peorEstudiante(estudiantes));

  linea("9. Cantidad de estudiantes por carrera");
  const conteo = f.contarPorCarrera(estudiantes);
  for (const carrera in conteo) {
    console.log(`${carrera}: ${conteo[carrera]}`);
  }

  linea("10. Estudiantes del semestre 5");
  imprimirEstudiantes(f.buscarPorSemestre(estudiantes, 5));

  linea("11. Estudiantes mayores de 22 años");
  imprimirEstudiantes(f.mayoresDeEdad(estudiantes, 22));

  linea("12. Reporte general");
  imprimirReporte(estudiantes);

  linea("Reto adicional: ranking por promedio");
  imprimirRanking(estudiantes);

  // Comprobacion de que el array original nunca se modifico
  linea("Verificación: el array original no fue modificado");
  console.log(`Primer estudiante del array original: ${estudiantes[0].nombre}`);
}

main();