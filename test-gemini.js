const https = require('https');

const API_KEY = 'AIzaSyCjQZnC-6XEn45konWts45mHAr2Pa2VZYw';
const MODELS_TO_TEST = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-pro'
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
                    resolve(true);
                } else {
                    console.log(`❌ ${model}: Failed (${res.statusCode}) - ${body.substring(0, 100)}...`);
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
        await testModel(model);
    }
}

run();
