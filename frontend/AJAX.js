//Funciones de consulta
function getProyects() {
    $.ajax({
        url: 'http://localhost/producto-integrador-mongodb/backend/get_proyects.php',
        type: 'GET',
        success: (data) => {
            let array = JSON.parse(data);
            $.each(array, (index, value) => {
                $("#project-list").append(
                    "<li>" +
                    "<div class='project-container'>" +
                    "<h3 class='project-title' >" +
                    value.nombre + "<span>" +
                    "<button data-proyect-id='" + value._id['$oid']+ "'" +
                    " class='update-project-button ui-button'>" +
                    "Editar proyecto</button></span>" +
                    "<span class='ui-icon ui-icon-closethick delete-project-icon' " +
                    "data-proyect-id='" + value._id['$oid'] + "'></span></h3>" +
                    "<div class='description-container'>" +
                    "<p class='project-description'>" + value.descripcion + "</p>" +
                    "</div>" +
                    "<h3>Tareas</h3>" +
                    "<div class='task-container'>" +
                    "<ul class='task-list'>" + setTasks(value.tareas, value._id['$oid']) +
                    "</ul><button class='task-button ui-button' " +
                    "data-proyect-id='" + value._id['$oid'] + "'>" +
                    "Añadir Tarea</button>" +
                    "</div></button></li>"
                );

                //Aplicar estilo de acordeón a contenedores de proyectos
                $('.project-container').accordion({
                    collapsible: true,
                    active: false
                });

                //Agregar evento a botones de añadir tarea
                $('.task-button').off('click');
                $('.task-button').click((event) => {
                    $("#task-form").dialog({
                        autoOpen: false,
                        modal: true,
                        buttons: [
                            {
                                id: "new-task-button",
                                text: "Crear Tarea",
                                click: () => {
                                    insertTask(event);
                                    $("#task-form").dialog("close");
                                }
                            },
                            {
                                id: "cancel-new-task-button",
                                text: "Cancelar",
                                click: () => {
                                    //Cierra el modal al hacer clic en el botón "Cancelar"
                                    $("#task-form").dialog("close");
                                }
                            }
                        ]
                    });

                    $("#task-form").dialog("open");
                });

                //Agregar evento a botones de editar proyecto
                $('.update-project-button').off('click');
                $('.update-project-button').click((event) => {
                    $("#update-project-form").dialog({
                        autoOpen: false,
                        modal: true,
                        open: () => {
                            //Mostrar valores en los inputs
                            let ID = $(event.target).data('proyect-id');
                            getSingleProject(ID).then((project) => {
                                let name = project.name;
                                let description = project.description
                                $('#update-project-name').val(name);
                                $('#update-project-description').val(description);
                            }).catch((error) => {
                                console.log(error);
                            })
                        },
                        buttons: [
                            {
                                id: "update-project-button",
                                text: "Guardar Cambios",
                                click: () => {
                                    updateProyect(event);
                                    $("#update-project-form").dialog("close");
                                }
                            },
                            {
                                id: "cancel-new-task-button",
                                text: "Cancelar",
                                click: () => {
                                    //Cierra el modal al hacer clic en el botón "Cancelar"
                                    $("#update-project-form").dialog("close");
                                }
                            }
                        ]
                    });

                    $("#update-project-form").dialog("open");
                });

                //Agregar evento de actualización a las tareas
                $('.task-checkbox').off('change');
                $('.task-checkbox').change((event) => {
                    //Asignar datos de la tarea
                    let checkbox = event.target;
                    let ID_proyect = $(checkbox).data('proyect-id');
                    let name = $(checkbox).data('task-name');
                    let finished = 0;
                    if ($(event.target).prop('checked')) {
                        finished = 1;
                    } else {
                        finished = 0;
                    }
                    updateTask(ID_proyect, name, finished, checkbox);
                });

                //Agregar evento de eliminación de proyecto
                $('.delete-project-icon').off('click');
                $('.delete-project-icon').click((event) => {
                    let ID = $(event.target).data('proyect-id');
                    deleteProyect(ID).then(() => {
                        //Reiniciar lista de proyectos
                        $('#project-list').empty();
                        getProyects();
                    }).catch((error) => {
                        console.log(error)
                    });
                });

                //Agregar evento de eliminación de tarea
                $('.delete-task-icon').off('click');
                $('.delete-task-icon').click((event) => {
                    let ID_proyect = $(event.target).data('proyect-id');
                    let name = $(event.target).data('task-name');
                    console.log(name);
                    deleteTask(ID_proyect, name).then(() => {
                        //Eliminar tarea del documento
                        let liElement = $(event.target).parent();
                        $(liElement).remove();
                    }).catch((error) => {
                        console.log(error)
                    });
                });

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Si hubo un error durante la llamada AJAX
            console.log("Error: " + errorThrown);
        }
    });
}

function setTasks(taskArray, ID_proyect) {
    let taskList = "";
    $.each(taskArray, (index, value) => {
        if (value.terminado == 1) {
            //Mostrar el checkbox marcado
            taskList += "<li>" +
                "<label>" +
                "<input type='checkbox' class='task-checkbox'" +
                "data-task-name='" + value.nombre +
                "' data-proyect-id='" + ID_proyect +
                "' checked> " + value.nombre + "</label>" +
                "<span class='ui-icon ui-icon-closethick delete-task-icon'" +
                " data-task-name='" + value.nombre + "' data-proyect-id='" + ID_proyect +
                "' ></span></li>";
        } else {
            //Mostrar el checkbox sin marcar
            taskList += "<li>" +
            "<label>" +
            "<input type='checkbox' class='task-checkbox'" +
            "data-task-name='" + value.nombre +
            "' data-proyect-id='" + ID_proyect +
            "' > " + value.nombre + "</label>" +
            "<span class='ui-icon ui-icon-closethick delete-task-icon'" +
            " data-task-name='" + value.nombre + "' data-proyect-id='" + ID_proyect +
            "' ></span></li>";
        }

    });
    return taskList;
        
}

//Funciones de inserción
function insertProyect() {
    //Recoger los valores del proyecto
    let name = $('#project-name').val();
    let description = $('#project-description').val();

    $.ajax({
        url: 'http://localhost/producto-integrador-mongodb/backend/insert_proyect.php',
        type: 'POST',
        data: { name: name, description: description },
        success: (data) => {
            if (data == 'Record inserted') {
                //Reiniciar listado de proyectos en la página
                $('#project-list').empty();
                getProyects();
            } else {
                //Añadir Dialog de error del servidor
                console.log('No se logró mi pana')
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Si hubo un error durante la llamada AJAX
            reject("Error: " + errorThrown);
        }
    });
}

function insertTask(event) {
    //Recoger los valores del proyecto
    let ID_proyect = $(event.target).data('proyect-id');
    let name = $('#task-name').val();

    $.ajax({
        url: 'http://localhost/producto-integrador-mongodb/backend/insert_task.php',
        type: 'POST',
        data: { ID_proyect: ID_proyect, name: name },
        success: (data) => {
            if (data == 'Record inserted') {
                getSingleProject(ID_proyect).then((project) => {
                    //Selecciona el elemento ul arriba del botón
                    let list = $(event.target).siblings("ul");
                    //Reiniciar listado de tareas en el proyecto
                    $(list).empty();
                    $(list).append(
                        setTasks(project[0].tareas, ID_proyect)
                    );
                })
               
            } else {
                //Añadir Dialog de error del servidor
                
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Si hubo un error durante la llamada AJAX
            reject("Error: " + errorThrown);
        }
    });
}

//Funciones de actualización
function updateProyect(event) {
    
    let ID = $(event.target).data('proyect-id');
    let name = $('#update-project-name').val();
    let description = $('#update-project-description').val();
    //AJAX para actualizar los datos

    $.ajax({
        url: 'http://localhost/producto-integrador-mongodb/backend/update_proyect.php',
        type: 'POST',
        data: { ID: ID, name: name, description: description },
        success: (data) => {
            if (data == 'Record updated') {
                //Cambiar datos del título y descripción del proyecto
                let projectContainer = $(event.target).parent().parent().parent();
                title = projectContainer.children('.project-title');
                desc = projectContainer.find('.project-description');
                //Cambiar solo texto al h3
                $(title).contents().filter(function(){ 
                    return this.nodeType == Node.TEXT_NODE; 
                  })[0].nodeValue = name; 
                desc.text(description);
            } else {
                //Añadir Dialog de error del servidor
                
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Si hubo un error durante la llamada AJAX
            console.log("Error: " + errorThrown);
            
        }
    });
}

function updateTask(ID_proyect, name, finished, checkbox) {
    $.ajax({
        url: 'http://localhost/producto-integrador-mongodb/backend/update_task.php',
        type: 'POST',
        data: {ID_proyect: ID_proyect, name: name, finished: finished},
        success: (data) => {
            if (data == 'Record updated') {

            } else {
                //En caso de no haberse guardado el estado en el servidor
                //el estado del checkbox regresará al de antes de haberlo clickeado
                console.log(data);
                if(finished) {
                   checkbox.prop('checked', false);
                } else {
                    checkbox.prop('checked', true); 
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Si hubo un error durante la llamada AJAX
            console.log("Error: " + errorThrown);
        }
    })
}

//Funciones de eliminacion
function deleteProyect(ID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost/producto-integrador-mongodb/backend/delete_proyect.php',
            type: 'POST',
            data: {ID: ID},
            success: (data) => {
                if (data == 'Record deleted') {
                    resolve();
                } else {
                    reject('Error en el server');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Si hubo un error durante la llamada AJAX
                console.log("Error: " + errorThrown);
            }
        });
    });
}

function deleteTask(ID_proyect, name) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost/producto-integrador-mongodb/backend/delete_task.php',
            type: 'POST',
            data: {ID_proyect: ID_proyect ,name: name},
            success: (data) => {
                console.log(data);
                if (data == 'Record deleted') {
                    resolve();
                } else {
                    reject('Error en el server');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Si hubo un error durante la llamada AJAX
                console.log("Error: " + errorThrown);
            }
        });
    });
    
}

//Función para obtener un solo proyecto
function getSingleProject(ID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost/producto-integrador-mongodb/backend/get_single_proyect.php',
            type: 'GET',
            data: { ID: ID },
            success: (data) => {
                let project = JSON.parse(data);
                resolve(project);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Si hubo un error durante la llamada AJAX
                reject("Error: " + errorThrown);
            }
        });
    })

}