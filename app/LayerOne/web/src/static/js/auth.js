document.addEventListener("DOMContentLoaded", function () {
    // Enfoca automáticamente el input "formControlLg" cuando se carga la página
    document.getElementById("formControlLg").focus();
});
// JavaScript para controlar los estilos
document.getElementById("siguiente").addEventListener("click", function () {
    document.getElementById("correoid").style.display = "none"; // Oculta el campo
    document.getElementById("siguiente").style.display = "none"; // Oculta el campo
    document.getElementById("login").style.display = "block"; // Muestra el botón de inicio de sesión
    document.getElementById("passinput").style.display = "block"; // Muestra el botón
    // Enfocar automáticamente el input "passinput"
    document.getElementById("passinput2").focus();
});

// Captura el evento de pulsación de tecla en los campos de entrada
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && document.getElementById("siguiente").style.display != "none") {
        event.preventDefault(); // Evita que el formulario se envíe por defecto
        document.getElementById("siguiente").click(); // Simula el clic en el botón "Siguiente"
    }
});