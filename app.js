document.addEventListener("DOMContentLoaded", searchPokemon)
document.addEventListener("DOMContentLoaded", populatePokedex)




// Search pokemon
function searchPokemon(e) {
    const search = document.getElementById("search_bar")
    search.addEventListener("submit", async (e) => {
        e.preventDefault()
        const pokemonName = document.getElementById("pokemon_name")
        try {
            // clean container before append
            const pokemon = await fetchPokemon(pokemonName.value)
            clearContainer("pk_abilities_wrapper")
            clearContainer("pk_image_wrapper")
            clearContainer("pokemon_header")
            search.reset()
            // create and append pokemon
            createAndAppendHeader(pokemon)
            createAndAppendPokemonImage(pokemon.sprites.front_default)
            createAndAppendProgressBar(pokemon)
            createToggleImageButtons(pokemon)
            // create button to add to pokedex
            createbtnToaddToPokedex(pokemon)
        } catch(error) {
            // clean container before append
            clearContainer("pk_abilities_wrapper")
            clearContainer("pk_image_wrapper")
            clearContainer("pokemon_header")
            search.reset()
            // create error div
            let errorDiv = document.createElement("h2")
            errorDiv.innerHTML = "Pokemon not found"
            errorDiv.id = "error_message"
            const pokemonWrapper = document.getElementById("pokemon_header")
            pokemonWrapper.appendChild(errorDiv)
            console.log(error)
            // remove buttons 
            const buttonsWrapper = document.getElementById("toggle_image_buttons_wrapper")
            if (buttonsWrapper) {
                buttonsWrapper.remove();
            }
            const addButton = document.getElementById("add_button")
            if (addButton) {
                addButton.remove();
            }
        }

    })
}

async function fetchPokemon(name) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}/`)
    let pokemon = await response.json()
    return pokemon
}

// create and append pokemon header 
function createAndAppendHeader(pokemon) {
    const pokemonHeader = document.getElementById("pokemon_header")
    const headerName = document.createElement("h2")
    const headerWeight = document.createElement("h2")
    const headerHeight = document.createElement("h2")
    // capitalized first letter of pokemon's name
    const capititalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    // header.innerHTML = `NOME: ${capititalizedName}, PESO: ${pokemon.weight}, ALTEZZA: ${pokemon.height}`
    headerName.innerHTML = `Nome: ${capititalizedName}`
    headerWeight.innerHTML = `Peso: ${pokemon.weight}`
    headerHeight.innerHTML = `Altezza: ${pokemon.height}`
    // append element
    pokemonHeader.append(headerName)
    pokemonHeader.append(headerWeight)
    pokemonHeader.append(headerHeight)
}

// function to create and append pokemon image after fetching data
function createAndAppendPokemonImage(imageSource) {
    let pokemonImage = document.createElement("img")
    pokemonImage.src = imageSource
    pokemonImage.id = "main_image"
    const pokemonWrapper = document.getElementById("pk_image_wrapper")
    pokemonWrapper.appendChild(pokemonImage)
}

// create and append toggle images button
function createToggleImageButtons(pokemon) {
    const imageWrapper = document.getElementById("toggle_images_wrapper")
    // create buttons wrapper
    const buttonsWrapper = document.createElement("div")
    buttonsWrapper.id = "toggle_image_buttons_wrapper"
    const previousDefaultBtn = document.getElementById("default_image_button") 
    // declaring the two buttons
    let defaultBtn, shinyBtn
        // not existing
        if (previousDefaultBtn === null) {
            // create buttons
            defaultBtn = document.createElement("button")
            shinyBtn = document.createElement("button")
            // give id for each buttons
            defaultBtn.id = "default_image_button"
            shinyBtn.id = "shiny_image_button"
            // give a class name
            defaultBtn.className = "button button-outline"
            shinyBtn.className = "button button-outline"
            // inner text
            defaultBtn.innerHTML = "Default"
            shinyBtn.innerHTML = "Shiny"
            // append buttons to div
            buttonsWrapper.append(defaultBtn)
            buttonsWrapper.append(shinyBtn)
            // append div to image wrapper
            imageWrapper.append(buttonsWrapper)
        } else {
            // already exists
            defaultBtn = document.getElementById("default_image_button")
            shinyBtn = document.getElementById("shiny_image_button")
        }
    // add event listener
    defaultBtn.addEventListener("click", () => toggleImagesDefault(pokemon))
    shinyBtn.addEventListener("click", () => toggleImagesShiny(pokemon))
}

function toggleImagesDefault(pokemon) {
    clearContainer("pk_image_wrapper")
    let pokemonImage = document.createElement("img")
    pokemonImage.src = pokemon.sprites.front_default
    pokemonImage.id = "main_image"
    const pokemonWrapper = document.getElementById("pk_image_wrapper")
    pokemonWrapper.appendChild(pokemonImage)
    createToggleImageButtons(pokemon)
}

function toggleImagesShiny(pokemon) {
    clearContainer("pk_image_wrapper")
    let pokemonImage = document.createElement("img")
    pokemonImage.src = pokemon.sprites.front_shiny
    pokemonImage.id = "main_image"
    const pokemonWrapper = document.getElementById("pk_image_wrapper")
    pokemonWrapper.appendChild(pokemonImage)
    createToggleImageButtons(pokemon)
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
        const progressBar = document.createElement("progress")
        progressBar.max = 100
        progressBar.value = stat.base_stat
        pokemonAbilitiesWrapper.append(progressBar)

    })
}

// button to add to pokedex
function createbtnToaddToPokedex(pokemon) {
    // remove previous button, if exists
    const previousBtn = document.getElementById("add_button")
    const btnWrapper = document.getElementById("add_button_wrapper")
    if (previousBtn) {
        btnWrapper.removeChild(previousBtn)
    }
    const btn = document.createElement("button")
    btn.innerHTML = "Aggiungi al tuo pokedex"
    btn.id = "add_button"
    btnWrapper.append(btn)
    // handle add to pokedex
    btn.addEventListener("click", () => addToPokedex(pokemon))
}

// handle add to pokedex
function addToPokedex(pokemon) {
    // retrieve pokedex 
    const pokedex = getPokedexFromLocalStorage()
    if (pokedex.length >= 10) {
        alert("Hai raggiunto il numero massimo di pokemon")
        return 
    } else if (pokedex.some(p => p.id === pokemon.id)) {
        alert("Questo Pokemon è già presente nel tuo Pokedex")
        return
    }
    // create pokemon miniature
    createMiniatureForPokedex(pokemon)
    addToLocalStorage(pokemon)
}

// handle the local storage
function addToLocalStorage(pokemon) {
    // Retrieve existing Pokémon list from localStorage or initialize an empty list
    const existingPokedex = localStorage.getItem("pokedex")
    const pokedex = existingPokedex ? JSON.parse(existingPokedex) : []
    // Add the new Pokémon to the list
    pokedex.push(pokemon)
    // Convert the updated Pokémon list to JSON string
    const updatedPokedex = JSON.stringify(pokedex)
    localStorage.setItem('pokedex', updatedPokedex);

}

function getPokedexFromLocalStorage() {
    const existingPokedex = localStorage.getItem("pokedex")
    const pokedex = existingPokedex ? JSON.parse(existingPokedex) : []
    return pokedex
}

// fill pokedex with pokemons
function populatePokedex() {
    // retrieve existing pokedex
    const pokedex = getPokedexFromLocalStorage()
    pokedex.forEach(pokemon => {
        createMiniatureForPokedex(pokemon)
    })
}

// create miniature for pokemon in the pokedex
function createMiniatureForPokedex(pokemon) {
    const pokemonMiniature = document.createElement("div")
    pokemonMiniature.className = "pokemon_miniature_wrapper"
    pokemonMiniature.id = `pokemon_miniature_wrapper_${pokemon.id}`
        // create pokemon miniature image
        const pokemonMiniatureImage = document.createElement("img")
        pokemonMiniatureImage.src = pokemon.sprites.front_default
        pokemonMiniatureImage.className = "pokemon_miniature_image"
        pokemonMiniatureImage.id = pokemon.name
        // create hiperlink for main page of each pokemon
        const hiperLink = document.createElement("a")
        hiperLink.addEventListener("click", async (e) => {
            const name = e.target.id
            const newPokemon = await fetchPokemon(name)
            // clear container before append
            clearContainer("pk_abilities_wrapper")
            clearContainer("pk_image_wrapper")
            clearContainer("pokemon_header")
            const search = document.getElementById("search_bar")
            search.reset()
            // create and append pokemon
            createAndAppendHeader(newPokemon)
            createAndAppendPokemonImage(newPokemon.sprites.front_default)
            createAndAppendProgressBar(newPokemon)
            createToggleImageButtons(pokemon)
            // create button to add to pokedex
            createbtnToaddToPokedex(newPokemon)

        })
        // insert image inside hiperlink
        hiperLink.appendChild(pokemonMiniatureImage)
        // create pokemon name
        const pokemonName = document.createElement("span")
        const pokemonNameUncapitalized = pokemon.name
        // capitalized name
        const pokemonNameCapitalized = pokemonNameUncapitalized.charAt(0).toUpperCase() + pokemonNameUncapitalized.slice(1)
        pokemonName.innerHTML = pokemonNameCapitalized
        pokemonName.className = "miniature_name"
        // create delete button
        const deleteBtn = document.createElement("button")
        deleteBtn.innerHTML = "Delete"
        deleteBtn.id = "delete_button"
        deleteBtn.addEventListener("click", () => deleteFromPokedex(pokemon))
        // append to element
        const pokedexWrapper = document.getElementById("pokedex_items_wrapper")
        pokemonMiniature.append(pokemonName)
        pokemonMiniature.append(hiperLink)
        pokedexWrapper.append(pokemonMiniature)
        pokemonMiniature.append(deleteBtn)
}

function deleteFromPokedex(deletedPokemon) {
    // retrieve elements
    const pokemonMiniature = document.getElementById(`pokemon_miniature_wrapper_${deletedPokemon.id}`)
    const pokedexItemsWrapper = document.getElementById("pokedex_items_wrapper")
    // remove from pokedex
    pokedexItemsWrapper.removeChild(pokemonMiniature)
    // remove from local storage
    let pokedex = localStorage.getItem("pokedex")
    pokedex = JSON.parse(pokedex)
    let updatePokedex = [...pokedex].filter((pokemon) => pokemon.id != deletedPokemon.id)
    updatePokedex = JSON.stringify(updatePokedex)
    localStorage.setItem("pokedex", updatePokedex)
}

// clear the div before appending other elements
function clearContainer(container) {
    const ctn = document.getElementById(container)
    // to delete pokemon_header
    if (container === "pokemon_header") {
        const pokemonHeader = document.getElementById("pokemon_header")
        const headerToDelete = pokemonHeader.querySelectorAll("h2")
        // header exists
        if (headerToDelete.length > 0) {
            headerToDelete.forEach(header => {
                pokemonHeader.removeChild(header)
            })
            }
        } else {
            ctn.innerHTML = ""
        }
}


