import { createPool } from '@vercel/postgres';

// Lazy pool — only created when first used, not at module load time.
// This prevents build-time crashes when POSTGRES_URL is not available.
let _pool: ReturnType<typeof createPool> | null = null;

function getPool() {
  if (!_pool) {
    _pool = createPool({
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    });
  }
  return _pool;
}

export const db = new Proxy({} as ReturnType<typeof createPool>, {
  get(_target, prop) {
    return (getPool() as any)[prop];
  },
});

// VercelPool has a .query() method and a .sql tagged template method
export const sql = function(strings: TemplateStringsArray, ...values: any[]) {
  let text = '';
  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) {
      text += `$${i + 1}`;
    }
  }
  return getPool().query(text, values);
};
