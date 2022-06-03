let pokemonList; //list of all Pokémon (name, url; id = arreyposition + 1)
let allPokemon = []; //all Pokémon names
let allTypes = []; //all types of Pokémnon
let searchMode = 0;
let countIndex = 0;
let countTo = 20;
let detailId;

async function handlePage() {
  welcomeAlert();
  await loadPokemonList();
  await getPokemonInfo();
  await loadMainContent();
}

function welcomeAlert() {
  alert("Welcome to Pokédex! All important informations will be loaded soon, i will tell you. If you want to start earlier, start to scroll!")
}


async function loadPokemonList() {
  let url = "https://pokeapi.co/api/v2/pokemon/?offset=all&limit=1126/"
  let response = await fetch(url);
  let loadedList = await response.json();
  pokemonList = loadedList["results"]
  await console.log(pokemonList)
}


async function getPokemonInfo() {
  for (let i = 0; i < pokemonList.length; i++) {
    let currentPokemon = pokemonList[i];
    let url = currentPokemon["url"];
    let response = await fetch(url);
    let pokemon = await response.json();
    let name = pokemon["name"];
    let currentType = await pokemon["types"]["0"]["type"]["name"];
    await allPokemon.push(name);
    await allTypes.push(currentType);
    await console.log(i + "ist geladen!");
  }
  alert("The Pokédex is completely loaded. Enjoy!")
}


async function loadMainContent() { //show the first 20 Pokemon
  for (let i = countIndex; i < countTo; i++) {
    let currentPokemon = pokemonList[i];
    let fixedName = await currentPokemon["name"][0].toUpperCase() + //take the first letter to upper case
      currentPokemon["name"].substring(1); //take the word,  sliced the first letter;
    await showPokemon(i, fixedName);
  }
  countIndex = countIndex + 20;
  countTo = countTo + 20;
}


window.onscroll = async function (ev) {
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && searchMode == 0) {
    await loadMainContent();
  }
}


async function showPokemon(id, fixedName) {
  let currentId = id + 1;
  await pad(currentId);
  document.getElementById("pokemons").innerHTML += `
              <div onclick="showDetails(${currentId})" id="card${currentId}" class="pokemon-card">
                <span class="pokemon-id">#${fixedCurrentId}</span>
                                <img class="card-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${currentId}.png">
                    <span class="pokemon-name">
                    ${fixedName}
                    </span>
                    </div>
                    `;
  await checkType(currentId);
}


async function pad(num) {
  num = num.toString();
  if (num.length >= 3) {
    fixedCurrentId = num;
  }
  if (num.length < 3) {
    fixedCurrentId = "0" + num;
  }
  if (num.length < 2) {
    fixedCurrentId = "00" + num;
  }
  return fixedCurrentId;
}


async function checkType(currentId) {
  let htmlId = "card" + currentId;
  let currentArreyPosition = currentId - 1;
  let currentType = allTypes[currentArreyPosition];
  currentCard = document.getElementById(htmlId);
  currentCard.classList.add(currentType);
}


async function showDetails(id) {
  detailId = id;
  let currentArreyPosition = id - 1;
  let name = allPokemon[currentArreyPosition];
  let fixedName = await name[0].toUpperCase() + //take the first letter to upper case
    name.substring(1); //take the word,  sliced the first letter;
  document.getElementById("body").classList.add("lock-scroll");
  document.getElementById("body").classList.remove("allow-scroll");
  console.log("lade Details")
  document.getElementById("pokemonDetails").classList.remove("hide");
  await addDetails(id, fixedName);
}


async function goBack() {
  document.getElementById("detailCard").innerHTML = ``;
  document.getElementById("body").classList.remove("lock-scroll");
  document.getElementById("body").classList.add("allow-scroll");
  document.getElementById("pokemonDetails").classList.add("hide");
}


async function addDetails(currentId, fixedName) {
  let currentArreyPosition = currentId - 1;
  let url = pokemonList[currentArreyPosition]["url"];
  let response = await fetch(url);
  let currentPokemon = await response.json();
  console.log(currentPokemon);
  await pad(currentId);
  let detailId = "detail" + currentId
  document.getElementById("detailCard").innerHTML = generateDetailCardHTML(detailId, fixedCurrentId, fixedName, currentPokemon);
  await checkTypeDetail(currentId);

}

function generateDetailCardHTML(detailId, fixedCurrentId, fixedName, currentPokemon) {
  return`
              <div id="${detailId}" class="pokemon-detail-card">
                <span class="pokemon-id">#${fixedCurrentId}</span>
                <img class="card-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${currentId}.png"">
                <span class="pokemon-name">${fixedName}</span>
              </div>
              <div class="pokemon-stats">
              <table>
              <tr>
                  <td>type</td>
                  <td>${currentPokemon["types"]["0"]["type"]["name"]}</td>
                </tr>
                <tr>
                  <td>height</td>
                  <td>${currentPokemon["height"]}</td>
                </tr>
              <tr>
                  <td>weight</td>
                  <td>${currentPokemon["weight"]}</td>
                </tr>
                <tr>
                  <td>${currentPokemon["stats"]["0"]["stat"]["name"]}</td>
                  <td>${currentPokemon["stats"]["0"]["base_stat"]}</td>
                </tr>
                <tr>
                  <td>${currentPokemon["stats"]["1"]["stat"]["name"]}</td>
                  <td>${currentPokemon["stats"]["1"]["base_stat"]}</td>
                </tr>
                <tr>
                  <td>${currentPokemon["stats"]["2"]["stat"]["name"]}</td>
                  <td>${currentPokemon["stats"]["2"]["base_stat"]}</td>
                </tr>
                <tr>
                  <td>${currentPokemon["stats"]["3"]["stat"]["name"]}</td>
                  <td>${currentPokemon["stats"]["3"]["base_stat"]}</td>
                </tr>
                <tr>
                  <td>${currentPokemon["stats"]["4"]["stat"]["name"]}</td>
                  <td>${currentPokemon["stats"]["4"]["base_stat"]}</td>
                </tr>
                </tabele>
              </div>
                    `;
}


async function checkTypeDetail(currentId) {
  let htmlId = "detail" + currentId;
  let currentArreyPosition = currentId - 1;
  let currentType = allTypes[currentArreyPosition];
  currentCard = document.getElementById(htmlId);
  currentCard.classList.add(currentType);
}

async function nextPokemon() {
  detailId++;
  await showDetails(detailId);
}

async function lastPokemon() {
  let newId = detailId - 1;
  await showDetails(newId);
}


async function searchForPokemon() {
  searchMode = 1;
  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  console.log(search);
  document.getElementById("pokemons").innerHTML = ``;
  if (search.length == 0) {
    searchMode = 0;
    countIndex = 0;
    countTo = 20;
    loadMainContent();
  } else {
    for (let i = 0; i < allPokemon.length; i++) {
      let name = await allPokemon[i];
      await loadSearchedPokemon(search, name, i);
    }
  }
}


async function loadSearchedPokemon(search, name, id) {
  if (name.includes(search)) {
    console.log(search + "ist ein treffer!");
    let fixedName = await name[0].toUpperCase() + //take the first letter to upper case
      name.substring(1); //take the word,  sliced the first letter;
    await showSearchedPokemon(id, fixedName);
  }
}


async function showSearchedPokemon(id, fixedName) {
  let currentId = id + 1;
  await pad(currentId);
  document.getElementById("pokemons").innerHTML += `
              <div onclick="showDetails(${currentId})" id="card${currentId}" class="pokemon-card">
                <span class="pokemon-id">#${fixedCurrentId}</span>
                                <img class="card-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${currentId}.png">
                    <span class="pokemon-name">
                    ${fixedName}
                    </span>
                    </div>
                    `;
  await checkType(currentId)
}

//will be need for multiply language
//
//async function getGermanName(id) {
//  let urlForGerman = "https://pokeapi.co/api/v2/pokemon-species/" + id;
//  let responseForGerman = await fetch(urlForGerman);
//  let pokemonForGerman = await responseForGerman.json();
//  let germanName = await pokemonForGerman["names"]["5"]["name"];
//}

