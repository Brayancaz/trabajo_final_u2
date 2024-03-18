document.addEventListener('DOMContentLoaded', function() {
/*Se inicia definiendo la clase estudiantes, dentro del cual voy a detallar el constructor  donde
se indica las 5 propidades el objeto estudiantes*/
class Estudiante {
    constructor(nombres, apellidos, direccion, correo, celular) {
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.direccion = direccion;
        this.correo = correo;
        this.celular = celular;
    }
}
/* Se crea el objeto para agregar los registros de estudiantes */
class agrega{
    /*****funcion para que se agregue el estudiante a la lista *******/
    agregaEstudiante(estudiante){
        const list = document.getElementById('lista_estudiantes').getElementsByTagName('tbody')[0];
        /*Se crea las filas de la tabla para los elementos*/
        const row = document.createElement('tr');
        /*Se procede a insertar las columnas */
        row.innerHTML = `
        <td>${estudiante.nombres}</td>
        <td>${estudiante.apellidos}</td>
        <td>${estudiante.direccion}</td>
        <td>${estudiante.correo}</td>
        <td>${estudiante.celular}</td>
        <td><a href="#" class="delete">X</a> </td>
        `;
        /*Se procede a agregar como hijos la informacion del ROW*/
        list.appendChild(row)
    }
    /**************************************************************/
    /*Se arma codigo para mostrar una alerta al ingresa*/
    mostrarAlerta(mensaje,classNombre){
        const div = document.createElement('div');
        div.className = `alert ${classNombre}`;
        div.appendChild(document.createTextNode(mensaje));

        const contenedor = document.querySelector(`.contenedor`);
        const form = document.querySelector(`#registro`);

        contenedor.insertBefore(div, form);
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    } 
    /**************************************************************/
    borrarestudiante(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('nombres').value = '';
        document.getElementById('apellidos').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('correo').value = '';
        document.getElementById('celular').value = '';
    }
}

/****************** guardando localmente*******************/
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
            const agregaUI = new agrega();
            agregaUI.agregarEstudiante(estudiante);
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
/*****************/


// Se carga el evento DOMContentLoaded para mostrar los estudiantes guardados localmente
document.addEventListener('DOMContentLoaded', Store.displayEstudiantes());
// Event listeners para agregar estudiantes
document.getElementById('registro-estudiante').addEventListener('submit', function (e) {
    // Obtener valores del formulario
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('correo').value;
    const celular = document.getElementById('celular').value;

    // Instanciar un estudiante
    const estudiante = new estudiante(nombres, apellidos, direccion, correo, celular);

    // Instanciar objeto AgregaUI
    const agregaUI = new agrega();

    // Validar
    if (nombres === '' || apellidos === '' || direccion === '' || correo === '' || celular === '') {
        // Mostrar alerta de error
        agregaUI.mostrarAlerta('Por favor, complete todos los campos', 'error');
    } else {
        // Agregar estudiante a la lista
        agregaUI.agregaEstudiante(estudiante);

        // Mostrar alerta de éxito
        agregaUI.mostrarAlerta('Estudiante agregado', 'success');

        // Agregar a localStorage
        Store.addEstudiante(estudiante);

        // Limpiar campos del formulario
        agregaUI.clearFields();
    }

    e.preventDefault();
});

// Event listener para borrar estudiantes
document.getElementById('lista_estudiantes').addEventListener('click', function (e) {
    // Instanciar objeto AgregaUI
    const agregaUI = new agrega();

    // Borrar estudiante
    agregaUI.borrarestudiante(e.target);

    // Borrar de localStorage utilizando el celular
    Store.removeEstudiante(e.target.parentElement.previousElementSibling.textContent);

    // Mostrar alerta
    agregaUI.mostrarAlerta('Estudiante eliminado', 'success');

    e.preventDefault();
});
});