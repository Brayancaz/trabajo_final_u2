document.addEventListener('DOMContentLoaded', function() {
    // Se inicia definiendo la clase Estudiante
    class Estudiante {
        constructor(nombres, apellidos, direccion, correo, celular) {
            this.nombres = nombres;
            this.apellidos = apellidos;
            this.direccion = direccion;
            this.correo = correo;
            this.celular = celular;
        }
    }

    // Se crea el objeto para agregar los registros de estudiantes
    class Agrega {
        // Función para agregar el estudiante a la lista
        agregaEstudiante(estudiante) {
            const list = document.getElementById('lista_estudiantes').getElementsByTagName('tbody')[0];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${estudiante.nombres}</td>
                <td>${estudiante.apellidos}</td>
                <td>${estudiante.direccion}</td>
                <td>${estudiante.correo}</td>
                <td>${estudiante.celular}</td>
                <td><a href="#" class="delete">X</a> </td>
            `;
            list.appendChild(row);
        }

        // Función para mostrar una alerta al ingresar
        mostrarAlerta(mensaje, classNombre) {
            const div = document.createElement('div');
            div.className = `alert ${classNombre}`;
            div.appendChild(document.createTextNode(mensaje));
                
            // Verificar si el elemento .contenedor existe antes de intentar insertar la alerta
            const contenedor = document.querySelector(`.contenedor`);            
            if (contenedor) {
                const form = document.querySelector(`#registro`);
                contenedor.insertBefore(div, form);
                setTimeout(() => {
                    document.querySelector('.alert').remove();
                }, 2000);
                } 
            else {
                console.error("No se encontró el elemento con la clase .contenedor");
            }
        }

        // Función para borrar un estudiante
        borrarestudiante(target) {
            if (target.className === 'delete') {
                target.parentElement.parentElement.remove();
            }
        }

        // Función para limpiar los campos del formulario
        clearFields() {
            document.getElementById('nombres').value = '';
            document.getElementById('apellidos').value = '';
            document.getElementById('direccion').value = '';
            document.getElementById('correo').value = '';
            document.getElementById('celular').value = '';
        }
    }

    // Clase para manejar el almacenamiento local
    class Store {
        static getEstudiantes() {
            let estudiantes;
            if (localStorage.getItem('estudiantes') === null) {
                estudiantes = [];
            } else {
                estudiantes = JSON.parse(localStorage.getItem('estudiantes'));
            }
            return estudiantes;
        }

        static displayEstudiantes() {
            const estudiantes = Store.getEstudiantes();

            estudiantes.forEach(function (estudiante) {
                const agregaUI = new Agrega();
                agregaUI.agregaEstudiante(estudiante);
            });
        }

        static addEstudiante(estudiante) {
            const estudiantes = Store.getEstudiantes();
            estudiantes.push(estudiante);
            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
        }

        static removeEstudiante(celular) {
            const estudiantes = Store.getEstudiantes();
            estudiantes.forEach(function (estudiante, index) {
                if (estudiante.celular === celular) {
                    estudiantes.splice(index, 1);
                }
            });
            localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
        }
    }

    // Se carga el evento DOMContentLoaded para mostrar los estudiantes guardados localmente
    //document.addEventListener('DOMContentLoaded', Store.displayEstudiantes());

    document.addEventListener('DOMContentLoaded',Store.displayEstudiantes() );

    // Event listener para agregar estudiantes
    document.getElementById('registro-estudiante').addEventListener('submit', function (e) {
        //esto ayuda a evitar que se borre inmediatamente por el submit
        e.preventDefault();
        // Obtener valores del formulario
        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const direccion = document.getElementById('direccion').value;
        const correo = document.getElementById('correo').value;
        const celular = document.getElementById('celular').value;

        // Instanciar un estudiante
        const estudiante = new Estudiante(nombres, apellidos, direccion, correo, celular);

        // Instanciar objeto AgregaUI
        const agregaUI = new Agrega();

        // Validar que los campos no estén vacíos
        if (nombres === '' || apellidos === '' || direccion === '' || correo === '' || celular === '') {
            // Mostrar alerta de error
            agregaUI.mostrarAlerta('Por favor, complete todos los campos', 'alert-danger');

        } else {
            // Agregar estudiante a la lista
            agregaUI.agregaEstudiante(estudiante);

            // Mostrar alerta de éxito
            agregaUI.mostrarAlerta('Estudiante agregado', 'alert-success');

            // Agregar a localStorage
            Store.addEstudiante(estudiante);

            // Limpiar campos del formulario
            agregaUI.clearFields();
        }

       // e.preventDefault();
    });

    // Event listener para borrar estudiantes
    document.getElementById('lista_estudiantes').addEventListener('click', function (e) {
        e.preventDefault();
        // Instanciar objeto AgregaUI
        const agregaUI = new Agrega();

        // Borrar estudiante
        agregaUI.borrarestudiante(e.target);

        // Borrar de localStorage utilizando el celular
        Store.removeEstudiante(e.target.parentElement.previousElementSibling.textContent);

        // Mostrar alerta
        agregaUI.mostrarAlerta('Estudiante eliminado', 'success');

        //e.preventDefault();
    });
});
