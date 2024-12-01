     // Función para cargar los usuarios desde la ruta /admin-users
     async function loadUsers() {
        try {
            // Realizamos la petición a la ruta /admin-users
            const response = await fetch('/admin-users');
            
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }

            // Convertimos la respuesta en formato JSON
            const users = await response.json();

            // Seleccionamos el cuerpo de la tabla donde se insertarán los datos
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = ''; // Limpiar cualquier contenido previo

            // Insertamos cada usuario en la tabla
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4 border">${user.id}</td>
                    <td class="py-2 px-4 border">${user.email}</td>
                    <td class="py-2 px-4 border">${user.role}</td>
                    <td class="py-2 px-4 border text-center">
                        <button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
            alert('Hubo un error al cargar los usuarios. Por favor, inténtalo nuevamente.');
        }
    }

    // Función para cerrar sesión
    function logout() {
        document.cookie = "token=; Max-Age=0; path=/;";
        window.location.href = "/";
    }

    // Cargar los usuarios al cargar la página
    window.onload = loadUsers;