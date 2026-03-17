
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');




const app = express();
app.use(cors()); //cors es util para permitir que el frontend  pueda hacer solicitudes al backend sin problemas de CORS
app.use(express.json()); // middleware hace que el servidor pueda entender las solicitudes con formato JSON



//conexion a la base de datos postgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_alumnos',
    password: 'geo1807',
    port: 5432,
});



// LEER ALUMNOS

app.get("/alumnos", async (req, res) => {
    try {
        
        const resultado = await pool.query("SELECT * FROM alumnos ORDER BY id ASC"); // consulta SQL para obtener todos los alumnos de la tabla "alumnos" ordenados por su ID en orden ascendente
         res.json(resultado.rows); //respuesta en formato JSON con la lista de alumnos

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los alumnos" });
    }
});



//CREAR ALUMNO

app.post("/alumnos", async (req, res) => {
    try {
        const {nombre, apellido, telefono, direccion}  = req.body;
        const resultado = await pool.query(
            "INSERT INTO alumnos (nombre, apellido, telefono, direccion) VALUES ($1, $2, $3, $4) RETURNING *", //consulta SQL para insertar un nuevo alumno en la tabla "alumnos"
            [nombre, apellido, telefono, direccion] // parametros que se pasan a la consulta SQL para evitar inyecciones SQL y asegurar que los datos se manejen de manera segura
        );


        res.json(resultado.rows[0]); //respuesta en formato JSON con el alumno creado

    }catch (error){
        console.error(error);
        res.status(500).json({ error: "Error al crear el alumno"});
    }
    


})


app.put("/alumnos/:id", async (req, res) => {
    try {

        const {id} = req.params;
        const {nombre, apellido, telefono, direccion} = req.body;

        const resultado = await pool.query(
            "UPDATE alumnos SET nombre=$1, apellido=$2, telefono=$3, direccion=$4 WHERE id=$5 RETURNING *", //consulta SQL para actualizar un alumno existente en la tabla "alumnos" basado en su ID
            [nombre, apellido, telefono, direccion, id] // parametros que se pasan a la consulta SQL para evitar inyecciones SQL y asegurar que los datos se manejen de manera segura
        )

        if (resultado.rows.length === 0) {  // length se utiliza para verificar si se encontró un alumno con el ID proporcionado. Si no se encuentra ningún alumno, se devuelve un error 404 indicando que el alumno no fue encontrado.
            return res.status(404).json({ error: "Alumno no encontrado" }); //status 404 se utiliza para indicar que el recurso solicitado (en este caso, el alumno) no fue encontrado en el servidor.

        }
        res.json(resultado.rows[0]); //respuesta en formato JSON con el alumno actualizado
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el alumno" });
    }
    
})




//Eliminar alumno

app.delete("/alumnos/:id", async (req, res) => {
    try {
await pool.query("DELETE FROM alumnos WHERE id = $1", [req.params.id]); //consulta SQL para eliminar un alumno de la tabla "alumnos" basado en su ID

res.json({ message: "Alumno eliminado correctamente" }); //respuesta en formato JSON indicando que el alumno fue eliminado correctamente



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el alumno" });
    }

})








// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto http://localhost:3000');
});