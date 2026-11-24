
// ========================================
// EDU NOTAS - SISTEMA DE GESTIÓN ACADÉMICA
// ========================================

// Elementos del formulario
const gradeForm = document.getElementById("gradeForm");
const errorMessage = document.getElementById("errorMessage");

const emptyState = document.getElementById("emptyState");
const report = document.getElementById("report");

// Elementos de resultados
const studentName = document.getElementById("studentName");
const studentCareer = document.getElementById("studentCareer");
const averageElement = document.getElementById("average");
const approvedElement = document.getElementById("approved");
const failedElement = document.getElementById("failed");
const statusElement = document.getElementById("status");
const gradesList = document.getElementById("gradesList");
const finalMessage = document.getElementById("finalMessage");

const newStudentBtn = document.getElementById("newStudentBtn");

// Constantes del sistema
const TOTAL_NOTAS = 5;
const NOTA_MINIMA = 0;
const NOTA_MAXIMA = 5;
const NOTA_APROBACION = 3.5;


// ========================================
// EVENTO PRINCIPAL DEL FORMULARIO
// ========================================

gradeForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Obtener datos personales
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const carrera = document.getElementById("carrera").value.trim();

    // Arreglo de calificaciones
    let calificaciones = [];

    // Obtener las cinco notas
    for (let i = 1; i <= TOTAL_NOTAS; i++) {

        const input = document.getElementById(`nota${i}`);
        const nota = input.value.trim();

        // Validar que la nota no esté vacía
        if (nota === "") {
            mostrarError(`Debes ingresar la nota ${i}.`);
            input.focus();
            return;
        }

        const notaNumerica = Number(nota);

        // Validar rango de notas
        if (
            !Number.isFinite(notaNumerica) ||
            notaNumerica < NOTA_MINIMA ||
            notaNumerica > NOTA_MAXIMA
        ) {
            mostrarError(
                `La nota ${i} es inválida. Ingresa un valor entre 0.0 y 5.0.`
            );
            input.focus();
            return;
        }

        calificaciones.push(notaNumerica);
    }

    // Validar información personal
    if (!nombre || !apellido || !carrera) {
        mostrarError("Completa todos los datos del estudiante.");
        return;
    }

    // Ocultar mensajes de error
    ocultarError();

    // ========================================
    // CÁLCULO DE CALIFICACIONES
    // ========================================

    let definitiva = 0;
    let aprobado = 0;
    let reprobado = 0;

    // Sumar notas y contar aprobadas/reprobadas
    for (let i = 0; i < TOTAL_NOTAS; i++) {

        definitiva += calificaciones[i];

        if (calificaciones[i] >= NOTA_APROBACION) {
            aprobado++;
        } else {
            reprobado++;
        }
    }

    // Calcular promedio definitivo
    definitiva /= TOTAL_NOTAS;

    // Redondear a dos decimales
    definitiva = Math.round((definitiva + Number.EPSILON) * 100) / 100;

    // ========================================
    // DETERMINAR ESTADO DEL ESTUDIANTE
    // ========================================

    let estado;

    if (definitiva >= NOTA_APROBACION) {
        estado = "Aprobado";
    } else {
        estado = "Reprobado";
    }

    // ========================================
    // MOSTRAR RESULTADOS
    // ========================================

    mostrarResultados(
        nombre,
        apellido,
        carrera,
        definitiva,
        aprobado,
        reprobado,
        calificaciones,
        estado
    );

});


// ========================================
// FUNCIÓN PARA MOSTRAR RESULTADOS
// ========================================

function mostrarResultados(
    nombre,
    apellido,
    carrera,
    definitiva,
    aprobado,
    reprobado,
    calificaciones,
    estado
) {

    // Mostrar información del estudiante
    studentName.textContent = `${nombre} ${apellido}`;
    studentCareer.textContent = carrera;

    // Mostrar definitiva
    averageElement.textContent = definitiva.toFixed(2);

    // Mostrar estadísticas
    approvedElement.textContent = aprobado;
    failedElement.textContent = reprobado;

    // Configurar estado
    statusElement.textContent = estado;

    statusElement.className = "status-badge";

    if (estado === "Aprobado") {

        statusElement.classList.add("approved");

        finalMessage.textContent =
            "🎉 ¡Felicitaciones! El estudiante ha aprobado usted es la mera monda compae. ¡Sigue así!";

        finalMessage.className = "final-message approved";

    } else {

        statusElement.classList.add("failed");

        finalMessage.textContent =
            "📚 El estudiante reprobo, es un traga sables. ¡Es momento de seguir esforzándose!";

        finalMessage.className = "final-message failed";
    }

    // ========================================
    // MOSTRAR NOTAS INDIVIDUALES
    // ========================================

    gradesList.innerHTML = "";

    calificaciones.forEach((nota, index) => {

        const fila = document.createElement("div");
        fila.className = "grade-row";

        fila.style.animationDelay = `${index * 0.1}s`;

        const etiqueta = document.createElement("span");
        etiqueta.className = "grade-label";
        etiqueta.textContent = `Calificación ${index + 1}`;

        const valor = document.createElement("span");

        const notaAprobada = nota >= NOTA_APROBACION;

        valor.className = notaAprobada
            ? "grade-value approved"
            : "grade-value failed";

        valor.textContent = `${nota.toFixed(2)} ${notaAprobada ? "✓" : "✗"}`;

        fila.appendChild(etiqueta);
        fila.appendChild(valor);

        gradesList.appendChild(fila);

    });

    // Cambiar vista
    emptyState.classList.add("hidden");
    report.classList.remove("hidden");

    // Animación de entrada
    report.style.animation = "none";

    void report.offsetWidth;

    report.style.animation = "fadeUp 0.6s ease";

    // Desplazar hacia los resultados en pantallas pequeñas
    if (window.innerWidth <= 850) {
        document.getElementById("resultsCard").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

}


// ========================================
// FUNCIÓN PARA MOSTRAR ERRORES
// ========================================

function mostrarError(mensaje) {

    errorMessage.textContent = "⚠️ " + mensaje;

    errorMessage.classList.add("show");

}

function ocultarError() {

    errorMessage.textContent = "";

    errorMessage.classList.remove("show");

}


// ========================================
// LIMPIAR FORMULARIO
// ========================================

gradeForm.addEventListener("reset", function() {

    ocultarError();

    // Ocultar reporte
    report.classList.add("hidden");

    // Mostrar pantalla inicial
    emptyState.classList.remove("hidden");

});


// ========================================
// REGISTRAR OTRO ESTUDIANTE
// ========================================

newStudentBtn.addEventListener("click", function() {

    // Reiniciar formulario
    gradeForm.reset();

    // Volver al inicio
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
