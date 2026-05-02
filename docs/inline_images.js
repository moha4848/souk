const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('RAPPORT_FINAL_SOUK.html', 'utf8');

// Regex to find image tags like <img src="./annexes/..." alt="...">
const imgRegex = /<img src="\.\/annexes\/([^"]+)" alt="([^"]*)">/g;

html = html.replace(imgRegex, (match, filename, alt) => {
    const filePath = path.join(__dirname, 'annexes', filename);
    if (fs.existsSync(filePath)) {
        const ext = path.extname(filename).substring(1);
        const base64Data = fs.readFileSync(filePath).toString('base64');
        const mimeType = ext === 'png' ? 'image/png' : (ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png');
        console.log('Inlined: ' + filename);
        return `<img src="data:${mimeType};base64,${base64Data}" alt="${alt}">`;
    } else {
        console.warn('File not found: ' + filePath);
        return match;
    }
});

// Wrap in some basic HTML styling to make it look nice
const finalHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; color: #333; }
    h1, h2, h3 { color: #2c3e50; }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
    h2 { border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 30px; }
    img { max-width: 100%; height: auto; display: block; margin: 20px 0; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    a { color: #3498db; text-decoration: none; }
    a:hover { text-decoration: underline; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
</style>
</head>
<body>
${html}
</body>
</html>
`;

fs.writeFileSync('RAPPORT_FINAL_SOUK_AVEC_IMAGES.html', finalHtml, 'utf8');
console.log('Done! HTML with embedded images created.');
