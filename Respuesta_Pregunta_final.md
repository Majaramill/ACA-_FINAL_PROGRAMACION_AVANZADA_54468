# Respuestas del ejercicio

Proyecto: **Gestión de estudiantes con Node.js, JavaScript y Express**

---

## Pregunta final del enunciado

> **¿Qué ventajas tiene dividir el programa en diferentes funciones en lugar de escribir todo el código en un solo bloque?**

Dividir el programa en funciones independientes trajo seis ventajas concretas en este proyecto:

### 1. Reutilización real, no teórica

La función `generarReporte()` no vuelve a recorrer el array ni repite un solo cálculo. Llama a funciones que ya estaban escritas y probadas:

```js
return {
  totalEstudiantes: estudiantes.length,
  aprobados: obtenerAprobados(estudiantes).length,
  reprobados: obtenerReprobados(estudiantes).length,
  promedioGeneral: calcularPromedioGeneral(estudiantes),
  mejorEstudiante: mejorEstudiante(estudiantes),
  peorEstudiante: peorEstudiante(estudiantes)
};
```

Son siete líneas que aprovechan cinco funciones anteriores. En un bloque único habría que repetir cinco ciclos completos, y cada repetición es una oportunidad más de cometer erroores.

### 2. Un solo lugar para cambiar cada cosa

La nota mínima de aprobación está en una constante al inicio del archivo de funciones:

```js
const NOTA_MINIMA = 3.0;
```

Si  por ejemplo la institución sube la exigencia a 3.2, se cambia esa línea solamente lo que haría que el resto del sistema actualice, y se evita el riesgo de tener que camabiar cada nota minima por aparte

### 3. Se puede probar y depurar por partes

Si el promedio general sale mal, el error está en `calcularPromedioGeneral()` y no hay que revisar el archivo completo. Cada función es una unidad pequeña con una entrada y una salida verificables.

Esto se comprobó en la práctica: el proyecto incluye un archivo `pruebas.js` que permite ejecutar **una sola función** desde la terminal, sin correr el programa entero:

```bash
node pruebas.js 6        # solo el promedio general
node pruebas.js 2 99     # solo la búsqueda por ID, con un ID inexistente
```

Eso no sería posible con todo el código en un mismo bloque.

### 4. Independencia de la presentación

Esta es la ventaja más visible del proyecto, y se puede demostrar ejecutándolo.

Las funciones **retornan** datos en lugar de imprimirlos:

```js
function buscarPorId(estudiantes, id) {
  ...
  return estudiantes[i];   // no hace console.log
}
```

Gracias a eso, las mismas funciones alimentan dos salidas completamente distintas sin cambiar una sola línea:

| Salida | Archivo que la presenta | Resultado |
|---|---|---|
| Consola | `consola.js` | texto con formato y separadores |
| API REST | `src/rutas.js` | JSON con códigos HTTP |

Si `buscarPorId()` tuviera un `console.log` adentro, solo serviría para la consola: Express no puede devolver un `console.log` como respuesta HTTP. Y si mañana se pidiera una interfaz web o una exportación a Excel, bastaría con agregar otra capa de presentación, porque la lógica seguiría intacta.

El mismo dato incluso se interpreta distinto según quién lo reciba: cuando no existe el estudiante, la función devuelve `null`, la consola lo traduce a "Estudiante no encontrado" y Express lo traduce a un código **404**.

### 5. El código se explica solo

Leer `mayoresDeEdad(estudiantes, 22)` comunica la intención de inmediato. Un ciclo `for` suelto con un `if` adentro obliga a reconstruir mentalmente qué está haciendo antes de poder modificarlo.

### 6. Trabajo en equipo y control de versiones

Varias personas pueden escribir funciones distintas en paralelo mientras respeten qué recibe y qué retorna cada una. Además, en Git los conflictos son mucho menos frecuentes cuando el código está repartido en archivos y funciones pequeñas que cuando todo vive en un solo bloque.

---

