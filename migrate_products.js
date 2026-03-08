const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

function migrate() {
    if (!fs.existsSync(productsFilePath)) return;

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const migrated = products.map((p) => ({
        ...p,
        status: p.status || 'Active',
        options: p.options.map((opt) => ({
            name: opt.name,
            values: opt.values.map((val) => {
                if (typeof val === 'string') {
                    const match = val.match(/\(\+\s*\$(\d+)\)/);
                    const priceModifier = match ? parseInt(match[1]) : 0;
                    const cleanValue = val.replace(/\s*\(\+\s*\$\d+\)/, '').trim();
                    return { value: cleanValue, priceModifier };
                }
                return val;
            })
        }))
    }));

    fs.writeFileSync(productsFilePath, JSON.stringify(migrated, null, 2), 'utf8');
    console.log('Migration complete!');
}

migrate();
