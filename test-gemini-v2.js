const https = require('https');
const fs = require('fs');

const API_KEY = 'AIzaSyCjQZnC-6XEn45konWts45mHAr2Pa2VZYw';
const MODELS_TO_TEST = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-1.5-pro-001',
    'gemini-1.5-pro-002',
    'gemini-pro',
    'gemini-pro-vision'
];

async function testModel(model) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }]
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${model}:generateContent?key=${API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ ${model}: OK`);
                    fs.writeFileSync('working-model.txt', model);
                    process.exit(0); // Exit immediately on first success
                } else {
                    console.log(`❌ ${model}: Failed (${res.statusCode})`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ ${model}: Error ${e.message}`);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

async function run() {
    console.log('Testing models...');
    for (const model of MODELS_TO_TEST) {
        if (fs.existsSync('working-model.txt')) break;
        await testModel(model);
    }
    if (!fs.existsSync('working-model.txt')) {
        fs.writeFileSync('working-model.txt', 'NONE_FOUND');
    }
}

run();
