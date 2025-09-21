import { z } from 'zod';

export const duplicateDetectionTool = {
  id: 'duplicate_detection_tool',
  name: 'duplicate_detection_tool',
  description: 'Analyze content similarity to detect potential duplicates in the marketplace',
  parameters: z.object({
    newContent: z.string().describe('The new content to be analyzed for similarity'),
    itemType: z.string().describe('Type of item (prompt, dataset, ai_output)'),
    existingContents: z.array(z.object({
      id: z.number(),
      title: z.string(),
      content: z.string(),
      contentHash: z.string().optional(),
      itemType: z.string(),
      category: z.string()
    })).describe('Array of existing content to compare against')
  }),
  execute: async ({ newContent, itemType, existingContents }: {
    newContent: string;
    itemType: string;
    existingContents: Array<{
      id: number;
      title: string;
      content: string;
      contentHash?: string;
      itemType: string;
      category: string;
    }>;
  }) => {
    try {
      // Filter contents by item type
      const relevantContents = existingContents.filter(item => item.itemType === itemType);
      
      if (relevantContents.length === 0) {
        return {
          success: true,
          data: {
            similarityPercentage: 0,
            isDuplicate: false,
            recommendation: 'accept',
            analysis: {
              similarities: [],
              differences: [],
              keyConcepts: [],
              reasoning: 'No existing content of the same type to compare against.'
            },
            existingItem: null
          }
        };
      }

      // Find the most similar content
      let highestSimilarity = 0;
      let mostSimilarItem = null;
      let similarityAnalysis = null;

      for (const item of relevantContents) {
        const similarity = await calculateSimilarity(newContent, item.content);
        
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          mostSimilarItem = item;
        }
      }

      // Determine if it's a duplicate based on 95% threshold
      const isDuplicate = highestSimilarity >= 95;
      const recommendation = isDuplicate ? 'reject' : (highestSimilarity >= 85 ? 'review' : 'accept');

      // Generate detailed analysis
      const analysis = await generateSimilarityAnalysis(newContent, mostSimilarItem?.content || '', highestSimilarity);

      return {
        success: true,
        data: {
          similarityPercentage: Math.round(highestSimilarity * 100) / 100,
          isDuplicate,
          recommendation,
          analysis,
          existingItem: mostSimilarItem ? {
            id: mostSimilarItem.id,
            title: mostSimilarItem.title,
            contentHash: mostSimilarItem.contentHash || '',
            similarityScore: highestSimilarity
          } : null
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Error analyzing content similarity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null
      };
    }
  }
};

// Function to calculate similarity between two content strings
async function calculateSimilarity(content1: string, content2: string): Promise<number> {
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
  
  return Math.min(finalSimilarity * 100, 100);
}

// 1. Jaccard Similarity - Word overlap
function calculateJaccardSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set(Array.from(set1).filter(word => set2.has(word)));
  const union = new Set([...Array.from(set1), ...Array.from(set2)]);
  
  return intersection.size / union.size;
}

// 2. Cosine Similarity - TF-IDF based
function calculateCosineSimilarity(text1: string, text2: string): number {
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
  
  for (const word of Array.from(allWords)) {
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
function calculateLevenshteinSimilarity(text1: string, text2: string): number {
  const maxLength = Math.max(text1.length, text2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(text1, text2);
  return 1 - (distance / maxLength);
}

function levenshteinDistance(str1: string, str2: string): number {
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
function calculateNgramSimilarity(text1: string, text2: string, n: number = 3): number {
  const ngrams1 = generateNgrams(text1.toLowerCase(), n);
  const ngrams2 = generateNgrams(text2.toLowerCase(), n);
  
  const set1 = new Set(ngrams1);
  const set2 = new Set(ngrams2);
  
  const intersection = new Set(Array.from(set1).filter(ngram => set2.has(ngram)));
  const union = new Set([...Array.from(set1), ...Array.from(set2)]);
  
  return intersection.size / union.size;
}

function generateNgrams(text: string, n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= text.length - n; i++) {
    ngrams.push(text.substring(i, i + n));
  }
  return ngrams;
}

// 5. Semantic Similarity - Keyword matching
function calculateSemanticSimilarity(text1: string, text2: string): number {
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
function calculateLengthSimilarity(text1: string, text2: string): number {
  const len1 = text1.length;
  const len2 = text2.length;
  const maxLen = Math.max(len1, len2);
  
  if (maxLen === 0) return 1;
  
  return 1 - Math.abs(len1 - len2) / maxLen;
}

// Helper function for word frequency
function createWordFrequencyMap(words: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }
  return freq;
}

// Function to generate detailed similarity analysis
async function generateSimilarityAnalysis(newContent: string, existingContent: string, similarity: number): Promise<{
  similarities: string[];
  differences: string[];
  keyConcepts: string[];
  reasoning: string;
}> {
  const similarities: string[] = [];
  const differences: string[] = [];
  const keyConcepts: string[] = [];
  
  // Extract key concepts from both contents
  const newWords = newContent.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const existingWords = existingContent.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  
  const commonWords = newWords.filter(word => existingWords.includes(word));
  const uniqueNewWords = newWords.filter(word => !existingWords.includes(word));
  const uniqueExistingWords = existingWords.filter(word => !newWords.includes(word));
  
  // Identify similarities
  if (commonWords.length > 0) {
    similarities.push(`Shared vocabulary: ${commonWords.slice(0, 10).join(', ')}`);
  }
  
  if (newContent.length > 0 && existingContent.length > 0) {
    const lengthRatio = Math.min(newContent.length, existingContent.length) / Math.max(newContent.length, existingContent.length);
    if (lengthRatio > 0.8) {
      similarities.push('Similar content length');
    }
  }
  
  // Identify differences
  if (uniqueNewWords.length > 0) {
    differences.push(`New content includes: ${uniqueNewWords.slice(0, 5).join(', ')}`);
  }
  
  if (uniqueExistingWords.length > 0) {
    differences.push(`Existing content includes: ${uniqueExistingWords.slice(0, 5).join(', ')}`);
  }
  
  // Extract key concepts (simplified)
  const allWords = Array.from(new Set([...Array.from(newWords), ...Array.from(existingWords)]));
  keyConcepts.push(...allWords.slice(0, 10));
  
  // Generate reasoning
  let reasoning = '';
  if (similarity >= 95) {
    reasoning = 'Content is nearly identical to existing item. High risk of duplication.';
  } else if (similarity >= 85) {
    reasoning = 'Content shows high similarity to existing item. Requires careful review.';
  } else if (similarity >= 70) {
    reasoning = 'Content has moderate similarity to existing item. May be acceptable with proper differentiation.';
  } else {
    reasoning = 'Content shows low similarity to existing items. Likely acceptable.';
  }
  
  return {
    similarities,
    differences,
    keyConcepts,
    reasoning
  };
}
