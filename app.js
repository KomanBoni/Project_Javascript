// Récupération des références des éléments du DOM
const reservationForm = document.querySelector('#reservationForm');
const userNameInput = document.querySelector('#userName');
const roomSelect = document.querySelector('#roomSelect');
const reservationsList = document.querySelector('#reservationsList');

// Fonction pour gérer la redirection avec la salle présélectionnée
function handleRoomRedirect() {
  const reserveButtons = document.querySelectorAll('.bg-white.rounded-lg a');
  
  reserveButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const roomCard = button.closest('.bg-white.rounded-lg');
      const roomTitle = roomCard.querySelector('h3').textContent;
      
      // Stocke la salle sélectionnée dans sessionStorage
      sessionStorage.setItem('selectedRoom', roomTitle);
      
      // Redirige vers la page d'accueil
      window.location.href = 'index.html';
    });
  });
}

// Fonction pour présélectionner la salle dans le formulaire
function preSelectRoom() {
  const selectedRoom = sessionStorage.getItem('selectedRoom');
  if (selectedRoom && roomSelect) {
    // Trouve l'option correspondante dans le select
    const options = Array.from(roomSelect.options);
    const option = options.find(opt => opt.text === selectedRoom);
    if (option) {
      option.selected = true;
    }
    // Efface la sélection du sessionStorage après utilisation
    sessionStorage.removeItem('selectedRoom');
  }
}

// Écouteur d'événement qui se déclenche quand le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  loadReservations();
  handleRoomRedirect(); // Initialise les redirections sur la page des salles
  preSelectRoom(); // Présélectionne la salle si on vient de la page des salles
});

// Gestion de la soumission du formulaire de réservation
reservationForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const userName = userNameInput.value;
  const room = roomSelect.value;

  if (userName && room) {
    const reservation = { userName, room, id: Date.now() };
    saveReservation(reservation);
    addReservationToDOM(reservation);
    reservationForm.reset();
  }
});

// Sauvegarde une nouvelle réservation dans le localStorage
function saveReservation(reservation) {
  const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
  reservations.push(reservation);
  localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Charge toutes les réservations depuis le localStorage
function loadReservations() {
  const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
  reservations.forEach(addReservationToDOM);
}

// Crée et ajoute un élément de réservation dans la liste du DOM
function addReservationToDOM(reservation) {
  if (!reservationsList) return;
  
  const li = document.createElement('li');
  li.className = 'p-2 bg-gray-200 rounded flex justify-between items-center';
  li.innerHTML = `<span>${reservation.userName} a réservé ${reservation.room}</span>
                  <button data-id="${reservation.id}" class="text-red-500">Supprimer</button>`;

  li.querySelector('button').addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    deleteReservation(id);
    li.remove();
  });

  reservationsList.appendChild(li);
}

// Supprime une réservation du localStorage
function deleteReservation(id) {
  let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
  reservations = reservations.filter((res) => res.id !== parseInt(id, 10));
  localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Gestion de l'effet de scroll sur la navbar
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('bg-blue-700');
  } else {
    navbar.classList.remove('bg-blue-700');
  }
});