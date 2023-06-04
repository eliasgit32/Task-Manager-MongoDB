db.projects.insertOne(
    {
        nombre: "Proyect 2",
        descripcion: "xd",
        tareas: [
            {nombre: "2Hacer interfaz de conexión con la base de datos",
            terminado: 0},
            {nombre: "2Desarrollar operaciones CRUD",
            terminado: 0},
            {nombre: "2Crear interfaz gráfica",
            terminado: 0},
            {nombre: "2Ejecutar operaciones desde interfaz gráfica",
            terminado: 0},
        ]
    }
)

db.createUser(
    {
      user :  "mongoadmin",
      pwd :  "123456",
      roles :  [
          {  role :  "readWrite",  db :  "taskManager"  }
      ]
    }
);