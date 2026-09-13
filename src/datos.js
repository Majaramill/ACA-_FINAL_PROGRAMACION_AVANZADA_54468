"use strict";

/**
 * Datos iniciales del ejercicio.
 * Este array contiene los datos de los estudiantes y se exporta para que otros modulos lo puedan usar.
 */
const estudiantes = [
  { id: 1,  nombre: "Andrés",    edad: 21, carrera: "Ingeniería de Sistemas", semestre: 5, promedio: 4.2 },
  { id: 2,  nombre: "Laura",     edad: 20, carrera: "Administración",         semestre: 4, promedio: 3.8 },
  { id: 3,  nombre: "Carlos",    edad: 24, carrera: "Ingeniería de Sistemas", semestre: 7, promedio: 2.9 },
  { id: 4,  nombre: "Mariana",   edad: 22, carrera: "Contaduría",             semestre: 6, promedio: 4.5 },
  { id: 5,  nombre: "Juan",      edad: 19, carrera: "Ingeniería de Sistemas", semestre: 3, promedio: 3.2 },
  { id: 6,  nombre: "Sofía",     edad: 23, carrera: "Administración",         semestre: 8, promedio: 4.7 },
  { id: 7,  nombre: "Daniel",    edad: 25, carrera: "Contaduría",             semestre: 9, promedio: 2.7 },
  { id: 8,  nombre: "Valentina", edad: 21, carrera: "Ingeniería de Sistemas", semestre: 5, promedio: 3.9 },
  { id: 9,  nombre: "Sebastián", edad: 22, carrera: "Administración",         semestre: 6, promedio: 3.4 },
  { id: 10, nombre: "Camila",    edad: 20, carrera: "Contaduría",             semestre: 4, promedio: 4.1 }
];

module.exports = { estudiantes }; //exporta el array para que otros modulos lo puedan usar