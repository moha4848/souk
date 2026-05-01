const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputFile = 'Cahier_de_Conception_SOUK.md';
const outputFile = 'Cahier_de_Conception_SOUK.pdf';
const tempMdFile = 'temp_Cahier_de_Conception.md';

console.log('--- Starting PDF Generation ---');

let mdContent = fs.readFileSync(inputFile, 'utf8');

const mermaidRegex = /```mermaid([\s\S]*?)```/g;
let match;
// Find all mermaid blocks first to avoid issues with string modification during iteration
const blocks = [];
while ((match = mermaidRegex.exec(mdContent)) !== null) {
    blocks.push({
        full: match[0],
        code: match[1].trim()
    });
}

const images = [];
console.log(`Found ${blocks.length} mermaid blocks.`);

for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const fileName = `diagram_${i}.mmd`;
    const imgName = `diagram_${i}.png`;
    
    console.log(`Processing diagram ${i}/${blocks.length - 1}...`);
    fs.writeFileSync(fileName, block.code);
    
    try {
        console.log(`Generating image ${imgName}...`);
        execSync(`npx -y @mermaid-js/mermaid-cli -i ${fileName} -o ${imgName} -b white`, { stdio: 'inherit' });
        
        // Replace in MD - use a unique marker to avoid partial matches
        const placeholder = `![Diagram ${i}](${imgName})`;
        mdContent = mdContent.replace(block.full, placeholder);
        
        images.push(fileName, imgName);
    } catch (err) {
        console.error(`Error generating diagram ${i}:`, err.message);
    }
}

fs.writeFileSync(tempMdFile, mdContent);

console.log('Generating PDF with md-to-pdf...');
try {
    execSync(`npx -y md-to-pdf ${tempMdFile} --stylesheet pdf-style.css`, { stdio: 'inherit' });
    
    // The output will be temp_Cahier_de_Conception.pdf
    if (fs.existsSync('temp_Cahier_de_Conception.pdf')) {
        fs.renameSync('temp_Cahier_de_Conception.pdf', outputFile);
        console.log(`Success! PDF saved as ${outputFile}`);
    }
} catch (err) {
    console.error('Error generating PDF:', err.message);
}

// Cleanup
console.log('Cleaning up...');
if (fs.existsSync(tempMdFile)) fs.unlinkSync(tempMdFile);
images.forEach(f => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
});

console.log('--- Finished ---');
