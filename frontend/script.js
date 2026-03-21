

// URL API

const API = "http://localhost:3000/alumnos"

//Cargar alumno

const cargarAlumnos = async () => {
    try {
        const res = await fetch(API)
        const alumnos = await res.json()

        let html = ""  // Variable para almacenar el HTML de la tabla dinamicamente generado
        alumnos.forEach(a => {
            html += `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.nombre}</td>
                    <td>${a.apellido}</td>
                    <td>${a.telefono}</td>
                    <td>${a.direccion}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarAlumno(${a.id}, '${a.nombre}', '${a.apellido}', '${a.telefono}', '${a.direccion}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarAlumno(${a.id}')">Eliminar</button>
                    </td>
                </tr>
            `
        })
        document.getElementById("TablaBody").innerHTML = html
    } catch (error) {
        console.error("Error al cargar los alumnos:", error)
    }
}

cargarAlumnos();