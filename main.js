import './style.css'

// Tabella per i colori
const colorTypes = {
  normal: "bg-gray-300 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  fire: "bg-orange-500 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  water: "bg-blue-400 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  grass: "bg-green-400 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  electric: "bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  ice: "bg-cyan-300 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  fighting: "bg-red-600 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  poison: "bg-purple-500 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  ground: "bg-amber-600 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  flying: "bg-sky-300 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  psychic: "bg-pink-400 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  bug: "bg-lime-400 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  rock: "bg-stone-500 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  ghost: "bg-violet-600 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  dragon: "bg-indigo-500 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  dark: "bg-slate-700 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  steel: "bg-slate-400 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  fairy: "bg-rose-300 text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
};

let currentOffset = 0;
let currentPokemonList = [];

async function loadPokemon(offset = 0) {
  document.getElementById("loading").classList.remove("hidden");
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
    if (!response.ok) throw new Error("Errore nel caricamento");
    
    const data = await response.json();
    currentOffset = offset;
    
    const pokemonPromises = data.results.map(async (pokemon, index) => {
      const detailResponse = await fetch(pokemon.url);
      const detail = await detailResponse.json();
      return { ...detail, listIndex: index };
    });
    currentPokemonList = await Promise.all(pokemonPromises);

    displayPokemonTable(currentPokemonList);
    updatePagination(data, offset);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    document.getElementById("loading").classList.add("hidden");
  } catch (error) {
    console.error(error);
  }
}

function displayPokemonTable(pokemonList) {
  const tbody = document.getElementById("pokemonTableBody");
  tbody.innerHTML = "";

  pokemonList.forEach((pokemon, index) => {
    const badgesTypes = pokemon.types.map((type) => {
      const nameType = type.type.name;
      const classTailwind = colorTypes[nameType] || "bg-gray-500 text-white";
      return `<span class="${classTailwind} px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mr-1 inline-block">${nameType}</span>`;
    });
    const typeHtml = badgesTypes.join("");

    const hp = pokemon.stats.find((s) => s.stat.name === "hp").base_stat;
    const attack = pokemon.stats.find((s) => s.stat.name === "attack").base_stat;

    const row = document.createElement("tr");

    row.className = "group relative cursor-pointer hover:bg-slate-800 transition-colors animate-pop-in";
    row.style.animationDelay = `${index * 50}ms`;

    row.innerHTML = `
        <td class="p-4 border-b border-slate-700">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image mx-auto block w-16 h-16">
            
            <!-- MINI CARD ANIMATA SCURA -->
            <div class="opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-90 group-hover:scale-100 transition-all duration-300 ease-out absolute left-1/4 top-1/2 -translate-y-1/2 z-40 bg-gray-900 border border-slate-700 shadow-2xl rounded-xl p-4 w-64 text-left pointer-events-none">
                <div class="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                    <h3 class="capitalize font-bold text-lg text-white">${pokemon.name}</h3>
                    <span class="text-slate-400 font-bold">#${pokemon.id.toString().padStart(3, "0")}</span>
                </div>
                <div class="flex justify-center mb-2">
                    <img src="${pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}" class="w-32 h-32 object-contain drop-shadow-md" alt="${pokemon.name}">
                </div>
                <div class="text-sm text-slate-400 space-y-1">
                    <p><span class="font-bold text-slate-200">Base HP:</span> ${hp}</p>
                    <p><span class="font-bold text-slate-200">Attack:</span> ${attack}</p>
                </div>
            </div>
        </td>
        <td class="p-4 border-b border-slate-700 capitalize font-bold text-slate-300">${pokemon.name}</td>
        <td class="p-4 border-b border-slate-700 text-slate-500 text-slate-300">#${pokemon.id.toString().padStart(3, "0")}</td>
        <td class="p-4 border-b border-slate-700">${typeHtml}</td>
        <td class="p-4 border-b border-slate-700 text-slate-300">${(pokemon.height / 10).toFixed(1)}m</td>
        <td class="p-4 border-b border-slate-700 text-slate-300">${(pokemon.weight / 10).toFixed(1)}kg</td>
        `;
    tbody.appendChild(row);
  });
}

function updatePagination(data, offset) {
  const pageInfo = document.getElementById("pageInfo");
  const currentPage = Math.floor(offset / 20) + 1;
  const totalPages = Math.ceil(data.count / 20);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${data.count} Total Pokèmon)`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-first").addEventListener("click", () => {
    loadPokemon(0);
  });
  document.getElementById("btn-prev").addEventListener("click", () => {
    if (currentOffset >= 20) loadPokemon(currentOffset - 20);
  });
  document.getElementById("btn-next").addEventListener("click", () => {
    loadPokemon(currentOffset + 20);
  });

  let searchTimer;
  document.getElementById("searchInput").addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    const textSearched = event.target.value.toLowerCase().trim();

    if (textSearched === "") {
      loadPokemon(currentOffset);
      return;
    }

    searchTimer = setTimeout(async () => {
      document.getElementById("loading").classList.remove("hidden");
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${textSearched}`);
        if (!response.ok) {
          const tbody = document.getElementById("pokemonTableBody");
          tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-red-500 font-bold text-xl">Pokémon not found!</td></tr>`;
          document.getElementById("loading").classList.add("hidden");
          return;
        }
        const detail = await response.json();
        displayPokemonTable([detail]);
      } catch (error) {
        console.error(error);
      } finally {
        document.getElementById("loading").classList.add("hidden");
      }
    }, 500);
  });

  loadPokemon(0);
});