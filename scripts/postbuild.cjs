const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

for (const fileName of fs.readdirSync(distDir)) {
  if (!fileName.endsWith('.html')) continue;
  const filePath = path.join(distDir, fileName);
  const html = fs.readFileSync(filePath, 'utf8').replace(/ crossorigin/g, '');
  fs.writeFileSync(filePath, html, 'utf8');
}
