const API = '/api/items';

// ✨ PEOPLE - Edit this array to change names
const PEOPLE = ['Lia', 'Andrew'];

let items = [];
let selectedType = 'movie';
let selectedPerson = PEOPLE[0];
let currentFilter = 'all';
let editingId = null;
let editSelectedType = 'movie';
let editSelectedPerson = PEOPLE[0];

// Elements
const list = document.getElementById('list');
const titleInput = document.getElementById('titleInput');
const addBtn = document.getElementById('addBtn');
const emptyState = document.getElementById('emptyState');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const filterSection = document.getElementById('filterSection');
const personToggle = document.getElementById('personToggle');
const editPersonToggle = document.getElementById('editPersonToggle');
const typeButtons = document.querySelectorAll('.add-section .type-btn');
const editTypeButtons = document.querySelectorAll('.modal-content .type-btn');

// Generate UI from PEOPLE array
function initPeopleUI() {
  // Filter buttons
  filterSection.innerHTML = `
    <button class="filter-btn active" data-filter="all">All</button>
    ${PEOPLE.map(p => `<button class="filter-btn" data-filter="${p}">${p}</button>`).join('')}
  `;
  
  // Add section person buttons
  personToggle.innerHTML = PEOPLE.map((p, i) => 
    `<button class="person-btn${i === 0 ? ' active' : ''}" data-person="${p}">👤 ${p}</button>`
  ).join('');
  
  // Edit modal person buttons
  editPersonToggle.innerHTML = PEOPLE.map(p => 
    `<button class="person-btn" data-person="${p}">👤 ${p}</button>`
  ).join('');
  
  // Attach event listeners
  filterSection.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterSection.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });
  
  personToggle.querySelectorAll('.person-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      personToggle.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPerson = btn.dataset.person;
    });
  });
  
  editPersonToggle.querySelectorAll('.person-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      editPersonToggle.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      editSelectedPerson = btn.dataset.person;
    });
  });
}

// Fetch items
async function fetchItems() {
  const res = await fetch(API);
  items = await res.json();
  render();
}

// Render list
function render() {
  const filteredItems = currentFilter === 'all' 
    ? items 
    : items.filter(i => i.addedBy === currentFilter);
  
  emptyState.classList.toggle('hidden', filteredItems.length > 0);
  
  list.innerHTML = filteredItems.map(item => `
    <li class="list-item" data-id="${item.id}">
      <span class="drag-handle">☰</span>
      <span class="item-icon">${item.type === 'movie' ? '🎬' : '📺'}</span>
      <div class="item-content">
        <div class="item-title">${escapeHtml(item.title)}</div>
        <div class="item-type">${item.type === 'movie' ? 'Movie' : 'TV Show'}</div>
        <div class="item-person">Added by ${escapeHtml(item.addedBy || 'Unknown')}</div>
      </div>
      <div class="item-actions">
        <button class="action-btn edit" onclick="openEdit(${item.id})">✏️</button>
        <button class="action-btn delete" onclick="deleteItem(${item.id})">🗑️</button>
      </div>
    </li>
  `).join('');
  
  initSortable();
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add item
async function addItem() {
  const title = titleInput.value.trim();
  if (!title) return;
  
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, type: selectedType, addedBy: selectedPerson })
  });
  
  titleInput.value = '';
  fetchItems();
}

// Delete item
async function deleteItem(id) {
  const item = list.querySelector(`[data-id="${id}"]`);
  if (item) {
    item.style.transform = 'translateX(100%)';
    item.style.opacity = '0';
  }
  
  await new Promise(r => setTimeout(r, 200));
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  fetchItems();
}

// Edit item
function openEdit(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  
  editingId = id;
  editInput.value = item.title;
  editSelectedType = item.type;
  editSelectedPerson = item.addedBy || PEOPLE[0];
  
  editTypeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === item.type);
  });
  
  editPersonToggle.querySelectorAll('.person-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.person === editSelectedPerson);
  });
  
  editModal.classList.add('active');
  editInput.focus();
}

function closeEdit() {
  editModal.classList.remove('active');
  editingId = null;
}

async function saveEdit() {
  const title = editInput.value.trim();
  if (!title || !editingId) return;
  
  await fetch(`${API}/${editingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, type: editSelectedType, addedBy: editSelectedPerson })
  });
  
  closeEdit();
  fetchItems();
}

// Sortable
function initSortable() {
  new Sortable(list, {
    animation: 200,
    handle: '.list-item',
    ghostClass: 'sortable-ghost',
    dragClass: 'sortable-drag',
    onEnd: async () => {
      const orderedIds = [...list.querySelectorAll('.list-item')]
        .map(el => parseInt(el.dataset.id));
      
      await fetch('/api/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      });
    }
  });
}

// Event listeners
addBtn.addEventListener('click', addItem);

titleInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addItem();
});

typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedType = btn.dataset.type;
  });
});

editTypeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    editTypeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    editSelectedType = btn.dataset.type;
  });
});

document.getElementById('cancelEdit').addEventListener('click', closeEdit);
document.getElementById('saveEdit').addEventListener('click', saveEdit);

editModal.addEventListener('click', e => {
  if (e.target === editModal) closeEdit();
});

editInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') saveEdit();
});

// Real-time polling (every 3 seconds)
setInterval(fetchItems, 3000);

// Initial load
initPeopleUI();
fetchItems();
