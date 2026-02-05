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
const addModal = document.getElementById('addModal');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const filterSection = document.getElementById('filterSection');
const personToggle = document.getElementById('personToggle');
const editPersonToggle = document.getElementById('editPersonToggle');
const fabBtn = document.getElementById('fabBtn');
const addTypeButtons = document.querySelectorAll('#addModal .type-btn');
const editTypeButtons = document.querySelectorAll('#editModal .type-btn');

// Generate UI from PEOPLE array
function initPeopleUI() {
  // Filter buttons
  filterSection.innerHTML = `
    <button class="filter-btn active" data-filter="all">All</button>
    ${PEOPLE.map(p => `<button class="filter-btn" data-filter="${p}">${p}</button>`).join('')}
  `;
  
  // Add section person buttons
  personToggle.innerHTML = PEOPLE.map((p, i) => 
    `<button class="person-btn${i === 0 ? ' active' : ''}" data-person="${p}">${p}</button>`
  ).join('');
  
  // Edit modal person buttons
  editPersonToggle.innerHTML = PEOPLE.map(p => 
    `<button class="person-btn" data-person="${p}">${p}</button>`
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

// Fetch items (only re-render if data changed)
let lastDataHash = '';
async function fetchItems(forceRender = false) {
  const res = await fetch(API);
  const newItems = await res.json();
  const newHash = JSON.stringify(newItems);
  
  if (forceRender || newHash !== lastDataHash) {
    lastDataHash = newHash;
    items = newItems;
    render();
  }
}

// Render list
function render() {
  const filteredItems = currentFilter === 'all' 
    ? items 
    : items.filter(i => i.addedBy === currentFilter);
  
  emptyState.classList.toggle('hidden', filteredItems.length > 0);
  list.classList.toggle('hidden', filteredItems.length === 0);
  
  list.innerHTML = filteredItems.map(item => `
    <li class="list-item" data-id="${item.id}">
      <span class="drag-handle">⋮⋮</span>
      <span class="item-icon">${item.type === 'movie' ? '🎬' : '📺'}</span>
      <div class="item-content" onclick="copyTitle('${escapeHtml(item.title).replace(/'/g, "\\'")}')">
        <div class="item-title">${escapeHtml(item.title)}</div>
        <div class="item-meta">
          <span class="item-type">${item.type === 'movie' ? 'Movie' : 'Show'}</span>
          <span class="item-person">${escapeHtml(item.addedBy || 'Unknown')}</span>
        </div>
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

// Copy title to clipboard
async function copyTitle(title) {
  try {
    await navigator.clipboard.writeText(title);
    showToast('Copied!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

// Toast notification
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1500);
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
  closeAddModal();
  fetchItems();
}

// Add Modal
function openAddModal() {
  addModal.classList.add('active');
  fabBtn.classList.add('open');
  
  // Sync button UI with current selections
  personToggle.querySelectorAll('.person-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.person === selectedPerson);
  });
  addTypeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === selectedType);
  });
  
  titleInput.focus();
}

function closeAddModal() {
  addModal.classList.remove('active');
  fabBtn.classList.remove('open');
  titleInput.value = '';
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
    handle: '.drag-handle',
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
fabBtn.addEventListener('click', () => {
  if (addModal.classList.contains('active')) {
    closeAddModal();
  } else {
    openAddModal();
  }
});

addBtn.addEventListener('click', addItem);

titleInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addItem();
});

addTypeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    addTypeButtons.forEach(b => b.classList.remove('active'));
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

document.getElementById('closeAddModal').addEventListener('click', closeAddModal);
document.getElementById('cancelEdit').addEventListener('click', closeEdit);
document.getElementById('closeEditModal').addEventListener('click', closeEdit);
document.getElementById('saveEdit').addEventListener('click', saveEdit);

addModal.addEventListener('click', e => {
  if (e.target === addModal) closeAddModal();
});

editModal.addEventListener('click', e => {
  if (e.target === editModal) closeEdit();
});

editInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') saveEdit();
});

// Real-time polling (every 3 seconds)
setInterval(fetchItems, 3000);

// View raw JSON
document.getElementById('viewJsonBtn').addEventListener('click', async () => {
  try {
    const res = await fetch(API);
    const data = await res.json();
    const jsonWindow = window.open('', '_blank', 'noopener,noreferrer');
    
    // Check if window.open was successful
    if (!jsonWindow) {
      showToast('Please allow popups to view JSON');
      return;
    }
    
    // Create the document structure safely
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Raw JSON Data</title>
  <style>
    body { 
      background: #1a1a1a; 
      color: #fff; 
      font-family: monospace; 
      padding: 20px; 
      margin: 0; 
    } 
    pre { 
      white-space: pre-wrap; 
      word-wrap: break-word; 
    }
  </style>
</head>
<body><pre></pre></body>
</html>`;
    
    jsonWindow.document.open();
    jsonWindow.document.write(html);
    jsonWindow.document.close();
    
    // Use textContent to safely insert JSON (prevents XSS)
    const preElement = jsonWindow.document.querySelector('pre');
    if (preElement) {
      preElement.textContent = JSON.stringify(data, null, 2);
    }
  } catch (err) {
    console.error('Failed to fetch JSON:', err);
    showToast('Failed to load JSON data');
  }
});

// Initial load
initPeopleUI();
fetchItems();
