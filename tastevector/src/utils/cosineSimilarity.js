export function cosineSimilarity(vecA, vecB) {
      let dot = 0;
      let magA = 0;
      let magB = 0;
    
      const allTags = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    
      allTags.forEach(tag => {
        const a = vecA[tag] || 0;
        const b = vecB[tag] || 0;
    
        dot += a * b;
        magA += a * a;
        magB += b * b;
      });
    
      const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
      return magnitude === 0 ? 0 : dot / magnitude;
    }
    