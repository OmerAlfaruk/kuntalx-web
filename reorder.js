import fs from 'fs';
import path from 'path';

const targetPath = path.resolve('c:/Users/omer/Desktop/kuntalX/kuntalX/frontend/web/src/features/marketing/pages/LandingPage.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// The file has a structure inside <main className="flex-grow"> ... </main>
// We need to extract each section and reassemble them.
const sections = [
    '{/* 2. HERO SECTION */}',
    '{/* 3. PARTNER LOGOS SECTION */}',
    '{/* 3.5 ABOUT KUNTALX */}',
    '{/* 4. SOLUTION SECTION */}',
    '{/* 4.5 ACTIVE MARKET STREAMS SECTION */}',
    '{/* 5. INTERACTIVE HUB MAP SECTION */}',
    '{/* 5.6 DIGITAL ADVANTAGE COMPARISON SECTION */}',
    '{/* 5.7 TRANSPARENCY ARCHITECTURE (HARVEST TO GLOBAL HUB) */}',
    '{/* 5.8 MARKETPLACE SHOWCASE */}',
    '{/* 6. HOW IT WORKS SECTION */}',
    '{/* 7. TESTIMONIALS SECTION */}',
    '{/* 8. UNIQUE VALUE SECTION */}',
    '{/* 9. FAQ SECTION */}',
    '{/* 10. FINAL CTA SECTION */}'
];

let mainStart = content.indexOf('<main className="flex-grow">') + '<main className="flex-grow">'.length;
let mainEnd = content.indexOf('</main>', mainStart);

if (mainStart === -1 || mainEnd === -1) {
    console.error("Could not find main element");
    process.exit(1);
}

let mainContent = content.substring(mainStart, mainEnd);

let indices = [];
for (let sec of sections) {
    let idx = mainContent.indexOf(sec);
    if (idx !== -1) {
        indices.push({ name: sec, index: idx });
    } else {
        console.error("Could not find section:", sec);
    }
}

indices.sort((a, b) => a.index - b.index);

let extracted = {};
for (let i = 0; i < indices.length; i++) {
    let start = indices[i].index;
    let end = i < indices.length - 1 ? indices[i + 1].index : mainContent.length;
    extracted[indices[i].name] = mainContent.substring(start, end);
}

const desiredOrder = [
    '{/* 2. HERO SECTION */}',
    '{/* 3. PARTNER LOGOS SECTION */}',
    '{/* 3.5 ABOUT KUNTALX */}',
    '{/* 6. HOW IT WORKS SECTION */}',
    '{/* 4. SOLUTION SECTION */}',
    '{/* 5.8 MARKETPLACE SHOWCASE */}',
    '{/* 4.5 ACTIVE MARKET STREAMS SECTION */}',
    '{/* 5. INTERACTIVE HUB MAP SECTION */}',
    '{/* 5.7 TRANSPARENCY ARCHITECTURE (HARVEST TO GLOBAL HUB) */}',
    '{/* 5.6 DIGITAL ADVANTAGE COMPARISON SECTION */}',
    '{/* 8. UNIQUE VALUE SECTION */}',
    '{/* 7. TESTIMONIALS SECTION */}',
    '{/* 9. FAQ SECTION */}',
    '{/* 10. FINAL CTA SECTION */}'
];

let newMainContent = '\n';
for (let sec of desiredOrder) {
    if (extracted[sec]) {
        newMainContent += extracted[sec];
    } else {
        console.error("Missing extracted section for:", sec);
    }
}

let newContent = content.substring(0, mainStart) + newMainContent + content.substring(mainEnd);
fs.writeFileSync(targetPath, newContent, 'utf8');
console.log("Successfully reordered sections.");
