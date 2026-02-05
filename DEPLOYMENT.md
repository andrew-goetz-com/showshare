# ShowShare Deployment Guide

## Initial Production Setup

When deploying to production for the first time:

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd showshare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create production database from template:
   ```bash
   cp db-schema-example.json data.json
   ```

4. Start in production mode:
   ```bash
   NODE_ENV=production npm start
   ```

## Updating Production

When pulling updates from the repository:

```bash
git pull origin main
npm install  # Update dependencies if needed
NODE_ENV=production npm start
```

**Important**: Your `data.json` file will NOT be affected by `git pull` because it's gitignored. Your production data is safe!

## Environment Variables

- `NODE_ENV=production` - Uses `data.json` (production database)
- `NODE_ENV=development` or unset - Uses `db-schema-example.json` (example database)
- `DB_STORAGE_FILE=filename.json` - Override with custom database file
- `PORT=8080` - Override port (default: 3000)

## File Structure

- `data.json` - Production database (gitignored, not in repository)
- `db-schema-example.json` - Example database (in repository, safe to modify)
- `server.js` - Backend server
- `public/` - Frontend files

## Schema Changes

If you need to modify the database schema:

1. Update `db-schema-example.json` with new structure
2. Commit and push changes
3. Manually migrate `data.json` on production server if needed
4. Production data is never overwritten by repository changes
