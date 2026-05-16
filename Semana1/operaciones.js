const operaciones = {

    suma() {
        var cantidad1 = parseFloat(document.getElementById("cantidad1").value) || 0;
        var cantidad2 = parseFloat(document.getElementById("cantidad2").value) || 0;
        document.getElementById("resultado").innerHTML = cantidad1 + cantidad2;
    },

    resta() {
        var cantidad1 = parseFloat(document.getElementById("cantidad1").value) || 0;
        var cantidad2 = parseFloat(document.getElementById("cantidad2").value) || 0;
        document.getElementById("resultado").innerHTML = cantidad1 - cantidad2;
    },

    multiplicacion() {
        var cantidad1 = parseFloat(document.getElementById("cantidad1").value) || 0;
        var cantidad2 = parseFloat(document.getElementById("cantidad2").value) || 0;
        document.getElementById("resultado").innerHTML = cantidad1 * cantidad2;
    },

    division() {
        var cantidad1 = parseFloat(document.getElementById("cantidad1").value) || 0;
        var cantidad2 = parseFloat(document.getElementById("cantidad2").value) || 0;

        if (cantidad1 === 0 || cantidad2 === 0) {
            document.getElementById("resultado").innerHTML = "No se puede dividir entre 0";
            return;
        }
        document.getElementById("resultado").innerHTML = cantidad1 / cantidad2;
    }
};