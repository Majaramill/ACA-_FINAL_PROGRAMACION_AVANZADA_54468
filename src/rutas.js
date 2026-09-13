"use strict";

/**
 * =====================================================================
 *  CAPA HTTP (Express)
 * =====================================================================
 *  Ubicacion: src/rutas.js  (al lado de datos.js y funciones.js)
 *
 *  Cada endpoint llama UNA funcion de src/funciones.js y devuelve JSON.
 *  Ojo con el orden: las rutas fijas (/aprobados) van ANTES de la ruta
 *  con parametro (/:id), porque Express evalua de arriba hacia abajo y
 *  "/estudiantes/aprobados" tambien encaja en "/estudiantes/:id".
 * =====================================================================
 */

const express = require("express");
const { estudiantes } = require("./datos");
const f = require("./funciones");

const router = express.Router();

/* ------------------------- 1. Listar todos ------------------------ */
router.get("/estudiantes", (req, res) => {
  const lista = f.listarEstudiantes(estudiantes);
  res.json({ total: lista.length, datos: lista });
});

/* --------------------- 4. Aprobados (ruta fija) ------------------- */
router.get("/estudiantes/aprobados", (req, res) => {
  const lista = f.obtenerAprobados(estudiantes);
  res.json({ criterio: `promedio >= ${f.NOTA_MINIMA}`, total: lista.length, datos: lista });
});

/* -------------------- 5. Reprobados (ruta fija) ------------------- */
router.get("/estudiantes/reprobados", (req, res) => {
  const lista = f.obtenerReprobados(estudiantes);
  res.json({ criterio: `promedio < ${f.NOTA_MINIMA}`, total: lista.length, datos: lista });
});

/* ------------------------ 3. Por carrera -------------------------- */
router.get("/estudiantes/carrera/:carrera", (req, res) => {
  const lista = f.buscarPorCarrera(estudiantes, req.params.carrera);

  if (lista.length === 0) {
    return res.status(404).json({
      mensaje: `No hay estudiantes en la carrera "${req.params.carrera}".`
    });
  }
  res.json({ carrera: req.params.carrera, total: lista.length, datos: lista });
});

/* ------------------------ 10. Por semestre ------------------------ */
router.get("/estudiantes/semestre/:semestre", (req, res) => {
  const semestre = Number(req.params.semestre);

  if (Number.isNaN(semestre)) {
    return res.status(400).json({ mensaje: "El semestre debe ser un número." });
  }

  const lista = f.buscarPorSemestre(estudiantes, semestre);
  res.json({ semestre, total: lista.length, datos: lista });
});

/* --------------------- 11. Mayores de cierta edad ----------------- */
router.get("/estudiantes/mayores/:edad", (req, res) => {
  const edad = Number(req.params.edad);

  if (Number.isNaN(edad)) {
    return res.status(400).json({ mensaje: "La edad debe ser un número." });
  }

  const lista = f.mayoresDeEdad(estudiantes, edad);
  res.json({ mayoresDe: edad, total: lista.length, datos: lista });
});

/* ---------------- 2. Por ID (ruta con parametro, al final) -------- */
router.get("/estudiantes/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ mensaje: "El ID debe ser un número." });
  }

  const estudiante = f.buscarPorId(estudiantes, id);

  if (estudiante === null) {
    return res.status(404).json({ mensaje: `Estudiante con ID ${id} no encontrado.` });
  }
  res.json(estudiante);
});

/* ----------------------- 6. Promedio general ---------------------- */
router.get("/estadisticas/promedio", (req, res) => {
  res.json({ promedioGeneral: f.calcularPromedioGeneral(estudiantes) });
});

/* ------------------------- 7. Mejor estudiante -------------------- */
router.get("/estadisticas/mejor", (req, res) => {
  res.json(f.mejorEstudiante(estudiantes));
});

/* -------------------------- 8. Peor estudiante -------------------- */
router.get("/estadisticas/peor", (req, res) => {
  res.json(f.peorEstudiante(estudiantes));
});

/* ---------------------- 9. Conteo por carrera --------------------- */
router.get("/estadisticas/carreras", (req, res) => {
  res.json(f.contarPorCarrera(estudiantes));
});

/* --------------------------- 12. Reporte -------------------------- */
router.get("/reporte", (req, res) => {
  res.json(f.generarReporte(estudiantes));
});

/* ------------------------ Reto: ranking --------------------------- */
router.get("/ranking", (req, res) => {
  const ordenados = f.ordenarPorPromedio(estudiantes, true);
  const ranking = [];

  for (let i = 0; i < ordenados.length; i++) {
    ranking.push({
      posicion: i + 1,
      nombre: ordenados[i].nombre,
      promedio: ordenados[i].promedio
    });
  }
  res.json(ranking);
});

module.exports = router;