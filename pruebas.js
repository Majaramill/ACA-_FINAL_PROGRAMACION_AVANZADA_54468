"use strict";

/**
 * =====================================================================
 *  PROBADOR DE FUNCIONES — una por una
 * =====================================================================
 *  Permite ejecutar SOLO la funcion que se quiera, sin correr todo
 *  el programa.
 *
 *  COMO SE USA:
 *    node pruebas.js          -> muestra el menu de pruebas disponibles
 *    node pruebas.js 2        -> ejecuta solo la prueba del punto 2
 *    node pruebas.js 2 7      -> busca el ID 7 en vez del 4 por defecto
 *    node pruebas.js todo     -> ejecuta todas, una detras de otra
 *
 *  COMO FUNCIONA process.argv:
 *    Es un array con lo que se escribio en la terminal.
 *    Para "node pruebas.js 2 7" contiene:
 *      [0] la ruta de node
 *      [1] la ruta de este archivo
 *      [2] "2"      <- el numero de prueba
 *      [3] "7"      <- el valor opcional
 *    Por eso se leen desde la posicion 2.
 * =====================================================================
 */

const { estudiantes } = require("./src/datos");
const f = require("./src/funciones");

const prueba = process.argv[2];   // que prueba correr
const valor = process.argv[3];    // valor opcional para la prueba

/* ------------------------------------------------------------------ */
/*  Ayudas de impresion                                                */
/* ------------------------------------------------------------------ */

function titulo(texto) {
  console.log("\n" + "=".repeat(60));
  console.log(texto);
  console.log("=".repeat(60));
}

function mostrar(etiqueta, dato) {
  console.log(`\n${etiqueta}`);
  console.log(dato);
}

/* ------------------------------------------------------------------ */
/*  Las pruebas, una por punto del ejercicio                           */
/* ------------------------------------------------------------------ */

function prueba1() {
  titulo("PUNTO 1 — listarEstudiantes(estudiantes)");

  const resultado = f.listarEstudiantes(estudiantes);

  mostrar("Cantidad devuelta:", resultado.length);
  mostrar("Primer elemento:", resultado[0]);
  mostrar("Ultimo elemento:", resultado[resultado.length - 1]);

  // comprobacion de que es una COPIA y no el array original
  console.log("\n¿Es el mismo array en memoria?", resultado === estudiantes);
  console.log("(Es Falso porque debe ser la copia del array y no el original)");
}

function prueba2() {
  const id = valor === undefined ? 4 : Number(valor);

  titulo(`PUNTO 2 — buscarPorId(estudiantes, ${id})`);

  const resultado = f.buscarPorId(estudiantes, id);

  if (resultado === null) {
    console.log("\nDevolvio null -> no existe un estudiante con ese ID.");
    console.log("Asi es como la consola sabe imprimir 'no encontrado'");
    console.log("y como Express sabe responder con un error 404.");
  } else {
    mostrar("Devolvio el objeto:", resultado);
    console.log("\nAcceso a sus propiedades:");
    console.log("  .nombre   ->", resultado.nombre);
    console.log("  .promedio ->", resultado.promedio);
  }
}

function prueba3() {
  const carrera = valor === undefined ? "Ingeniería de Sistemas" : valor;

  titulo(`PUNTO 3 — buscarPorCarrera(estudiantes, "${carrera}")`);

  const resultado = f.buscarPorCarrera(estudiantes, carrera);

  mostrar("Cantidad encontrada:", resultado.length);
  for (let i = 0; i < resultado.length; i++) {
    console.log(`  ${resultado[i].nombre} — ${resultado[i].carrera}`);
  }

  if (resultado.length === 0) {
    console.log("  (array vacio: ninguna coincidencia)");
  }
}

function prueba4() {
  titulo("PUNTO 4 — obtenerAprobados(estudiantes)");

  const resultado = f.obtenerAprobados(estudiantes);

  mostrar(`Aprobados (promedio >= ${f.NOTA_MINIMA}): ${resultado.length}`, "");
  for (let i = 0; i < resultado.length; i++) {
    console.log(`  ${resultado[i].nombre} — ${resultado[i].promedio}`);
  }

  // demostracion del parametro opcional
  const exigente = f.obtenerAprobados(estudiantes, 4.0);
  console.log(`\nCon nota minima 4.0 serian solo ${exigente.length}:`);
  for (let i = 0; i < exigente.length; i++) {
    console.log(`  ${exigente[i].nombre} — ${exigente[i].promedio}`);
  }
}

function prueba5() {
  titulo("PUNTO 5 — obtenerReprobados(estudiantes)");

  const resultado = f.obtenerReprobados(estudiantes);

  mostrar(`Reprobados (promedio < ${f.NOTA_MINIMA}): ${resultado.length}`, "");
  for (let i = 0; i < resultado.length; i++) {
    console.log(`  ${resultado[i].nombre} — ${resultado[i].promedio}`);
  }

  console.log(`\nComprobacion: ${f.obtenerAprobados(estudiantes).length} aprobados +` +
    ` ${resultado.length} reprobados = ${estudiantes.length} total`);
}

function prueba6() {
  titulo("PUNTO 6 — calcularPromedioGeneral(estudiantes)");

  const resultado = f.calcularPromedioGeneral(estudiantes);

  // se recalcula a mano para ver de donde sale el numero
  let suma = 0;
  for (let i = 0; i < estudiantes.length; i++) {
    suma += estudiantes[i].promedio;
  }

  console.log("\nSuma de los promedios:", suma);
  console.log("Dividido entre", estudiantes.length, "=", suma / estudiantes.length);
  console.log("Despues de redondear ->", resultado);
  console.log("\nTipo de dato devuelto:", typeof resultado, "(debe ser number, no string)");
}

function prueba7() {
  titulo("PUNTO 7 — mejorEstudiante(estudiantes)");
  mostrar("Devolvio:", f.mejorEstudiante(estudiantes));
}

function prueba8() {
  titulo("PUNTO 8 — peorEstudiante(estudiantes)");
  mostrar("Devolvio:", f.peorEstudiante(estudiantes));
}

function prueba9() {
  titulo("PUNTO 9 — contarPorCarrera(estudiantes)");

  const resultado = f.contarPorCarrera(estudiantes);

  mostrar("Objeto devuelto:", resultado);

  console.log("\nRecorrido con for...in:");
  let total = 0;
  for (const carrera in resultado) {
    console.log(`  ${carrera}: ${resultado[carrera]}`);
    total += resultado[carrera];
  }
  console.log(`  (suma de todos: ${total}, debe dar ${estudiantes.length})`);
}

function prueba10() {
  const semestre = valor === undefined ? 5 : Number(valor);

  titulo(`PUNTO 10 — buscarPorSemestre(estudiantes, ${semestre})`);

  const resultado = f.buscarPorSemestre(estudiantes, semestre);

  mostrar("Cantidad encontrada:", resultado.length);
  for (let i = 0; i < resultado.length; i++) {
    console.log(`  ${resultado[i].nombre} — semestre ${resultado[i].semestre}`);
  }
}

function prueba11() {
  const edad = valor === undefined ? 18 : Number(valor);

  titulo(`PUNTO 11 — mayoresDeEdad(estudiantes, ${edad})`);

  const resultado = f.mayoresDeEdad(estudiantes, edad);

  mostrar(`Estudiantes con edad MAYOR a ${edad}: ${resultado.length}`, "");
  for (let i = 0; i < resultado.length; i++) {
    console.log(`  ${resultado[i].nombre} — ${resultado[i].edad} años`);
  }

  console.log(`\nOjo: los de exactamente ${edad} años quedan POR FUERA,`);
  console.log("porque la condicion usa > y no >= ya que deben ser mayor a la edad indicada.");
}

function prueba12() {
  titulo("PUNTO 12 — generarReporte(estudiantes)");

  const resultado = f.generarReporte(estudiantes);

  mostrar("Objeto devuelto:", resultado);

  console.log("\nAcceso a cada dato por separado:");
  console.log("  .totalEstudiantes ->", resultado.totalEstudiantes);
  console.log("  .promedioGeneral  ->", resultado.promedioGeneral);
  console.log("  .mejorEstudiante.nombre ->", resultado.mejorEstudiante.nombre);
}

function pruebaReto() {
  titulo("RETO — ordenarPorPromedio(estudiantes)");

  const resultado = f.ordenarPorPromedio(estudiantes);

  console.log("\nOrden descendente:");
  for (let i = 0; i < resultado.length; i++) {
    console.log(`  ${i + 1}. ${resultado[i].nombre} - ${resultado[i].promedio}`);
  }

  console.log("\nOrden ascendente (segundo parametro en false):");
  const asc = f.ordenarPorPromedio(estudiantes, false);
  for (let i = 0; i < asc.length; i++) {
    console.log(`  ${i + 1}. ${asc[i].nombre} - ${asc[i].promedio}`);
  }

  console.log("\nCOMPROBACION de que el array original NO se modifico:");
  console.log("  Primer estudiante del original:", estudiantes[0].nombre);
  console.log("  (debe seguir siendo Andrés)");
}

/* ------------------------------------------------------------------ */
/*  Menu                                                               */
/* ------------------------------------------------------------------ */

function menu() {
  console.log("\nPROBADOR DE FUNCIONES");
  console.log("---------------------");
  console.log("  node pruebas.js 1      Listar todos");
  console.log("  node pruebas.js 2      Buscar por ID        (node pruebas.js 2 7)");
  console.log("  node pruebas.js 3      Buscar por carrera   (node pruebas.js 3 contaduria)");
  console.log("  node pruebas.js 4      Aprobados");
  console.log("  node pruebas.js 5      Reprobados");
  console.log("  node pruebas.js 6      Promedio general");
  console.log("  node pruebas.js 7      Mejor estudiante");
  console.log("  node pruebas.js 8      Peor estudiante");
  console.log("  node pruebas.js 9      Conteo por carrera");
  console.log("  node pruebas.js 10     Por semestre         (node pruebas.js 10 4)");
  console.log("  node pruebas.js 11     Mayores de edad      (node pruebas.js 11 20)");
  console.log("  node pruebas.js 12     Reporte general");
  console.log("  node pruebas.js reto   Ranking");
  console.log("  node pruebas.js todo   Todas seguidas");
  console.log("");
}

function ejecutar() {
  if (prueba === undefined) {
    menu();
    return;
  }

  if (prueba === "todo") {
    prueba1(); prueba2(); prueba3(); prueba4(); prueba5(); prueba6();
    prueba7(); prueba8(); prueba9(); prueba10(); prueba11(); prueba12();
    pruebaReto();
    return;
  }

  switch (prueba) {
    case "1":    prueba1();    break;
    case "2":    prueba2();    break;
    case "3":    prueba3();    break;
    case "4":    prueba4();    break;
    case "5":    prueba5();    break;
    case "6":    prueba6();    break;
    case "7":    prueba7();    break;
    case "8":    prueba8();    break;
    case "9":    prueba9();    break;
    case "10":   prueba10();   break;
    case "11":   prueba11();   break;
    case "12":   prueba12();   break;
    case "reto": pruebaReto(); break;
    default:
      console.log(`\nNo existe la prueba "${prueba}".`);
      menu();
  }
}

ejecutar();