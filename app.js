document.addEventListener("DOMContentLoaded", searchPokemon)

function searchPokemon(e) {
    const search = document.getElementById("search-bar")
    search.addEventListener("submit", async (e) => {
        e.preventDefault()
        let response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto/")
        let pokemon = await response.json()
        console.log(pokemon.sprites)
    })
}

