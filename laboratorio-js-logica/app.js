const btnEvaluar = document.getElementById("btnEvaluar");
const btnLimpiar = document.getElementById("btnLimpiar");

btnEvaluar.addEventListener("click", evaluarEstudiante);
btnLimpiar.addEventListener("click", limpiarFormulario);

function evaluarEstudiante(){
    const nombre = document.getElementById("nombre").value.trim();
    const carrera = document.getElementById("carrera").value;
    const nota1Texto = document.getElementById("nota1").value;
    const nota2Texto = document.getElementById("nota2").value;
    const nota3Texto = document.getElementById("nota3").value;
    const nota4Texto = document.getElementById("nota4").value;

    if(nombre === "" || carrera === "" || nota1Texto === "" || nota2Texto === "" || nota3Texto === ""){
        mostrarResultado("Debe completar todos los campos.", "danger")
        return;
    }

    const notas = [Number(nota1Texto), Number(nota2Texto), Number(nota3Texto), Number(nota4Texto)];

    if(existeNotaInvalida(notas)){
        mostrarResultado("Cada nota dene estar entre 0 y 20", "warning")
        return;
    }

    const promedio = calcularPromedio(notas);
    const estado = clasificarEstado(promedio);
    /*const notaMayor = notaAlta(notas);
    const notaMenor = notaBaja(notas);*/
    const mayorMenor = notaMayorMenor(notas)
    const aprobadoReprobado = contarEstado(notas)

    const estudiante = {
        nombre: nombre,
        carrera: carrera,
        notas: notas,
        promedio: promedio,
        estado: estado,
        /*notaMayor: notaMayor,
        notaMenor: notaMenor*/
        mayorMenor: mayorMenor,
        aprobadoReprobado: aprobadoReprobado
    };

    mostrarResultado(construirMensaje(estudiante), obtenerColorEstado(estado));
    mostrarResultadoBeca(estudiante.nombre, estudiante.carrera, estudiante.promedio);
    mostrarJSON(estudiante);
    console.table(estudiante);
}

function calcularPromedio(notas){
    let suma = 0;
    for(let i = 0; i < notas.length; i++){
        suma += notas[i];
    }
    return suma / notas.length;
}

function clasificarEstado(promedio){
    if(promedio >= 14){
        return "Aprobado";
    }else if(promedio >= 10){
        return "Recuperación";
    }else{
        return "Reprobado";
    }
}

function existeNotaInvalida(notas){
    for(const nota of notas){
        if(Number.isNaN(nota) || nota < 0 || nota > 20){
            return true;
        }
    }
}

function obtenerColorEstado(estado){
    switch(estado){
        case "Aprobado":
            return "success";
        case "Recuperación":
            return "warning";
        case "Reprobado":
            return "danger";
        default:
            return "secondary";
    }
}

/*function notaAlta(notas){
    let mayor = notas[0];
    for(const nota of notas){
        if(nota > mayor){
            mayor = nota;
        }
    }
    return mayor;
}

function notaBaja(notas){
    let menor = notas[0];
    for(const nota of notas){
        if(nota < menor){
            menor = nota;
        }
    }
    return menor;
}*/

function notaMayorMenor(notas){
    let mayorMenor = [0, 0]
    mayorMenor[0] = notas[0];
    mayorMenor[1] = notas[0];
    for(const nota of notas){
        if(nota > mayorMenor[0]){
            mayorMenor[0] = nota;
        }
        if(nota < mayorMenor[1]){
            mayorMenor[1] = nota;
        }
    }
    return mayorMenor;
}

function contarEstado(notas){
    let aprobadoReprobado = [0,0];
    for(nota of notas){
        if(nota >= 14){
            aprobadoReprobado[0]++
        }else{
            aprobadoReprobado[1]++
        }
    }
    return aprobadoReprobado;
}


//Validar que el nombre tenga minimo 5 caracteres y agregar una nota


function construirMensaje(estudiante){
    return `${estudiante.nombre} obtiene ${estudiante.promedio.toFixed(2)} en la carrera de ${estudiante.carrera} su 
    nota mas alta es ${estudiante.mayorMenor[0]} y su nota mas baja es ${estudiante.mayorMenor[1]}
    , aprobo en ${estudiante.aprobadoReprobado[0]} materias y reprobo en ${estudiante.aprobadoReprobado[1]}`;
}

function mostrarResultado(mensaje, color) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.className = 'alert alert-' + color;
    resultadoDiv.textContent = mensaje;
}

function mostrarJSON(estudiante){
    const salida = document.getElementById("salidaJSON");
    salida.classList.remove("d-none")
    salida.textContent = JSON.stringify(estudiante, null, 2)
}



function limpiarFormulario(){
    document.getElementById("nombre").value = "";
    document.getElementById("carrera").value = ""
    document.getElementById("nota1").value = ""
    document.getElementById("nota2").value = ""
    document.getElementById("nota3").value = "";
     document.getElementById("nota4").value = "";
    document.getElementById("resultado").className = "alert mt-4 d-none"
    document.getElementById("salidaJSON").className = "bg-dark text white p-3 rounded d-none"
}

//Otro div de mensaje el mensaje sera si es de TI  y su pormedio mayor a 18 beca del 100%
//Si es software y promedio mayor a 17 del 80%
//si es de sistemas y promedio mayor a 16 beca del 60%

function mostrarResultadoBeca(nombre, carrera, promedio) {
    const becaDiv = document.getElementById('beca');
    let mensaje = "";

    if (carrera === "TI" && promedio >= 18) {
        mensaje = `¡Excelente! ${nombre} obtiene una beca del 100% 🎓✨`;
    } else if (carrera === "Software" && promedio >= 17) {
        mensaje = `¡Muy bien! ${nombre} obtiene una beca del 80% 🎓✨`;
    } else if (carrera === "Redes" && promedio >= 16) {
        mensaje = `¡Felicitaciones! ${nombre} obtiene una beca del 60% 🎓✨`;
    } else {
        mensaje = `${nombre}, no cumple con los requisitos para obtener una beca.`;
    }
    becaDiv.className = "alert alert-info"; // estilo Bootstrap
    becaDiv.classList.remove("d-none");
    becaDiv.textContent = mensaje;
}
