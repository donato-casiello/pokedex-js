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
            // clean container before append
            clearContainer("pk_abilities_wrapper")
            clearContainer("pk_image_wrapper")
            clearContainer("pokemon_header")
            search.reset()
            // create and append pokemon
            createAndAppendHeader(pokemon)
            createAndAppendPokemonImage(pokemon.sprites.front_shiny)
            createAndAppendProgressBar(pokemon)
        } catch(error) {
            // clean container before append
            clearContainer("pk_abilities_wrapper")
            clearContainer("pk_image_wrapper")
            clearContainer("pokemon_header")
            search.reset()
            // create error div
            let errorDiv = document.createElement("div")
            errorDiv.innerHTML = "Pokemon not found"
            const pokemonWrapper = document.getElementById("pk_abilities_wrapper")
            pokemonWrapper.appendChild(errorDiv)
            console.log(error)
        }

    })
}

// create and append pokemon header 
function createAndAppendHeader(pokemon) {
    const pokemonHeader = document.getElementById("pokemon_header")
    const header = document.createElement("h2")
    // capitalized first letter of pokemon's name
    const capititalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    header.innerHTML = `NOME: ${capititalizedName}, PESO: ${pokemon.weight}, ALTEZZA: ${pokemon.height}`
    pokemonHeader.append(header)
}

// function to create and append pokemon image after fetching data
function createAndAppendPokemonImage(imageSource) {
    let pokemonImage = document.createElement("img")
    pokemonImage.src = imageSource
    pokemonImage.className = "main_image"
    const pokemonWrapper = document.getElementById("pk_image_wrapper")
    pokemonWrapper.appendChild(pokemonImage)
}

// create and append progress bar for abilities
function createAndAppendProgressBar(pokemon) {
    const pokemonAbilitiesWrapper = document.getElementById("pk_abilities_wrapper")
    // create a progress bar for each stat
    pokemon.stats.forEach((stat) => {
         // create label
         const label = document.createElement("label")
         label.textContent = stat.stat.name
         pokemonAbilitiesWrapper.appendChild(label)
        // create the actual progress bar
        let progressBar = document.createElement("progress")
        progressBar.max = 100
        progressBar.value = stat.base_stat
        pokemonAbilitiesWrapper.append(progressBar)
       
    })
}

// clear the div before appending other elements
function clearContainer(container) {
    const ctn = document.getElementById(container)
    // to delete pokemon_header
    if (container === "pokemon_header") {
        const headerToDelete = ctn.querySelectorAll("h2")
        // header exists
        if (headerToDelete) {
            headerToDelete.forEach(header => {
                header.innerHTML = ""
            })
        }
    } else {
        ctn.innerHTML = ""
    }
}

