const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'backend-express/src/routes');

const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Simple heuristic: if the file already has try/catch in most routes, we might skip or we need an AST parser.
    // Given the complexity of AST parsing, let's just log which files lack try/catch inside router methods.
    
    // We'll look for router.METHOD(..., async (req, res) => {
    // and see if the immediate next line or soon after is a `try {`.
    
    let needsRefactoring = false;
    const matches = content.match(/router\.(get|post|put|delete|patch)\(.*async\s*\(req,\s*res.*?=>\s*\{/g);
    if (matches) {
        let tryCatchCount = (content.match(/try\s*\{/g) || []).length;
        if (tryCatchCount < matches.length) {
            console.log(`${file}: Has ${matches.length} routes but only ${tryCatchCount} try/catch blocks.`);
        } else {
            console.log(`${file}: Appears to have enough try/catch blocks (${tryCatchCount} for ${matches.length} routes).`);
        }
    } else {
        console.log(`${file}: No async routes found.`);
    }
});
