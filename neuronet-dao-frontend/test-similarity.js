// Simple test to demonstrate the similarity techniques
// This file serves as a reference for understanding the similarity detection

// Example content from your use case
const content1 = "A breathtaking cityscape of futuristic architecture, featuring towering skyscrapers with organic flowing shapes, luminous glass facades, and glowing neon accents. The skyline blends advanced technology with nature — buildings covered in vertical gardens, hovering transport pods moving between structures, and vast skybridges connecting towers. The atmosphere is sleek, clean, and filled with soft ambient light, evoking a sense of utopian design. Hyper-detailed, ultra-realistic, cinematic perspective, 8K quality.";

const content2 = "A stunning metropolis of neo-futuristic architecture, with sleek skyscrapers designed in fluid geometric patterns, shimmering metallic surfaces, and radiant holographic projections. The city merges innovation with sustainability — towers integrated with solar panels, sky gardens on every level, and autonomous aerial vehicles weaving through elevated skybridges. The mood is visionary, elegant, and illuminated by a soft glow that highlights the advanced design. Hyper-detailed, ultra-realistic, cinematic angle, 8K resolution.";

// ===== SIMILARITY CALCULATION FUNCTIONS =====

// 1. Jaccard Similarity - Word overlap
function calculateJaccardSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(word => set2.has(word)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// 2. Cosine Similarity - TF-IDF based
function calculateCosineSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  // Create word frequency maps
  const freq1 = createWordFrequencyMap(words1);
  const freq2 = createWordFrequencyMap(words2);
  
  // Get all unique words
  const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  
  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (const word of allWords) {
    const f1 = freq1[word] || 0;
    const f2 = freq2[word] || 0;
    
    dotProduct += f1 * f2;
    magnitude1 += f1 * f1;
    magnitude2 += f2 * f2;
  }
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

// 3. Levenshtein Distance - Edit distance
function calculateLevenshteinSimilarity(text1, text2) {
  const maxLength = Math.max(text1.length, text2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(text1, text2);
  return 1 - (distance / maxLength);
}

function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,      // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// 4. N-gram Similarity - Character sequences
function calculateNgramSimilarity(text1, text2, n = 3) {
  const ngrams1 = generateNgrams(text1.toLowerCase(), n);
  const ngrams2 = generateNgrams(text2.toLowerCase(), n);
  
  const set1 = new Set(ngrams1);
  const set2 = new Set(ngrams2);
  
  const intersection = new Set([...set1].filter(ngram => set2.has(ngram)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

function generateNgrams(text, n) {
  const ngrams = [];
  for (let i = 0; i <= text.length - n; i++) {
    ngrams.push(text.substring(i, i + n));
  }
  return ngrams;
}

// 5. Semantic Similarity - Keyword matching
function calculateSemanticSimilarity(text1, text2) {
  // Define semantic keyword groups
  const semanticGroups = {
    architecture: ['building', 'structure', 'design', 'architectural', 'construction', 'skyscraper', 'tower', 'facade'],
    technology: ['tech', 'digital', 'electronic', 'computer', 'software', 'hardware', 'ai', 'artificial', 'intelligence'],
    nature: ['natural', 'organic', 'green', 'environmental', 'sustainable', 'eco', 'garden', 'forest', 'tree'],
    urban: ['city', 'urban', 'metropolitan', 'downtown', 'street', 'avenue', 'plaza', 'district'],
    futuristic: ['futuristic', 'modern', 'contemporary', 'advanced', 'innovative', 'cutting-edge', 'state-of-the-art'],
    lighting: ['light', 'illumination', 'bright', 'glow', 'shine', 'luminous', 'radiant', 'brilliant'],
    color: ['colorful', 'vibrant', 'bright', 'vivid', 'saturated', 'hue', 'tone', 'shade']
  };
  
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  let semanticMatches = 0;
  let totalSemanticWords = 0;
  
  for (const [group, keywords] of Object.entries(semanticGroups)) {
    const matches1 = words1.filter(word => keywords.includes(word)).length;
    const matches2 = words2.filter(word => keywords.includes(word)).length;
    
    if (matches1 > 0 && matches2 > 0) {
      semanticMatches += Math.min(matches1, matches2);
    }
    totalSemanticWords += Math.max(matches1, matches2);
  }
  
  return totalSemanticWords > 0 ? semanticMatches / totalSemanticWords : 0;
}

// 6. Length Similarity
function calculateLengthSimilarity(text1, text2) {
  const len1 = text1.length;
  const len2 = text2.length;
  const maxLen = Math.max(len1, len2);
  
  if (maxLen === 0) return 1;
  
  return 1 - Math.abs(len1 - len2) / maxLen;
}

// Helper function for word frequency
function createWordFrequencyMap(words) {
  const freq = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }
  return freq;
}

// Main similarity calculation function
function calculateSimilarity(content1, content2) {
  // Multiple similarity techniques for better accuracy
  
  // 1. Jaccard Similarity (word overlap)
  const jaccardSim = calculateJaccardSimilarity(content1, content2);
  
  // 2. Cosine Similarity (TF-IDF based)
  const cosineSim = calculateCosineSimilarity(content1, content2);
  
  // 3. Levenshtein Distance (edit distance)
  const levenshteinSim = calculateLevenshteinSimilarity(content1, content2);
  
  // 4. N-gram Similarity (character sequences)
  const ngramSim = calculateNgramSimilarity(content1, content2);
  
  // 5. Semantic Similarity (keyword matching)
  const semanticSim = calculateSemanticSimilarity(content1, content2);
  
  // 6. Length Similarity
  const lengthSim = calculateLengthSimilarity(content1, content2);
  
  // Weighted combination of all techniques
  const finalSimilarity = (
    jaccardSim * 0.25 +      // Word overlap
    cosineSim * 0.25 +        // TF-IDF similarity
    levenshteinSim * 0.15 +   // Edit distance
    ngramSim * 0.15 +         // Character sequences
    semanticSim * 0.15 +      // Semantic keywords
    lengthSim * 0.05          // Length similarity
  );
  
  return {
    finalSimilarity: Math.min(finalSimilarity * 100, 100),
    jaccardSim: jaccardSim * 100,
    cosineSim: cosineSim * 100,
    levenshteinSim: levenshteinSim * 100,
    ngramSim: ngramSim * 100,
    semanticSim: semanticSim * 100,
    lengthSim: lengthSim * 100
  };
}

// ===== RUN THE ACTUAL TEST =====

console.log("Testing similarity techniques:");
console.log("Content 1:", content1.substring(0, 100) + "...");
console.log("Content 2:", content2.substring(0, 100) + "...");
console.log("");

// Calculate actual similarity
const results = calculateSimilarity(content1, content2);

console.log("ACTUAL SIMILARITY ANALYSIS:");
console.log(`- Jaccard Similarity: ${results.jaccardSim.toFixed(1)}% (word overlap)`);
console.log(`- Cosine Similarity: ${results.cosineSim.toFixed(1)}% (TF-IDF)`);
console.log(`- Levenshtein Distance: ${results.levenshteinSim.toFixed(1)}% (edit distance)`);
console.log(`- N-gram Similarity: ${results.ngramSim.toFixed(1)}% (character sequences)`);
console.log(`- Semantic Similarity: ${results.semanticSim.toFixed(1)}% (keyword matching)`);
console.log(`- Length Similarity: ${results.lengthSim.toFixed(1)}% (text length)`);
console.log("");
console.log(`Final Weighted Similarity: ${results.finalSimilarity.toFixed(1)}%`);
console.log(`Recommendation: ${results.finalSimilarity >= 95 ? 'REJECT' : results.finalSimilarity >= 85 ? 'REVIEW' : 'ACCEPT'} (${results.finalSimilarity >= 95 ? 'exceeds 95% threshold' : results.finalSimilarity >= 85 ? 'high similarity, needs review' : 'acceptable similarity'})`);
console.log("");
console.log("Key Similarities Found:");
console.log("- Both describe futuristic cityscapes");
console.log("- Both mention skyscrapers and architecture");
console.log("- Both use similar technical terms (8K, hyper-detailed)");
console.log("- Both describe lighting and atmosphere");
console.log("- Both mention advanced technology themes");
console.log("");
console.log("=== Similarity Techniques Explained ===");
console.log("");
console.log("1. JACCARD SIMILARITY (25% weight)");
console.log("   - Measures word overlap between texts");
console.log("   - Formula: intersection / union of word sets");
console.log("   - Best for: Detecting shared vocabulary");
console.log("");
console.log("2. COSINE SIMILARITY (25% weight)");
console.log("   - TF-IDF based vector similarity");
console.log("   - Uses word frequency to calculate similarity");
console.log("   - Best for: Understanding content importance");
console.log("");
console.log("3. LEVENSHTEIN DISTANCE (15% weight)");
console.log("   - Edit distance calculation");
console.log("   - Measures character-level changes needed");
console.log("   - Best for: Detecting near-identical content");
console.log("");
console.log("4. N-GRAM SIMILARITY (15% weight)");
console.log("   - Character sequence analysis (trigrams)");
console.log("   - Compares 3-character sequences");
console.log("   - Best for: Detecting similar phrasing");
console.log("");
console.log("5. SEMANTIC SIMILARITY (15% weight)");
console.log("   - Keyword-based semantic matching");
console.log("   - Matches content by semantic categories");
console.log("   - Best for: Detecting similar themes");
console.log("");
console.log("6. LENGTH SIMILARITY (5% weight)");
console.log("   - Text length comparison");
console.log("   - Additional context for similarity");
console.log("   - Best for: Supporting other metrics");
console.log("");
console.log("=== Semantic Categories ===");
console.log("The system recognizes these semantic themes:");
console.log("- Architecture: building, structure, design, skyscraper, tower");
console.log("- Technology: digital, electronic, AI, artificial intelligence");
console.log("- Nature: organic, green, environmental, sustainable");
console.log("- Urban: city, metropolitan, downtown, street");
console.log("- Futuristic: modern, advanced, innovative, cutting-edge");
console.log("- Lighting: bright, glow, luminous, radiant");
console.log("- Color: vibrant, vivid, saturated, hue");
console.log("");
console.log("=== Weight Configuration ===");
console.log("You can adjust the weights in calculateSimilarity function:");
console.log("const finalSimilarity = (");
console.log("  jaccardSim * 0.25 +      // Word overlap");
console.log("  cosineSim * 0.25 +        // TF-IDF similarity");
console.log("  levenshteinSim * 0.15 +   // Edit distance");
console.log("  ngramSim * 0.15 +         // Character sequences");
console.log("  semanticSim * 0.15 +      // Semantic keywords");
console.log("  lengthSim * 0.05          // Length similarity");
console.log(");");
console.log("");
console.log("=== Usage Example ===");
console.log("// Frontend call");
console.log("const response = await fetch('/api/duplicate-check', {");
console.log("  method: 'POST',");
console.log("  body: JSON.stringify({ newContent, itemType })");
console.log("});");
console.log("");
console.log("// API response");
console.log("{");
console.log("  success: true,");
console.log("  data: {");
console.log("    similarityPercentage: 88.0,");
console.log("    isDuplicate: true,");
console.log("    recommendation: 'reject',");
console.log("    analysis: {");
console.log("      reasoning: 'Content shows high similarity in architectural themes...'");
console.log("    }");
console.log("  }");
console.log("}");
