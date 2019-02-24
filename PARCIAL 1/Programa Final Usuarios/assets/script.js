    $(document).ready( function(){

        //Una vez que este listo el documento obtendremos la lista de usuarios y la mostraremos.
        getUsuarios();

        //Programacion del boton act para obtener datos del input.
        $("#act").on("click", function(event){
            console.log(event);
            var usuario = { }; //Creacion de objeto con la info necesaria.
            usuario.email = $("#email").val();
            usuario.pass = $("#pass").val();
            //Invocamos a la funcion para llamadas post y mandamos el obeto.
            sendPOSTRequest(usuario);
        });

        $('#editModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget); // el botton que invoca al modal
            var email = button.data('email'); //  data-* attributes
            var pass = button.data('pass');
            // se puede realizar una busqueda del objeto usando la misma API si tuviera mas propiedades.
            var modal = $(this);
            modal.find('.modal-title').text('Edicion del Usuario: ' + email);
            modal.find('.modal-body input#emailEdit').val(email);
            modal.find('.modal-body input#passEdit').val(pass);
            modal.find('.modal-footer button#SaveEdit').unbind().on('click', (event)=>{
                console.log("Guardando Usuario: " + email);
                var emailNew =  modal.find('.modal-body input#emailEdit').val();
                var passNew =  modal.find('.modal-body input#passEdit').val();
                var usuario = {'passOld' : pass, 'passNew' : passNew , 'emailNew' : emailNew };
                console.log(usuario);
                sendPUTRequest(usuario);
                modal.modal('hide');
            });
        });

    });

    function getUsuarios(){
        //LLamada GET para obtener los usuarios
        //Se muestra resultado con una lista en HTML
        //Se utiliza un ciclo for y se genera el codigo HTML
        //Usando Jquery se coloca el HTML en la lista.         
        $.get("http://localhost:3000/usuarios", function(data){
            var listHTML = "";
            console.log(data);
            data.forEach(usuario => {                
                listHTML += "<tr>" +                            
                            "<td>"+ usuario.email + "</td>  " +
                            "<td>"+ usuario.pass + "</td>  " +
                            "<td><button type='button' class='edit btn btn-sm' data-pass='"+ usuario.pass +"' data-email='" + usuario.email + "' data-toggle='modal' data-target='#editModal'> <i class='material-icons'> edit </i> </button></td> " +
                            "<td><button type='button' class='delete btn btn-sm' data-email='"+ usuario.email +"'> <i class='material-icons'>delete</i> </button></td>" + 
                            "</tr>";
            });
            $("#usrTable").html(listHTML);

            //Programacion para los botones delete
            $(".delete").on("click", (event) =>{
                console.log("Button delete");
                console.log(event.target);
                sendDELETERequest({ "email" : event.target.dataset["email"] });
            });
        });
    }

    function sendPOSTRequest(body_object){
        //Llamada post al backend usando jquery.
        console.log("Objeto enviado por POST: " );
        console.log(body_object);
        
        $.post("http://localhost:3000/usuarios", body_object , 
        function(){
            alert("Usuario guardado.");
        });        
        getUsuarios();
    }

    function sendDELETERequest(body_object) {
        //Llamada delete al backend por medio de jquery

        $.ajax({
            method: "DELETE",
            url: "http://localhost:3000/usuarios",
            data: body_object
            })
            .done(function( msg ) {
                alert( "Usuario eliminado: " + body_object.email );
            })
            .fail(function(msg){
                alert("Error al eliminar usuario: " + body_object.email)
            }); 
            getUsuarios();
    }

    function sendPUTRequest(body_object) {
        //Llamada update al backend por medio de jquery

        $.ajax({
            method: "PUT",
            url: "http://localhost:3000/usuarios",
            data: body_object
            })
            .done(function( msg ) { 
                alert( "Usuario editado: " + body_object.emailOld );
            })
            .fail(function(msg){
                alert("Error al editar usuario: " + body_object.emailOld)
            }); 
            getUsuarios();
    }