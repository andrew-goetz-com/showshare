# ShowShare

A minimal, beautiful movie & TV show list for friends.

## Setup

```bash
npm install
npm start
```

## Database Configuration

The app uses a JSON file for data persistence. To prevent overwriting production data:

### Development Mode (default)
```bash
npm start
```
Uses `db-schema-example.json` automatically

### Production Mode
```bash
NODE_ENV=production npm start
```
Uses `data.json` (gitignored to protect production data)

### Custom Database File
```bash
# Via environment variable
DB_STORAGE_FILE=my-custom-db.json npm start

# Via command line argument
node server.js 3000 my-custom-db.json
```

### Command Line Arguments
- Argument 1: Port number (default: 3000)
- Argument 2: Database filename (optional)

Example:
```bash
node server.js 8080 test-data.json
```

## Files

- `data.json` - Production database (gitignored)
- `db-schema-example.json` - Example database structure (version controlled)
- `server.js` - Express backend
- `public/` - Frontend files

## Deployment

For production deployment, ensure:
1. Set `NODE_ENV=production`
2. Create `data.json` with your production data
3. The `.gitignore` prevents `data.json` from being committed
