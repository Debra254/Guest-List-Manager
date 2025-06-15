document.addEventListener('DOMContentLoaded', function() {
  const guestForm = document.getElementById('guest-form');
  const guestNameInput = document.getElementById('guest-name');
  const guestCategorySelect = document.getElementById('guest-category');
  const guestList = document.getElementById('guest-list');
  const guestCount = document.getElementById('guest-count');
  
  let guests = [];
  const MAX_GUESTS = 10;

  // Load guests from localStorage if available
  if (localStorage.getItem('guests')) {
    guests = JSON.parse(localStorage.getItem('guests'));
    renderGuestList();
  }

  guestForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = guestNameInput.value.trim();
    const category = guestCategorySelect.value;
    
    if (!name) return;
    
    if (guests.length >= MAX_GUESTS) {
      alert(`Sorry, the guest list is limited to ${MAX_GUESTS} people.`);
      return;
    }
    
    const newGuest = {
      id: Date.now(),
      name,
      category,
      attending: true,
      timestamp: new Date().toLocaleString()
    };
    
    guests.push(newGuest);
    saveGuests();
    renderGuestList();
    
    guestNameInput.value = '';
    guestNameInput.focus();
  });

  function renderGuestList() {
    guestList.innerHTML = '';
    guests.forEach(guest => {
      const li = document.createElement('li');
      li.className = `guest-item ${guest.category}`;
      
      li.innerHTML = `
        <div class="guest-info">
          <div class="guest-name">${guest.name}</div>
          <div class="guest-category">${guest.category.charAt(0).toUpperCase() + guest.category.slice(1)}</div>
          <div class="guest-time">Added: ${guest.timestamp}</div>
        </div>
        <div class="guest-actions">
          <button class="rsvp-btn ${guest.attending ? '' : 'not-attending'}">
            ${guest.attending ? 'Attending' : 'Not Attending'}
          </button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Remove</button>
        </div>
      `;
      
      guestList.appendChild(li);
      
      // Add event listeners to the buttons
      const deleteBtn = li.querySelector('.delete-btn');
      const rsvpBtn = li.querySelector('.rsvp-btn');
      const editBtn = li.querySelector('.edit-btn');
      
      deleteBtn.addEventListener('click', () => {
        guests = guests.filter(g => g.id !== guest.id);
        saveGuests();
        renderGuestList();
      });
      
      rsvpBtn.addEventListener('click', () => {
        guest.attending = !guest.attending;
        saveGuests();
        renderGuestList();
      });
      
      editBtn.addEventListener('click', () => {
        const newName = prompt('Edit guest name:', guest.name);
        if (newName && newName.trim() !== '') {
          guest.name = newName.trim();
          saveGuests();
          renderGuestList();
        }
      });
    });
    
    updateGuestCount();
  }
  
  function updateGuestCount() {
    guestCount.textContent = `(${guests.length}/${MAX_GUESTS})`;
  }
  
  function saveGuests() {
    localStorage.setItem('guests', JSON.stringify(guests));
  }
});