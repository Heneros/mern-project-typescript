const fs = require('fs');
const path = require('path');

function copyDir(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) {
        console.error('Source folder not found:', srcDir);
        process.exit(1);
    }
    fs.mkdirSync(destDir, { recursive: true });
    for (const name of fs.readdirSync(srcDir)) {
        const srcPath = path.join(srcDir, name);
        const destPath = path.join(destDir, name);
        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

const projectRoot = path.resolve(__dirname, '..');
const src = path.join(projectRoot, 'backend', 'utils', 'emails');
const dest = path.join(projectRoot, 'dist', 'backend', 'utils', 'emails');

copyDir(src, dest);
console.log('✅ Email templates copied to dist');
