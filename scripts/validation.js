document.addEventListener('DOMContentLoaded', () => {
    // Elementos del formulario y botón de enviar
    var form = document.getElementById('registrationForm');
    var submitButton = document.getElementById('submitButton');

    // Campos del formulario con sus validaciones y mensajes de error
    var fields = [
        { id: 'fullName', validate: validateFullName, errorMessage: 'Nombre completo debe tener más de 6 letras y al menos un espacio.' },
        { id: 'email', validate: validateEmail, errorMessage: 'Email no es válido.' },
        { id: 'password', validate: validatePassword, errorMessage: 'Contraseña debe tener al menos 8 caracteres, formados por letras y números.' },
        { id: 'confirmPassword', validate: validateConfirmPassword, errorMessage: 'Las contraseñas no coinciden.' },
        { id: 'age', validate: validateAge, errorMessage: 'Edad debe ser un número entero mayor o igual a 18.' },
        { id: 'phone', validate: validatePhone, errorMessage: 'Teléfono debe tener al menos 7 dígitos sin espacios ni caracteres especiales.' },
        { id: 'address', validate: validateAddress, errorMessage: 'Dirección debe tener al menos 5 caracteres, con letras, números y un espacio en el medio.' },
        { id: 'city', validate: validateCity, errorMessage: 'Ciudad debe tener al menos 3 caracteres.' },
        { id: 'postalCode', validate: validatePostalCode, errorMessage: 'Código Postal debe tener al menos 3 caracteres.' },
        { id: 'dni', validate: validateDni, errorMessage: 'DNI debe ser un número de 7 u 8 dígitos.' }
    ];

    // Obtener elementos del DOM relacionados con el título dinámico
    var fullNameInput = document.getElementById('fullName');
    var formTitle = document.getElementById('formTitle');
    var currentFullName = ''; // Variable para almacenar el nombre completo actual

    // Evento para actualizar el título dinámico
    fullNameInput.addEventListener('input', () => {
        currentFullName = fullNameInput.value.trim(); // Actualizar el nombre completo actual
        updateFormTitle(); // Llamar a la función para actualizar el título del formulario
    });

    // Función para actualizar el título del formulario
    function updateFormTitle() {
        formTitle.textContent = currentFullName === '' ? 'HOLA' : `HOLA ${currentFullName}`;
    }

    // Eventos y funciones para la validación del formulario y envío de datos
    fields.forEach(field => {
        var input = document.getElementById(field.id);
        var errorSpan = document.getElementById(field.id + 'Error');

        input.addEventListener('blur', () => {
            var isValid = field.validate(input.value);
            errorSpan.textContent = isValid ? '' : field.errorMessage;
        });

        input.addEventListener('focus', () => {
            errorSpan.textContent = '';
        });
    });

    submitButton.addEventListener('click', () => {
        var formIsValid = true;
        var formData = {};

        fields.forEach(field => {
            var input = document.getElementById(field.id);
            var errorSpan = document.getElementById(field.id + 'Error');
            var isValid = field.validate(input.value);

            if (!isValid) {
                errorSpan.textContent = field.errorMessage;
                formIsValid = false;
            } else {
                formData[field.id] = input.value;
            }
        });

        if (formIsValid) {
            sendDataToServer(formData);
        } else {
            alert('Hay errores en el formulario. Por favor, corrígelos e intenta de nuevo.');
        }
    });

    // Función para enviar los datos del formulario al servidor
    function sendDataToServer(formData) {
        var url = 'https://jsonplaceholder.typicode.com/users';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            showResultModal(true, data);
            saveDataToLocalstorage(data);
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            showResultModal(false, error);
        });
    }

    // Función para mostrar el modal con el resultado de la operación
    function showResultModal(success, data) {
        var modal = document.getElementById('myModal');
        var modalMessage = document.getElementById('modalMessage');

        if (success) {
            modalMessage.innerHTML = `
                <h2>Suscripción Exitosa</h2>
                <p>¡Gracias por suscribirte! Los datos recibidos son:</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        } else {
            modalMessage.innerHTML = `
                <h2>Error en la Suscripción</h2>
                <p>Ha ocurrido un error al procesar tu suscripción. Detalles:</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        }

        modal.style.display = 'block';

        // Cerrar el modal al hacer clic en el botón de cerrar (×)
        var closeButton = modal.querySelector('.close');
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        // Cerrar el modal al hacer clic fuera de él
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Función para guardar los datos recibidos en LocalStorage
    function saveDataToLocalstorage(data) {
        localStorage.setItem('formData', JSON.stringify(data));
    }

    // Funciones de validación del formulario
    function validateFullName(value) {
        return value.length > 6 && /\s/.test(value);
    }

    function validateEmail(value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
    }

    function validatePassword(value) {
        return value.length >= 8 && /\d/.test(value) && /[a-zA-Z]/.test(value);
    }

    function validateConfirmPassword(value) {
        var password = document.getElementById('password').value;
        return value === password;
    }

    function validateAge(value) {
        var age = parseInt(value, 10);
        return Number.isInteger(age) && age >= 18;
    }

    function validatePhone(value) {
        return /^\d{7,}$/.test(value);
    }

    function validateAddress(value) {
        return value.length >= 5 && /\d/.test(value) && /[a-zA-Z]/.test(value) && /\s/.test(value);
    }

    function validateCity(value) {
        return value.length >= 3;
    }

    function validatePostalCode(value) {
        return value.length >= 3;
    }

    function validateDni(value) {
        return /^\d{7,8}$/.test(value);
    }
});
