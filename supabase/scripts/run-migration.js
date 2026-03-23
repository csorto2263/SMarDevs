// Run a SQL migration file against Supabase PostgreSQL
// Usage: node supabase/scripts/run-migration.js <migration-file>

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const file = process.argv[2]
if (!file) {
  console.error('Usage: node run-migration.js <migration-file>')
  process.exit(1)
}

const sql = fs.readFileSync(path.resolve(file), 'utf-8')

async function run() {
  const client = new Client({
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.mwalppgmkrmclwwugaev',
    password: process.env.SUPABASE_DB_PASS,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log(`Running: ${file}`)
    await client.query(sql)
    console.log('Migration completed successfully.')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
