# ShowShare - Copilot Instructions

## Project Overview

ShowShare is a minimal, beautiful movie & TV show watchlist application for friends. It's a lightweight, single-page web application with a Node.js/Express backend and vanilla JavaScript frontend focused on simplicity and aesthetic design.

## Tech Stack

- **Backend**: Node.js with Express (v4.18.2)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data Storage**: File-based JSON storage (`data.json`)
- **UI Library**: Sortable.js (CDN) for drag-and-drop functionality
- **Fonts**: Inter font family from Google Fonts
- **Styling**: Custom CSS with CSS variables for theming

## Architecture & Structure

```
/
├── server.js           # Express server with REST API
├── data.json          # Persistent data storage
├── package.json       # Dependencies
└── public/
    ├── index.html     # Single-page application
    ├── app.js         # Frontend JavaScript logic
    └── styles.css     # All styles
```

## Coding Standards

### JavaScript

- **Style**: Use modern ES6+ syntax
- **Quotes**: Use single quotes for strings
- **Async/Await**: Prefer async/await over promises
- **Array Methods**: Use functional array methods (map, filter, forEach)
- **Constants**: Define constants at the top of files (e.g., `const API = '/api/items'`)
- **Comments**: Use emojis in comments for visual markers (e.g., `// ✨ PEOPLE`)

### Backend (server.js)

- **Port**: Default port 3000
- **API Prefix**: All endpoints use `/api/` prefix
- **Error Handling**: Use try-catch blocks with fallback return values
- **File Operations**: Use synchronous fs methods for simplicity
- **Logging**: Use console.log with emoji prefixes for important messages
- **Data Format**: Always format JSON with 2-space indentation when writing

### Frontend (app.js)

- **Global State**: Store state in module-level variables at the top
- **Element References**: Cache DOM element references at the top
- **Function Organization**: Group related functions together
- **Event Listeners**: Attach event listeners after element creation
- **UI Updates**: Separate render logic into dedicated functions

### CSS (styles.css)

- **Design System**: Use CSS custom properties (variables) defined in `:root`
- **Color Scheme**: Dark theme with specific color palette:
  - Primary background: `#0a0a0a`
  - Accent color: `#6366f1` (indigo)
  - Text with opacity for hierarchy
- **Units**: Use `rem` for font sizes, `px` for precise spacing
- **Transitions**: Use `0.2s ease` for most transitions
- **Layout**: Mobile-first design (max-width: 480px)
- **Z-index Hierarchy**: Toast (2000) > Modal (1000) > FAB (100) > Footer (50)
- **Interactions**: Add appropriate `touch-action` and `user-select` properties for mobile

### HTML

- **Semantic HTML**: Use semantic elements where appropriate
- **Accessibility**: Include proper ARIA labels and roles
- **Meta Tags**: Include viewport meta for mobile responsiveness
- **Structure**: Keep HTML minimal, generate dynamic content in JavaScript

## Design Patterns

### UI Components

- **Modals**: Use overlay + content structure with close buttons
- **Buttons**: Pill-shaped with rounded borders (100px border-radius)
- **Lists**: Card-based design with subtle borders and hover states
- **Empty States**: Include icon, message, and hint with glow effect
- **FAB (Floating Action Button)**: Fixed position with backdrop-filter blur

### API Patterns

- **RESTful Routes**: Standard REST conventions
  - GET `/api/items` - List all items
  - POST `/api/items` - Create item
  - PUT `/api/items/:id` - Update item
  - DELETE `/api/items/:id` - Delete item
  - PUT `/api/reorder` - Reorder items
- **ID Generation**: Use `Date.now()` for unique IDs
- **Ordering**: Items have an `order` property for sorting
- **Response Format**: Return JSON with appropriate status codes

### Data Model

```javascript
{
  id: Number,        // Timestamp-based unique ID
  title: String,     // Movie/show name
  type: String,      // 'movie' or 'show'
  addedBy: String,   // Person name from PEOPLE array
  order: Number      // Sort order (1-indexed)
}
```

## Configuration

### Customization Points

- **PEOPLE Array**: Edit the `PEOPLE` constant in `app.js` (line 4) to change available names
- **Port**: Change `PORT` constant in `server.js` (default: 3000)
- **Data File**: Change `DATA_FILE` path in `server.js` if needed

## Security Practices

- **CORS**: Enabled for development (consider restricting in production)
- **Input Validation**: Validate and sanitize user input before processing
- **File Permissions**: Ensure data.json has appropriate read/write permissions
- **No Secrets**: Never commit API keys or sensitive data

## Testing

- **No formal test framework**: This is a minimal project without automated tests
- **Manual Testing**: Test all CRUD operations and drag-and-drop functionality
- **Browser Testing**: Verify in modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Testing**: Test touch interactions and responsive design

## Development Workflow

### Running the App

```bash
npm install       # Install dependencies
npm start         # Start server (production)
npm run dev      # Start server (development)
```

The app runs at `http://localhost:3000`

### Making Changes

1. Backend changes: Edit `server.js`
2. Frontend logic: Edit `public/app.js`
3. Styling: Edit `public/styles.css`
4. Structure: Edit `public/index.html`
5. Restart server after backend changes

## Best Practices

### Code Quality

- Keep functions small and focused on single responsibility
- Use descriptive variable names
- Maintain consistent indentation (2 spaces)
- Group related code together
- Add comments for complex logic or configuration points

### Performance

- Minimize DOM manipulations by batching updates
- Use event delegation where appropriate
- Cache DOM queries in variables
- Keep CSS selectors simple and performant

### User Experience

- Provide immediate visual feedback for actions
- Use smooth transitions for state changes
- Include loading states for async operations
- Show appropriate empty states
- Ensure touch targets are adequately sized (minimum 44x44px)

### Styling

- Mobile-first approach: design for 480px max-width
- Use opacity for text hierarchy (primary: 1, secondary: 0.5, tertiary: 0.3)
- Apply backdrop-filter blur effects for glassmorphism
- Include hover states for interactive elements
- Use subtle borders (`rgba(255, 255, 255, 0.06)`) for separation

## Common Patterns

### Adding New Features

1. For new list items, add to data model and update `data.json` structure
2. For new API endpoints, follow RESTful conventions in `server.js`
3. For new UI elements, match existing design system in `styles.css`
4. For new interactions, follow existing event handler patterns in `app.js`

### Drag and Drop

- Uses Sortable.js library
- Initialize with `Sortable.create()` on list element
- Handle reorder in `onEnd` callback
- Update backend via PUT `/api/reorder`

### Modals

- Toggle visibility with `modal.classList.toggle('active')`
- Use backdrop click to close
- Prevent propagation on content clicks
- Reset form state on close
