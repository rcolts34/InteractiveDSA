export function euclideanDistance(vecA, vecB) {
      const allTags = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    
      let sumSquares = 0;
    
      allTags.forEach(tag => {
        const a = vecA[tag] || 0;
        const b = vecB[tag] || 0;
        const diff = a - b;
        sumSquares += diff * diff;
      });
    
      return Math.sqrt(sumSquares);
    }
    