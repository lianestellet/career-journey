import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'career_timeline',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Initialize database schema
const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        bio TEXT,
        location TEXT,
        hobbies TEXT,
        avatar TEXT,
        "linkedIn" TEXT,
        github TEXT,
        website TEXT,
        phone TEXT,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        "startDate" TEXT NOT NULL,
        "endDate" TEXT,
        location TEXT,
        role TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        "companyId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        industry TEXT,
        technologies TEXT NOT NULL,
        keywords TEXT NOT NULL,
        "architectureDiagrams" TEXT NOT NULL,
        "startDate" TEXT,
        "endDate" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL,
        FOREIGN KEY ("companyId") REFERENCES companies(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS presentations (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        name TEXT NOT NULL,
        "targetRole" TEXT,
        "targetCompany" TEXT,
        notes TEXT,
        "showPersonalInfo" BOOLEAN NOT NULL DEFAULT true,
        "hiddenCompanyIds" TEXT NOT NULL DEFAULT '[]',
        "hiddenProjectIds" TEXT NOT NULL DEFAULT '[]',
        "customOrder" TEXT NOT NULL DEFAULT '[]',
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_companies_userId ON companies("userId");
      CREATE INDEX IF NOT EXISTS idx_presentations_userId ON presentations("userId");
      CREATE INDEX IF NOT EXISTS idx_projects_companyId ON projects("companyId");
      CREATE INDEX IF NOT EXISTS idx_companies_order ON companies("order");
      CREATE INDEX IF NOT EXISTS idx_projects_order ON projects("order");
    `);
  } finally {
    client.release();
  }
};

// Initialize on module load
initDb().catch(console.error);

export default pool;
