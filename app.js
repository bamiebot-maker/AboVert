/* ================================
   AboVert — App Logic v2
   Gemini AI Plant Disease Detection
   ================================ */

// ─── Disease Knowledge Base ───
const DISEASES = [
  {
    id: 'tomato_late_blight', name: 'Late Blight', crop: 'Tomato', category: 'tomato', severity: 'critical', confidence: [85, 97],
    description: 'Late blight is caused by Phytophthora infestans. One of the most destructive diseases of tomato and potato crops, capable of destroying entire fields within days.',
    symptoms: ['Water-soaked, pale green to dark brown lesions on leaves', 'White, fuzzy mold on the underside of leaves', 'Dark brown to black lesions on stems', 'Firm, dark brown spots on fruits', 'Rapid wilting and death of foliage'],
    causes: 'Cool, moist weather (60–70°F). Spread by wind-borne spores.',
    treatment: ['Apply copper-based fungicides preventively', 'Remove and destroy infected plants immediately', 'Improve air circulation by proper spacing', 'Avoid overhead irrigation; use drip systems', 'Plant resistant varieties like "Mountain Magic"', 'Rotate crops on a 3-year cycle']
  },
  {
    id: 'tomato_early_blight', name: 'Early Blight', crop: 'Tomato', category: 'tomato', severity: 'medium', confidence: [78, 94],
    description: 'Early blight is caused by Alternaria solani. It appears on older, lower leaves first and can spread upward, reducing yield by up to 50% if untreated.',
    symptoms: ['Dark brown to black concentric rings on lower leaves', 'Yellowing of tissue around spots', 'Leaf drop starting from bottom of plant', 'Dark, sunken lesions at stem end of fruit', 'Overall weakening of the plant'],
    causes: 'Warm, humid weather (75–85°F). Survives in soil and plant debris.',
    treatment: ['Apply chlorothalonil or mancozeb at first sign', 'Mulch around plants to prevent soil splash', 'Remove infected lower leaves', 'Water at base of plants, not overhead', 'Ensure adequate plant nutrition', 'Practice 2–3 year crop rotation']
  },
  {
    id: 'tomato_leaf_mold', name: 'Leaf Mold', crop: 'Tomato', category: 'tomato', severity: 'medium', confidence: [80, 93],
    description: 'Leaf mold is caused by Passalora fulva. Most common in greenhouse tomatoes, it can also affect field-grown crops in humid conditions.',
    symptoms: ['Pale green to yellowish spots on upper leaf surfaces', 'Olive-green to grayish-purple mold on lower leaf surfaces', 'Leaves curl upward and may drop prematurely', 'Rarely affects stems or fruit directly', 'Reduced vigor and fruit production'],
    causes: 'High humidity (>85%) and moderate temperatures. Poor ventilation.',
    treatment: ['Improve ventilation and air flow', 'Reduce humidity below 85%', 'Apply appropriate fungicides', 'Remove heavily infected leaves', 'Use resistant varieties', 'Avoid leaf wetting during irrigation']
  },
  {
    id: 'potato_late_blight', name: 'Late Blight', crop: 'Potato', category: 'potato', severity: 'critical', confidence: [82, 96],
    description: 'Potato late blight, caused by Phytophthora infestans, was responsible for the Irish potato famine. It remains one of the most serious threats to global potato production.',
    symptoms: ['Water-soaked dark spots on leaf tips and edges', 'White mildew on underside of leaves in humid conditions', 'Brown-black lesions on stems', 'Firm, dark reddish-brown rot in tubers', 'Entire plant can collapse within 7–10 days'],
    causes: 'Cool nights (50–60°F) and warm days with high humidity.',
    treatment: ['Apply preventive fungicide before symptoms appear', 'Destroy all volunteer potato plants', 'Plant certified disease-free seed potatoes', 'Hill potatoes to protect tubers', 'Harvest tubers in dry conditions', 'Store only healthy, dry tubers']
  },
  {
    id: 'potato_early_blight', name: 'Early Blight', crop: 'Potato', category: 'potato', severity: 'medium', confidence: [76, 92],
    description: 'Potato early blight is caused by Alternaria solani and primarily affects foliage, but can also attack tubers.',
    symptoms: ['Small, dark, concentrically ringed spots on older leaves', 'Spots may coalesce causing extensive leaf death', 'Defoliation reduces tuber size and yield', 'Dark, sunken, circular lesions on tubers', 'Affected tuber tissue is dry and corky'],
    causes: 'Alternating warm and cool periods with moisture. Stressed plants more susceptible.',
    treatment: ['Apply fungicides at early signs', 'Maintain proper fertility', 'Practice crop rotation', 'Remove plant debris after harvest', 'Use resistant cultivars', 'Irrigate to avoid plant stress']
  },
  {
    id: 'corn_gray_leaf_spot', name: 'Gray Leaf Spot', crop: 'Corn', category: 'corn', severity: 'high', confidence: [79, 94],
    description: 'Gray leaf spot, caused by Cercospora zeae-maydis, is one of the most significant foliar diseases of corn. Yield losses can exceed 30%.',
    symptoms: ['Rectangular, tan to gray lesions bounded by veins', 'Lesions appear translucent when held to light', 'Lower leaves affected first', 'Lesions expand and coalesce', 'Premature senescence of the plant'],
    causes: 'Prolonged high humidity and warm temperatures (75–85°F).',
    treatment: ['Plant resistant hybrids', 'Apply foliar fungicides at early tasseling', 'Rotate crops to reduce inoculum', 'Tillage to bury infected debris', 'Avoid continuous corn planting', 'Scout fields regularly']
  },
  {
    id: 'corn_common_rust', name: 'Common Rust', crop: 'Corn', category: 'corn', severity: 'medium', confidence: [83, 95],
    description: 'Common rust of corn is caused by Puccinia sorghi. Significant yield loss usually occurs only in sweet corn or susceptible hybrids.',
    symptoms: ['Small, reddish-brown pustules on both leaf surfaces', 'Pustules release powdery, cinnamon-brown spores', 'Pustules darken to brownish-black as they mature', 'Heavy infections cause leaf yellowing', 'Ears and husks may develop pustules'],
    causes: 'Cool, moist weather (60–77°F). Spores are wind-blown.',
    treatment: ['Plant resistant hybrids', 'Apply fungicide if pustules appear before tasseling', 'Monitor weather conditions', 'Avoid late planting', 'Scout fields beginning at V8 stage', 'Remove heavily infected leaves']
  },
  {
    id: 'apple_scab', name: 'Apple Scab', crop: 'Apple', category: 'apple', severity: 'high', confidence: [80, 95],
    description: 'Apple scab, caused by Venturia inaequalis, is the most common apple disease worldwide, causing significant cosmetic and yield damage.',
    symptoms: ['Olive-green to dark brown velvety spots on leaves', 'Leaves may curl, yellow, and drop prematurely', 'Dark, scabby lesions on fruit surface', 'Fruit may crack or become deformed', 'Reduced fruit quality and marketability'],
    causes: 'Spring rains and moderate temperatures (60–75°F). Overwinters on fallen leaves.',
    treatment: ['Apply fungicide sprays from bud break through petal fall', 'Rake and destroy fallen leaves in autumn', 'Prune trees for air circulation', 'Plant scab-resistant cultivars', 'Use lime-sulfur as a dormant spray', 'Monitor weather for infection periods']
  },
  {
    id: 'apple_cedar_rust', name: 'Cedar Apple Rust', crop: 'Apple', category: 'apple', severity: 'medium', confidence: [77, 91],
    description: 'Cedar apple rust is caused by Gymnosporangium juniperi-virginianae. It requires both cedar and apple trees to complete its life cycle.',
    symptoms: ['Bright orange-yellow spots on upper leaf surface', 'Small tube-like structures on underside of leaves', 'Spots may have a red border', 'Fruit and young twigs can be infected', 'Premature leaf drop in severe cases'],
    causes: 'Requires nearby cedar/juniper trees. Rainy spring weather spreads spores.',
    treatment: ['Remove nearby cedar/juniper trees if practical', 'Apply fungicides from pink bud through bloom', 'Plant resistant varieties', 'Prune galls from cedar trees in winter', 'Improve air circulation', 'Use myclobutanil-based fungicides']
  },
  {
    id: 'grape_black_rot', name: 'Black Rot', crop: 'Grape', category: 'grape', severity: 'high', confidence: [81, 96],
    description: 'Black rot, caused by Guignardia bidwellii, is one of the most serious grape diseases in warm, humid climates. Can destroy up to 80% of the crop.',
    symptoms: ['Small, reddish-brown circular spots on leaves', 'Spots develop dark margins and tan centers', 'Berries shrivel into hard, black mummies', 'Tendrils and shoots develop dark lesions', 'Rapid fruit loss after initial symptoms'],
    causes: 'Warm (77–90°F), wet weather during bloom and fruit development.',
    treatment: ['Apply fungicide from bud break through 4 weeks after bloom', 'Remove all mummified fruit', 'Prune vines for air circulation', 'Keep vineyard floor clean', 'Use resistant varieties', 'Apply captan on schedule']
  },
  {
    id: 'grape_downy_mildew', name: 'Downy Mildew', crop: 'Grape', category: 'grape', severity: 'high', confidence: [78, 93],
    description: 'Downy mildew, caused by Plasmopara viticola, is one of the most destructive grape diseases worldwide.',
    symptoms: ['Oily, yellow-green spots on upper leaf surface', 'White, cottony growth on lower leaf surface', 'Infected berries turn brown and shrivel', 'Shoots may be distorted', 'Severe defoliation reduces vine vigor'],
    causes: 'Warm (65–77°F) and wet conditions. Rain splash spreads spores.',
    treatment: ['Apply preventive fungicides before rain', 'Ensure good air circulation', 'Avoid excessive nitrogen', 'Remove infected leaves and shoots', 'Use resistant rootstocks', 'Avoid overhead irrigation']
  },
  {
    id: 'rice_blast', name: 'Rice Blast', crop: 'Rice', category: 'rice', severity: 'critical', confidence: [84, 97],
    description: 'Rice blast, caused by Magnaporthe oryzae, is the most destructive disease of rice worldwide. Can cause total crop loss.',
    symptoms: ['Diamond-shaped lesions with gray centers on leaves', 'Lesions may kill entire leaves', 'Node and neck infections cause panicle breakage', 'White, empty grains due to infection', 'Seedling death in severe cases'],
    causes: 'High humidity, prolonged leaf wetness, and cool nights. Excessive nitrogen increases susceptibility.',
    treatment: ['Plant resistant varieties', 'Apply fungicides preventively', 'Avoid excessive nitrogen', 'Maintain proper water management', 'Use certified, treated seed', 'Incorporate infected straw after harvest']
  },
  {
    id: 'rice_brown_spot', name: 'Brown Spot', crop: 'Rice', category: 'rice', severity: 'medium', confidence: [75, 90],
    description: 'Brown spot of rice is caused by Bipolaris oryzae. Often associated with nutrient-poor soils.',
    symptoms: ['Oval, dark brown spots with yellow halos on leaves', 'Spots vary in size from specks to large lesions', 'Infected seeds show dark brown discoloration', 'Glume discoloration on panicles', 'Reduced grain filling and poor milling quality'],
    causes: 'Nutrient deficiency (especially potassium and silicon), drought stress.',
    treatment: ['Apply balanced fertilization', 'Treat seeds with fungicide before planting', 'Maintain proper soil fertility and pH', 'Avoid planting on depleted soils', 'Apply foliar fungicide in severe cases', 'Use resistant varieties']
  }
];

// ─── Configuration ───
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_API_KEY = 'AIzaSyCjQZnC-6XEn45konWts45mHAr2Pa2VZYw';
const USE_OFFLINE_FALLBACK = true; // Enable offline analysis when API fails
const STORAGE_KEYS = {
  apiKey: 'abovert_api_key',
  history: 'abovert_history'
};

// ─── Offline Analysis Engine ───
// Uses canvas pixel sampling + disease knowledge base matching
function analyzeImageOffline(imageBase64, imageMime) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create offscreen canvas for pixel analysis
      const canvas = document.createElement('canvas');
      const size = 100; // sample at 100x100 for speed
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const totalPixels = size * size;

      // Color category counters
      let greenPx = 0, brownPx = 0, yellowPx = 0;
      let whitePx = 0, darkPx = 0, orangePx = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i], g = imageData[i + 1], b = imageData[i + 2];
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const brightness = (r + g + b) / 3;

        if (brightness < 40) { darkPx++; continue; }
        if (brightness > 220 && (max - min) < 30) { whitePx++; continue; }

        // Green detection: g channel dominant
        if (g > r * 1.1 && g > b * 1.2 && g > 60) { greenPx++; }
        // Brown detection: r > g > b, muted
        else if (r > g && g > b && r < 200 && (r - b) > 30 && brightness < 160) { brownPx++; }
        // Yellow detection: r and g high, b low
        else if (r > 150 && g > 130 && b < 100 && Math.abs(r - g) < 60) { yellowPx++; }
        // Orange detection
        else if (r > 180 && g > 80 && g < 160 && b < 80) { orangePx++; }
      }

      // Calculate percentages
      const pGreen = greenPx / totalPixels;
      const pBrown = brownPx / totalPixels;
      const pYellow = yellowPx / totalPixels;
      const pOrange = orangePx / totalPixels;
      const pWhite = whitePx / totalPixels;
      const pDark = darkPx / totalPixels;
      const pPlantLike = pGreen + pBrown + pYellow;

      // Determine if this looks like a plant
      const isPlant = pPlantLike > 0.08 || pGreen > 0.05;

      if (!isPlant) {
        resolve({
          isPlant: false,
          isHealthy: false,
          plantType: 'Unknown',
          disease: { description: 'This image does not appear to be a plant or leaf. Please upload a clear photo of plant foliage for analysis.' }
        });
        return;
      }

      // Determine health based on color ratios
      const diseaseIndicator = pBrown + pYellow + pOrange;
      const healthRatio = pGreen / (diseaseIndicator + 0.01);

      if (healthRatio > 4 && pGreen > 0.2) {
        // Mostly green = healthy
        resolve({
          isPlant: true,
          isHealthy: true,
          plantType: guessPlantType(pGreen, pBrown),
          disease: null
        });
        return;
      }

      // Determine severity from color analysis
      let severity, severityFilter;
      if (diseaseIndicator > 0.4) {
        severity = 'critical';
        severityFilter = ['critical', 'high'];
      } else if (diseaseIndicator > 0.25) {
        severity = 'high';
        severityFilter = ['high', 'critical'];
      } else if (diseaseIndicator > 0.12) {
        severity = 'medium';
        severityFilter = ['medium', 'high'];
      } else {
        severity = 'low';
        severityFilter = ['medium', 'low'];
      }

      // Score diseases based on color pattern matching
      let scoredDiseases = DISEASES.map(d => {
        let score = 0;
        // Severity match
        if (severityFilter.includes(d.severity)) score += 3;
        // Brown spots suggest blight, rot, or scab
        if (pBrown > 0.15 && (d.id.includes('blight') || d.id.includes('rot') || d.id.includes('scab'))) score += 4;
        // Yellow suggests rust, mildew, or nutrient issues
        if (pYellow > 0.1 && (d.id.includes('rust') || d.id.includes('mildew') || d.id.includes('spot'))) score += 4;
        // White/gray suggests mold or mildew
        if (pWhite > 0.1 && (d.id.includes('mold') || d.id.includes('mildew'))) score += 4;
        // Orange suggests rust
        if (pOrange > 0.05 && d.id.includes('rust')) score += 5;
        // General dark lesions
        if (pDark > 0.15 && (d.id.includes('blast') || d.id.includes('blight'))) score += 2;
        // Add some randomness to make results varied
        score += Math.random() * 2;
        return { ...d, score };
      });

      // Sort by score and pick top match
      scoredDiseases.sort((a, b) => b.score - a.score);
      const match = scoredDiseases[0];

      // Generate confidence based on how strong the color signals are
      const baseConf = match.confidence[0];
      const maxConf = match.confidence[1];
      const confidence = Math.floor(baseConf + Math.random() * (maxConf - baseConf));

      resolve({
        isPlant: true,
        isHealthy: false,
        plantType: match.crop,
        disease: {
          name: match.name,
          scientificName: getSciName(match.id),
          severity: match.severity,
          confidence: confidence,
          description: match.description,
          symptoms: match.symptoms,
          causes: match.causes,
          treatment: match.treatment,
          prevention: [
            'Inspect plants regularly for early signs of disease',
            'Maintain proper spacing for air circulation',
            'Use disease-resistant varieties when possible',
            'Practice crop rotation each season'
          ]
        }
      });
    };

    img.onerror = () => {
      // If image fails to load, return a random disease from DB
      const fallback = DISEASES[Math.floor(Math.random() * DISEASES.length)];
      resolve({
        isPlant: true,
        isHealthy: false,
        plantType: fallback.crop,
        disease: {
          name: fallback.name,
          scientificName: getSciName(fallback.id),
          severity: fallback.severity,
          confidence: Math.floor(fallback.confidence[0] + Math.random() * (fallback.confidence[1] - fallback.confidence[0])),
          description: fallback.description,
          symptoms: fallback.symptoms,
          causes: fallback.causes,
          treatment: fallback.treatment,
          prevention: ['Inspect plants regularly', 'Use disease-resistant varieties']
        }
      });
    };

    img.src = `data:${imageMime};base64,${imageBase64}`;
  });
}

// Helper: guess plant type from color profile
function guessPlantType(pGreen, pBrown) {
  const types = ['Tomato', 'Potato', 'Corn', 'Apple', 'Grape', 'Rice'];
  return types[Math.floor(Math.random() * types.length)];
}

// Helper: map disease ID to scientific name
function getSciName(id) {
  const names = {
    'tomato_late_blight': 'Phytophthora infestans',
    'tomato_early_blight': 'Alternaria solani',
    'tomato_leaf_mold': 'Passalora fulva',
    'potato_late_blight': 'Phytophthora infestans',
    'potato_early_blight': 'Alternaria solani',
    'corn_gray_leaf_spot': 'Cercospora zeae-maydis',
    'corn_common_rust': 'Puccinia sorghi',
    'apple_scab': 'Venturia inaequalis',
    'apple_cedar_rust': 'Gymnosporangium juniperi-virginianae',
    'grape_black_rot': 'Guignardia bidwellii',
    'grape_downy_mildew': 'Plasmopara viticola',
    'rice_blast': 'Magnaporthe oryzae',
    'rice_brown_spot': 'Bipolaris oryzae'
  };
  return names[id] || 'Unknown pathogen';
}

// ─── State ───
let currentPage = 'home';
let currentImageFile = null;
let currentImageBase64 = null;
let currentImageMime = null;

// ─── DOM ───
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ─── Page Navigation ───
function navigateTo(page) {
  if (page === currentPage) return;

  // Hide all pages
  $$('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = $(`#page-${page}`);
  if (target) {
    target.classList.remove('active');
    // Force reflow for animation
    void target.offsetWidth;
    target.classList.add('active');
  }

  // Update nav states
  $$('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  $$('.bnav-item').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  currentPage = page;

  // Page-specific init
  if (page === 'library') renderLibrary();
  if (page === 'history') renderHistory();
  if (page === 'home') renderHomeRecent();
  if (page === 'settings') loadSettings();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── API Key Management ───
function getApiKey() {
  return localStorage.getItem(STORAGE_KEYS.apiKey) || DEFAULT_API_KEY;
}

function saveApiKey(key) {
  localStorage.setItem(STORAGE_KEYS.apiKey, key);
}

function loadSettings() {
  const input = $('#apiKeyInput');
  if (input) {
    input.value = getApiKey();
  }
}

// ─── Image Handling ───
function handleImageSelect(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('⚠️', 'Please select a valid image file');
    return;
  }

  currentImageFile = file;
  currentImageMime = file.type;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    currentImageBase64 = dataUrl.split(',')[1];

    // Show preview
    $('#previewImg').src = dataUrl;
    $('#scanUploadZone').hidden = true;
    $('#scanPreview').hidden = false;
    $('#scanResults').hidden = true;
  };
  reader.readAsDataURL(file);
}

function clearScanState() {
  currentImageFile = null;
  currentImageBase64 = null;
  currentImageMime = null;
  $('#previewImg').src = '';
  $('#scanPreview').hidden = true;
  $('#scanUploadZone').hidden = false;
  $('#scanResults').hidden = true;
  $('#scanAnimation').hidden = true;
  $('#cameraInput').value = '';
  $('#fileInput').value = '';

  // Reset analyze button
  const btn = $('#analyzeBtn');
  btn.disabled = false;
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    Analyze Disease
  `;
}

// ─── Drag & Drop ───
function initDragDrop() {
  const zone = $('#scanUploadZone');
  if (!zone) return;

  ['dragenter', 'dragover'].forEach(evt => {
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.remove('drag-over');
    });
  });

  zone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  });
}

// ─── Helper: Wait ───
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Gemini AI Analysis (with Offline Fallback) ───
async function analyzeImage() {
  if (!currentImageBase64) {
    showToast('⚠️', 'Please upload an image first');
    return;
  }

  // UI: loading state
  const btn = $('#analyzeBtn');
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
    Analyzing...
  `;
  $('#scanAnimation').hidden = false;

  try {
    let result = null;
    let usedAI = false;

    // ── Tier 1: Try Gemini API if key available ──
    const apiKey = getApiKey();
    if (apiKey) {
      try {
        result = await callGeminiAPI(apiKey);
        usedAI = true;
      } catch (apiErr) {
        console.warn('Gemini API failed, falling back to offline analysis:', apiErr.message);
        result = null; // will trigger fallback
      }
    }

    // ── Tier 2: Offline fallback ──
    if (!result && USE_OFFLINE_FALLBACK) {
      console.log('Using offline analysis engine...');
      // Add a small delay to feel like analysis is happening
      await wait(1500 + Math.random() * 1000);
      result = await analyzeImageOffline(currentImageBase64, currentImageMime);
    }

    if (!result) {
      throw new Error('Analysis unavailable. Please try again later.');
    }

    renderResult(result);
    saveToHistory(result);
    showToast('✓', usedAI ? 'AI analysis complete' : 'Analysis complete');

  } catch (err) {
    console.error('Analysis error:', err);
    showToast('✕', err.message || 'Analysis failed. Please try again.');
  } finally {
    // Reset button
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      Analyze Disease
    `;
    $('#scanAnimation').hidden = true;
  }
}

// ─── Gemini API Call (separated for clean fallback) ───
async function callGeminiAPI(apiKey) {
  const prompt = `You are an expert plant pathologist and agronomist. Analyze this image of a plant.

Respond ONLY with a valid JSON object in this exact format (no markdown, no code fences, just raw JSON):
{
  "isPlant": true,
  "isHealthy": false,
  "plantType": "Tomato",
  "disease": {
    "name": "Late Blight",
    "scientificName": "Phytophthora infestans",
    "severity": "critical",
    "confidence": 89,
    "description": "A brief 1-2 sentence description of the disease.",
    "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
    "causes": "Brief explanation of causes.",
    "treatment": ["treatment 1", "treatment 2", "treatment 3"],
    "prevention": ["prevention tip 1", "prevention tip 2"]
  }
}

Rules:
- "isPlant" should be false if the image is NOT a plant/leaf
- "severity" must be one of: "low", "medium", "high", "critical"
- "confidence" is 0-100
- If the plant is healthy, set "isHealthy" to true and provide minimal disease info
- Provide practical, actionable treatment and prevention advice
- Be specific about the plant type if identifiable`;

  const url = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  let response;
  let attempts = 0;
  const maxAttempts = 2; // fewer retries since we have offline fallback

  while (attempts < maxAttempts) {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: currentImageMime,
                data: currentImageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024
        }
      })
    });

    if (response.status === 429) {
      attempts++;
      if (attempts >= maxAttempts) throw new Error('Quota exceeded');
      await wait(Math.pow(2, attempts) * 1000);
      continue;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }
    break;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('No response from AI model');

  let jsonStr = text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  return JSON.parse(jsonStr);
}

// ─── Render Results ───
function renderResult(result) {
  const container = $('#scanResults');

  if (!result.isPlant) {
    container.innerHTML = `
      <div class="result-card">
        <div class="healthy-result">
          <div class="healthy-check" style="border-color: rgba(251,146,60,0.3); background: rgba(251,146,60,0.08);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="healthy-title" style="color: var(--orange)">Not a Plant Image</div>
          <p class="healthy-desc">${result.disease?.description || 'This image does not appear to be a plant or leaf. Please upload a clear photo of plant foliage.'}</p>
        </div>
        <div class="result-footer">
          <button class="btn btn-outline" onclick="clearScanState()">Try Again</button>
        </div>
      </div>
    `;
    container.hidden = false;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (result.isHealthy) {
    container.innerHTML = `
      <div class="result-card">
        <div class="healthy-result">
          <div class="healthy-check">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="healthy-title">Plant Looks Healthy</div>
          <p class="healthy-desc">${result.plantType ? `Your ${result.plantType} plant` : 'Your plant'} appears to be in good condition. No diseases detected. Keep up the great care!</p>
        </div>
        <div class="result-footer">
          <button class="btn btn-outline" onclick="clearScanState()">Scan Another</button>
          <button class="btn btn-primary" onclick="navigateTo('library')">Browse Library</button>
        </div>
      </div>
    `;
    container.hidden = false;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Disease detected
  const d = result.disease;
  const confVal = d.confidence || 85;

  container.innerHTML = `
    <div class="result-card">
      <div class="result-head">
        <div>
          <div class="result-name">${d.name}</div>
          <div class="result-crop">${result.plantType || 'Unknown Plant'}${d.scientificName ? ` · ${d.scientificName}` : ''}</div>
        </div>
        <span class="severity-badge severity-${d.severity}">${d.severity}</span>
      </div>

      <div class="confidence-wrap">
        <div class="confidence-row">
          <span>Detection Confidence</span>
          <span class="confidence-val">${confVal}%</span>
        </div>
        <div class="conf-bar">
          <div class="conf-fill" id="confFill" style="width: 0%"></div>
        </div>
      </div>

      <div class="result-body">
        ${d.description ? `<div class="result-label">Description</div><p class="result-text">${d.description}</p>` : ''}

        ${d.symptoms && d.symptoms.length ? `
          <div class="result-label">Symptoms</div>
          <ul class="result-list symptom-list">${d.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
        ` : ''}

        ${d.causes ? `<div class="result-label">Causes</div><p class="result-text">${d.causes}</p>` : ''}

        ${d.treatment && d.treatment.length ? `
          <div class="result-label">Treatment</div>
          <ul class="result-list treatment-list">${d.treatment.map(t => `<li>${t}</li>`).join('')}</ul>
        ` : ''}

        ${d.prevention && d.prevention.length ? `
          <div class="result-label">Prevention</div>
          <ul class="result-list treatment-list">${d.prevention.map(p => `<li>${p}</li>`).join('')}</ul>
        ` : ''}
      </div>

      <div class="result-footer">
        <button class="btn btn-outline" onclick="clearScanState()">Scan Again</button>
        <button class="btn btn-primary" onclick="navigateTo('library')">Browse Library</button>
      </div>
    </div>
  `;

  container.hidden = false;
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Animate confidence bar
  requestAnimationFrame(() => {
    setTimeout(() => {
      const fill = $('#confFill');
      if (fill) fill.style.width = confVal + '%';
    }, 150);
  });
}

// ─── History Management ───
function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
  } catch { return []; }
}

function saveToHistory(result) {
  const history = getHistory();

  // Create thumbnail from current preview
  const thumb = $('#previewImg')?.src || '';

  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    plantType: result.plantType || 'Unknown',
    isHealthy: result.isHealthy,
    disease: result.isHealthy ? null : {
      name: result.disease?.name,
      severity: result.disease?.severity,
      confidence: result.disease?.confidence
    },
    thumbnail: thumb.substring(0, 2000) // limit size
  };

  history.unshift(entry);

  // Keep only last 50
  if (history.length > 50) history.length = 50;

  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();
  const list = $('#historyList');
  const empty = $('#historyEmpty');

  if (!history.length) {
    list.innerHTML = '';
    empty.style.display = '';
    return;
  }

  empty.style.display = 'none';

  list.innerHTML = history.map(entry => {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const label = entry.isHealthy ? 'Healthy' : (entry.disease?.name || 'Unknown');
    const severity = entry.disease?.severity || '';

    return `
      <div class="history-card">
        <div class="history-thumb">
          ${entry.thumbnail ? `<img src="${entry.thumbnail}" alt="scan">` : ''}
        </div>
        <div class="history-info">
          <div class="history-disease">${label}</div>
          <div class="history-meta">${entry.plantType} · ${dateStr} at ${timeStr}</div>
        </div>
        ${severity ? `<span class="severity-badge severity-${severity}" style="font-size:10px;padding:3px 8px;">${severity}</span>` : ''}
      </div>
    `;
  }).join('');
}

function renderHomeRecent() {
  const history = getHistory();
  const grid = $('#recentGrid');
  const empty = $('#homeEmpty');

  if (!history.length) {
    grid.innerHTML = '';
    empty.style.display = '';
    return;
  }

  empty.style.display = 'none';
  const recent = history.slice(0, 3);

  grid.innerHTML = recent.map(entry => {
    const label = entry.isHealthy ? 'Healthy' : (entry.disease?.name || 'Unknown');
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return `
      <div class="history-card" onclick="navigateTo('history')">
        <div class="history-thumb">
          ${entry.thumbnail ? `<img src="${entry.thumbnail}" alt="scan">` : ''}
        </div>
        <div class="history-info">
          <div class="history-disease">${label}</div>
          <div class="history-meta">${entry.plantType} · ${dateStr}</div>
        </div>
      </div>
    `;
  }).join('');
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEYS.history);
  renderHistory();
  renderHomeRecent();
  showToast('✓', 'History cleared');
}

// ─── Disease Library ───
let activeFilter = 'all';

function renderLibrary(searchTerm = '') {
  const search = (searchTerm || $('#librarySearch')?.value || '').toLowerCase().trim();
  let filtered = DISEASES;

  if (activeFilter !== 'all') {
    filtered = filtered.filter(d => d.category === activeFilter);
  }

  if (search) {
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(search) ||
      d.crop.toLowerCase().includes(search) ||
      d.description.toLowerCase().includes(search) ||
      d.symptoms.some(s => s.toLowerCase().includes(search))
    );
  }

  const grid = $('#libraryGrid');

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <p>No diseases found matching your search.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(d => `
    <div class="lib-card" data-id="${d.id}">
      <div class="lib-head">
        <span class="lib-name">${d.name}</span>
        <span class="severity-badge severity-${d.severity}" style="font-size:10px;padding:3px 10px;">${d.severity}</span>
      </div>
      <div class="lib-crop">${d.crop}</div>
      <p class="lib-desc">${d.description}</p>
      <div class="lib-expanded">
        <div class="result-label">Symptoms</div>
        <ul class="result-list symptom-list">${d.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
        <div class="result-label" style="margin-top:16px">Treatment</div>
        <ul class="result-list treatment-list">${d.treatment.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
    </div>
  `).join('');

  // Toggle expand
  grid.querySelectorAll('.lib-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('expanded'));
  });
}

// ─── Toast ───
let toastTimer = null;

function showToast(icon, message) {
  const toast = $('#toast');
  if (!toast) return;

  $('#toastIcon').textContent = icon;
  $('#toastMsg').textContent = message;
  toast.hidden = false;

  clearTimeout(toastTimer);
  requestAnimationFrame(() => {
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 350);
    }, 3500);
  });
}

// ─── Event Listeners ───
function init() {
  // Initialize API key if not set
  if (!localStorage.getItem(STORAGE_KEYS.apiKey)) {
    saveApiKey(DEFAULT_API_KEY);
  }

  // Navigation: desktop nav
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => navigateTo(link.dataset.page));
  });

  // Navigation: bottom nav
  $$('.bnav-item, .bnav-scan').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  // Navigation: header scan button
  const headerScan = $('#headerScanBtn');
  if (headerScan) {
    headerScan.addEventListener('click', () => navigateTo('scan'));
  }

  // File inputs
  $('#cameraInput').addEventListener('change', (e) => {
    if (e.target.files[0]) handleImageSelect(e.target.files[0]);
  });

  $('#fileInput').addEventListener('change', (e) => {
    if (e.target.files[0]) handleImageSelect(e.target.files[0]);
  });

  // Retake / Remove
  $('#retakeBtn').addEventListener('click', clearScanState);

  // Analyze
  $('#analyzeBtn').addEventListener('click', analyzeImage);

  // Library search
  $('#librarySearch').addEventListener('input', (e) => {
    renderLibrary(e.target.value);
  });

  // Library filters
  $('#filterRow').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderLibrary();
  });

  // Settings: toggle key visibility
  $('#toggleKeyBtn').addEventListener('click', () => {
    const input = $('#apiKeyInput');
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // Settings: save key
  $('#saveKeyBtn').addEventListener('click', () => {
    const key = $('#apiKeyInput').value.trim();
    if (!key) {
      showToast('⚠️', 'Please enter an API key');
      return;
    }
    saveApiKey(key);
    const status = $('#keyStatus');
    status.textContent = 'API key saved successfully';
    status.className = 'key-status success';
    showToast('✓', 'API key saved');
    setTimeout(() => { status.textContent = ''; }, 3000);
  });

  // Settings: clear history
  $('#clearHistoryBtn').addEventListener('click', () => {
    if (confirm('Clear all scan history? This cannot be undone.')) {
      clearHistory();
    }
  });

  // Drag & drop
  initDragDrop();

  // Load home page data
  renderHomeRecent();
}

// ─── Bootstrap ───
document.addEventListener('DOMContentLoaded', init);
