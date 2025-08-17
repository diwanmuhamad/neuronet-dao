import { populateSampleData } from './populateSampleData';

console.log('🚀 Starting sample data population...');
console.log('This will create 15 items total:');
console.log('- 5 Prompts with random views and comments');
console.log('- 5 Datasets with random views and comments');
console.log('- 5 AI Outputs with random views and comments');
console.log('');
console.log('Each item will have:');
console.log('- Random views (5-50)');
console.log('- Random comments (0-10) with ratings (3-5 stars)');
console.log('- Different owners (randomized principals)');
console.log('- Randomized categories to minimize duplicates');
console.log('');

populateSampleData()
  .then(() => {
    console.log('✅ Sample data population completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error populating sample data:', error);
    process.exit(1);
  });
