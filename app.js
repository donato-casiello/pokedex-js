document.addEventListener("DOMContentLoaded", searchPokemon)

// Search pokemon
function searchPokemon(e) {
    const search = document.getElementById("search_bar")
    search.addEventListener("submit", async (e) => {
        e.preventDefault()
        const pokemonName = document.getElementById("pokemon_name")
        try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.value.toLowerCase()}/`)
            let pokemon = await response.json()
            console.log(pokemon)
            const pokemonDescription = document.createElement("div")
            pokemonDescription.innerHTML = `NOME: ${pokemon.name}, PESO: ${pokemon.weight}, ALTEZZA: ${pokemon.height}`
            const pokemonImage = document.createElement("img")
            pokemonImage.src = pokemon.sprites.front_shiny
            const pokemon_wrapper = await document.getElementById("pokemon_wrapper")
            await pokemon_wrapper.appendChild(pokemonDescription)
            await pokemon_wrapper.appendChild(pokemonImage)
        } catch(error) {
            let errorDiv = document.createElement("div")
            errorDiv.innerHTML = "Pokemon not found"
            const pokemonWrapper = document.getElementById("pokemon_wrapper")
            pokemonWrapper.appendChild(errorDiv)
            console.log(error)
        }

    })
}

