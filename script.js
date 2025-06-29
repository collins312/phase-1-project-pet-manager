
const apiUrl = "http://localhost:3000/pets"; // JSON Server for local pet data
const dogApiKey = "live_RiD83QnKtMV8cEJTSoBGoEVWyVZDL8gqBlREbaJ4UdOIwMu8DBn7QgES1fgMyIhE";
const breedUrl = "https://api.thedogapi.com/v1/breeds";

const petList = document.getElementById('petList');
const addPetBtn = document.getElementById('addPetBtn');
const removePetBtn = document.getElementById('removePetBtn');
const removePetName = document.getElementById('removePetName');

let pets = [];

document.addEventListener('DOMContentLoaded', async () => {
  pets = await fetchPets();
  renderPets(pets);
  fetchDogBreeds(); // Fetch breeds from The Dog API
});

async function fetchPets() {
  const res = await fetch(apiUrl);
  return res.json();
}

addPetBtn.addEventListener('click', async () => {
  const newPet = {
    name: document.getElementById('petName').value.trim(),
    age: Number(document.getElementById('petAge').value),
    type: document.getElementById('petType').value.trim()
  };
  if (!newPet.name || !newPet.age || !newPet.type) return alert('Fill all fields');

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPet)
  });

  document.getElementById('petName').value = "";
  document.getElementById('petAge').value = "";
  document.getElementById('petType').value = "";

  pets = await fetchPets();
  renderPets(pets);
});

removePetBtn.addEventListener('click', async () => {
  const nameToRemove = removePetName.value.trim().toLowerCase();
  if (!nameToRemove) return alert('Please enter a valid Pet Name to remove');

  const pet = pets.find(p => p.name.toLowerCase() === nameToRemove);
  if (!pet) return alert('No pet found with this name');

  await deletePet(pet.id);
  removePetName.value = "";
});

function renderPets(pets) {
  petList.innerHTML = pets.map(pet => `
    <div class="pet-card">
      <h3>${pet.name} (ID: ${pet.id})</h3>
      <p>Age: ${pet.age}</p>
      <p>Type: ${pet.type}</p>
      <button onclick="deletePet(${pet.id})">Mark as Sold</button>
    </div>
  `).join('');
}

async function deletePet(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  pets = await fetchPets();
  renderPets(pets);
}

window.deletePet = deletePet;

// Integration with The Dog API
async function fetchDogBreeds() {
  try {
    const res = await fetch(breedUrl, {
      headers: {
        "x-api-key": dogApiKey
      }
    });
    const breeds = await res.json();
    displayBreeds(breeds);
  } catch (err) {
    console.error("Failed to fetch dog breeds:", err);
  }
}

function displayBreeds(breeds) {
  const container = document.createElement('div');
  container.className = "breed-list";
  container.innerHTML = `<h2>Popular Dog Breeds</h2>` + breeds.slice(0, 5).map(breed => `
    <div class="pet-card">
      <h3>${breed.name}</h3>
      <img src="${breed.image?.url || ''}" alt="${breed.name}" width="200" />
      <p><strong>Temperament:</strong> ${breed.temperament || 'N/A'}</p>
      <p><strong>Life Span:</strong> ${breed.life_span}</p>
    </div>
  `).join('');
  petList.appendChild(container);
}



