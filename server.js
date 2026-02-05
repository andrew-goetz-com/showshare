const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Write data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all items
app.get('/api/items', (req, res) => {
  const items = readData();
  res.json(items.sort((a, b) => a.order - b.order));
});

// Add item
app.post('/api/items', (req, res) => {
  const items = readData();
  const newItem = {
    id: Date.now(),
    title: req.body.title,
    type: req.body.type || 'movie',
    addedBy: req.body.addedBy || 'Unknown',
    order: items.length + 1
  };
  
  // Debug log
  console.log('Adding item:', newItem);
  
  items.push(newItem);
  writeData(items);
  res.json(newItem);
});

// Update item
app.put('/api/items/:id', (req, res) => {
  const items = readData();
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };
    writeData(items);
    res.json(items[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  let items = readData();
  items = items.filter(i => i.id !== parseInt(req.params.id));
  // Reorder
  items.forEach((item, idx) => item.order = idx + 1);
  writeData(items);
  res.json({ success: true });
});

// Reorder items
app.put('/api/reorder', (req, res) => {
  const { orderedIds } = req.body;
  const items = readData();
  orderedIds.forEach((id, idx) => {
    const item = items.find(i => i.id === id);
    if (item) item.order = idx + 1;
  });
  writeData(items);
  res.json(items.sort((a, b) => a.order - b.order));
});

app.listen(PORT, () => {
  console.log(`✨ ShowShare running at http://localhost:${PORT}`);
});
