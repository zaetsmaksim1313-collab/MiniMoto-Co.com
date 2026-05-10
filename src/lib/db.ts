import { createPool } from '@vercel/postgres';

export const db = createPool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL
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
    return db.query(text, values);
};
