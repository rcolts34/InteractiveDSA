export function analyzeTagFrequency(games) {
      const tagFrequency = {};
    
      games.forEach(game => {
        const tags = game.Tags?.split(',').map(t => t.trim().toLowerCase()) || [];
    
        tags.forEach(tag => {
          if (tag) {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
          }
        });
      });
    
      // Optional: return a sorted array of [tag, count] pairs
      const sorted = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]);
    
      return {
        tagFrequency,
        sorted
      };
    }
    