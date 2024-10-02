// Variables
const listaPokemonElement = document.getElementById('lista-pokemon');
const inputBuscar = document.getElementById('buscar');
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=48';
let todosLosPokemones = [];

// Elementos de info que va a tener el Modal
const modal = document.getElementById('modal-pokemon');
const tituloModal = document.getElementById('titulo-modal');
const imagenModal = document.getElementById('imagen-modal');
const alturaModal = document.getElementById('altura-modal');
const pesoModal = document.getElementById('peso-modal');
const habilidadesModal = document.getElementById('habilidades-modal');
const botonCerrarModal = document.getElementById('cerrar-modal');

// Obtener los Pokemones de la api
function obtenerPokemones() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const pokemones = data.results;
            let promesas = pokemones.map(pokemon => obtenerDatosPokemon(pokemon.url));
            Promise.all(promesas).then(() => {
                todosLosPokemones.sort((a, b) => a.id - b.id); // Ordenar por número de la Pokédex
                mostrarPokemones(todosLosPokemones);
            });
        });
}

// Obtener los datos de un solo Pokemon
function obtenerDatosPokemon(url) {
    return fetch(url)
        .then(response => response.json())
        .then(pokemon => {
            todosLosPokemones.push(pokemon);
        });
}

// Mostrar todos los Pokemones
function mostrarPokemones(pokemones) {
    listaPokemonElement.innerHTML = '';
    pokemones.forEach(pokemon => {
        const cartaPokemon = document.createElement('div');
        cartaPokemon.classList.add('carta-pokemon');

        const esFavorito = verificarFavorito(pokemon.name);

        cartaPokemon.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${capitalizarPrimeraLetra(pokemon.name)}</h3>
            <button class="boton-favorito ${esFavorito ? 'favorito' : ''}" onclick="alternarFavorito('${pokemon.name}')">
                ${esFavorito ? 'Favorito' : 'Agregar a Favoritos'}
            </button>
            <button class="boton-detalles" onclick="mostrarDetallesPokemon(${pokemon.id})">Más Información</button>
        `;

        listaPokemonElement.appendChild(cartaPokemon);
    });
}

// Mostrar las info del Pokemon en el modal
function mostrarDetallesPokemon(idPokemon) {
    const pokemon = todosLosPokemones.find(p => p.id === idPokemon);

    tituloModal.textContent = capitalizarPrimeraLetra(pokemon.name);
    imagenModal.src = pokemon.sprites.front_default;
    alturaModal.textContent = `${pokemon.height / 10} m`;
    pesoModal.textContent = `${pokemon.weight / 10} kg`;
    habilidadesModal.textContent = pokemon.abilities.map(ability => ability.ability.name).join(', ');

    modal.style.display = 'block';
}

// Cerrar el modal (la crucesita)
botonCerrarModal.onclick = function() {
    modal.style.display = 'none';
}

// para ver si el pokmon es favorito
function verificarFavorito(nombrePokemon) { 
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    return favoritos.includes(nombrePokemon);  // Ver si el nombre está en la lista
}

// cambiar estado de favorito
function alternarFavorito(nombrePokemon) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (favoritos.includes(nombrePokemon)) {  // Si ya está en favoritos
        favoritos = favoritos.filter(nombre => nombre !== nombrePokemon);  // sacarlo
    } else {
        favoritos.push(nombrePokemon);  // Agregar si no está
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));  // Guardar la lista actualizada
    refrescarListaPokemones();
}

// Refrescar la lista de pokemones para actualizar el estado de favorito
function refrescarListaPokemones() {
    mostrarPokemones(todosLosPokemones);
}

// Mostrar Pokemon favoritos
function mostrarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const pokemonesFavoritos = todosLosPokemones.filter(pokemon => favoritos.includes(pokemon.name));
    mostrarPokemones(pokemonesFavoritos); // Mostrar solo los favoritos
}

// poner en mayuscula la primera letra de los nombres de los pokemones
function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

// funcion para buscar (buscar por nombre o ID)
inputBuscar.addEventListener('input', function() {
    const terminoBusqueda = inputBuscar.value.toLowerCase();
    const pokemonesFiltrados = todosLosPokemones.filter(pokemon =>
        pokemon.name.toLowerCase().includes(terminoBusqueda) || pokemon.id.toString() === terminoBusqueda
    );
    mostrarPokemones(pokemonesFiltrados);
});

// al hacer clic en el botno de favoritos
document.getElementById('mostrar-favoritos-btn').addEventListener('click', mostrarFavoritos);

obtenerPokemones();
