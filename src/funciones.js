/**Activa el modo estricto de JavaScript. Sin él, 
 * el lenguaje perdona errores en silencio; con él, los reporta. */
"use strict"; 
/**
 * =====================================================================
 *  CAPA DE LOGICA
 * =====================================================================
 *  REGLA DEL EJERCICIO: no se usan filter, map, forEach, reduce, find,
 *  some, every ni sort. Todo se resuelve con for, while, do-while, if
 *  y operador ternario.
 *
 *  REGLA DE DISENO: estas funciones NO imprimen nada, solo RETORNAN.
 *  Asi la misma funcion sirve para la consola y para Express.
 * =====================================================================
 */
/**3.0 se usa como corte. Si ese número quedara escrito directamente 
 * en cada función, subir la exigencia a 3.2 
 * obligaría a buscar y cambiar cada aparición, con el riesgo de olvidar una. Permite escalabilidad  */
const NOTA_MINIMA = 3.0;

/* ------------------------------------------------------------------ */
/*  UTILIDADES INTERNAS (evitan repetir codigo)                        */
/* ------------------------------------------------------------------ */

/** Copia superficial de un array usando un for clasico. 
 * crea un array nuevo con los mismos elementos. para evitar modificar el array original */
function clonarLista(lista) {
  const copia = [];
  for (let i = 0; i < lista.length; i++) {
    copia.push(lista[i]);
  }
  return copia;
}

/**prepara un texto para poder compararlo sin importar formato. 
 * "Ingeniería de Sistemas" -> "ingenieria de sistemas" (sin tildes). */
function normalizarTexto(texto) {
  return String(texto) //convierte a string por si acaso
    .trim() //quita espacios de los bordes
    .toLowerCase() //todo a minúsculas
    .normalize("NFD") //descompone caracteres acentuados en dos partes: letra + tilde
    .replace(/[\u0300-\u036f]/g, ""); //borra las tildes que quedaron sueltas
}

/** Redondea a 2 decimales devolviendo un numero (no un string). 
 * Deja un número con dos decimales, siguiendo siendo número.
*/
function redondear(numero, decimales = 2) { 
  const factor = Math.pow(10, decimales); // 10 elevado a 2 =100 
  return Math.round(numero * factor) / factor;  // 3.7399999... * 100 al entero más cercano 374 / 100 3.74
}

/* ------------------------------------------------------------------ */
/*  1. LISTAR TODOS LOS ESTUDIANTES                                    */
/* ------------------------------------------------------------------ */
function listarEstudiantes(estudiantes) { 
  return clonarLista(estudiantes); //devuelve un array nuevo con los mismos elementos, para no modificar el original
}

/* ------------------------------------------------------------------ */
/*  2. BUSCAR UN ESTUDIANTE POR ID                                     */
/* ------------------------------------------------------------------ */
function buscarPorId(estudiantes, id) {
  const idBuscado = Number(id);

  for (let i = 0; i < estudiantes.length; i++) {
    if (estudiantes[i].id === idBuscado) {
      return estudiantes[i]; // encontrado: salimos de una vez
    }
  }
  return null; // no existe
}

/* ------------------------------------------------------------------ */
/*  3. BUSCAR ESTUDIANTES POR CARRERA                                  */
/* ------------------------------------------------------------------ */
function buscarPorCarrera(estudiantes, carrera) {
  const buscada = normalizarTexto(carrera);
  const resultado = [];

  for (let i = 0; i < estudiantes.length; i++) {
    if (normalizarTexto(estudiantes[i].carrera) === buscada) {
      resultado.push(estudiantes[i]);
    }
  }
  return resultado;
}

/* ------------------------------------------------------------------ */
/*  4 y 5. APROBADOS / REPROBADOS                                      */
/* ------------------------------------------------------------------ */

/**
 * Funcion base reutilizada por las dos siguientes.
 * @param {boolean} aprobados true -> promedio >= nota | false -> < nota
 */
function filtrarPorPromedio(estudiantes, nota, aprobados) {
  const resultado = [];

  for (let i = 0; i < estudiantes.length; i++) {
    const promedio = estudiantes[i].promedio;
    const cumple = aprobados ? promedio >= nota : promedio < nota; // ternario

    if (cumple) {
      resultado.push(estudiantes[i]);
    }
  }
  return resultado;
}

function obtenerAprobados(estudiantes, nota = NOTA_MINIMA) {
  return filtrarPorPromedio(estudiantes, nota, true);
}

function obtenerReprobados(estudiantes, nota = NOTA_MINIMA) {
  return filtrarPorPromedio(estudiantes, nota, false);
}

/* ------------------------------------------------------------------ */
/*  6. PROMEDIO GENERAL                                                */
/* ------------------------------------------------------------------ */
function calcularPromedioGeneral(estudiantes) {
  if (estudiantes.length === 0) {
    return 0; // evita division por cero
  }

  let suma = 0;
  let i = 0;

  while (i < estudiantes.length) { // aqui usamos while a proposito
    suma += estudiantes[i].promedio;
    i++;
  }

  return redondear(suma / estudiantes.length);
}

/* ------------------------------------------------------------------ */
/*  7 y 8. MEJOR Y PEOR ESTUDIANTE                                     */
/* ------------------------------------------------------------------ */

/**
 * Funcion base: recorre comparando contra el "campeon" actual.
 * @param {boolean} mayor true -> busca el promedio mas alto
 */
function buscarExtremo(estudiantes, mayor) {
  if (estudiantes.length === 0) {
    return null;
  }

  let elegido = estudiantes[0];

  for (let i = 1; i < estudiantes.length; i++) {
    const actual = estudiantes[i];
    const gana = mayor
      ? actual.promedio > elegido.promedio
      : actual.promedio < elegido.promedio;

    if (gana) {
      elegido = actual;
    }
  }
  return elegido;
}

function mejorEstudiante(estudiantes) {
  return buscarExtremo(estudiantes, true);
}

function peorEstudiante(estudiantes) {
  return buscarExtremo(estudiantes, false);
}

/* ------------------------------------------------------------------ */
/*  9. CONTAR ESTUDIANTES POR CARRERA                                  */
/* ------------------------------------------------------------------ */
function contarPorCarrera(estudiantes) {
  const conteo = {}; // { "Ingeniería de Sistemas": 4, ... }

  for (let i = 0; i < estudiantes.length; i++) {
    const carrera = estudiantes[i].carrera;

    // si la llave no existe arranca en 0, si existe suma 1
    conteo[carrera] = conteo[carrera] === undefined ? 1 : conteo[carrera] + 1;
  }
  return conteo;
}

/* ------------------------------------------------------------------ */
/*  10. BUSCAR POR SEMESTRE                                            */
/* ------------------------------------------------------------------ */
function buscarPorSemestre(estudiantes, semestre) {
  const buscado = Number(semestre);
  const resultado = [];

  for (let i = 0; i < estudiantes.length; i++) {
    if (estudiantes[i].semestre === buscado) {
      resultado.push(estudiantes[i]);
    }
  }
  return resultado;
}

/* ------------------------------------------------------------------ */
/*  11. MAYORES DE CIERTA EDAD                                         */
/* ------------------------------------------------------------------ */
function mayoresDeEdad(estudiantes, edad) {
  const limite = Number(edad);
  const resultado = [];

  for (let i = 0; i < estudiantes.length; i++) {
    if (estudiantes[i].edad > limite) { // estrictamente mayor
      resultado.push(estudiantes[i]);
    }
  }
  return resultado;
}

/* ------------------------------------------------------------------ */
/*  RETO. ORDENAR POR PROMEDIO (ordenamiento por insercion)            */
/* ------------------------------------------------------------------ */
function ordenarPorPromedio(estudiantes, descendente = true) {
  const copia = clonarLista(estudiantes); // NO tocamos el array original

  for (let i = 1; i < copia.length; i++) {
    const actual = copia[i];
    let j = i - 1;

    // corre hacia la derecha a los que van despues del elemento actual
    while (
      j >= 0 &&
      (descendente
        ? copia[j].promedio < actual.promedio
        : copia[j].promedio > actual.promedio)
    ) {
      copia[j + 1] = copia[j];
      j--;
    }
    copia[j + 1] = actual;
  }
  return copia;
}

/* ------------------------------------------------------------------ */
/*  12. REPORTE GENERAL (reutiliza todas las anteriores)               */
/* ------------------------------------------------------------------ */
function generarReporte(estudiantes) {
  const mejor = mejorEstudiante(estudiantes);
  const peor = peorEstudiante(estudiantes);

  return {
    totalEstudiantes: estudiantes.length,
    aprobados: obtenerAprobados(estudiantes).length,
    reprobados: obtenerReprobados(estudiantes).length,
    promedioGeneral: calcularPromedioGeneral(estudiantes),
    mejorEstudiante: mejor,
    peorEstudiante: peor,
    estudiantesPorCarrera: contarPorCarrera(estudiantes)
  };
}

module.exports = {
  NOTA_MINIMA,
  listarEstudiantes,
  buscarPorId,
  buscarPorCarrera,
  obtenerAprobados,
  obtenerReprobados,
  calcularPromedioGeneral,
  mejorEstudiante,
  peorEstudiante,
  contarPorCarrera,
  buscarPorSemestre,
  mayoresDeEdad,
  ordenarPorPromedio,
  generarReporte
};