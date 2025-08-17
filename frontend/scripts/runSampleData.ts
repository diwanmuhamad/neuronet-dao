import { populateSampleData } from './populateSampleData';

console.log('🚀 Starting sample data population...');
console.log('This will create 60 items total:');
console.log('- 10 Featured Prompts (most viewed)');
console.log('- 10 Featured Datasets (most viewed)');
console.log('- 10 Featured AI Outputs (most viewed)');
console.log('- 10 Trending Prompts (most viewed & commented)');
console.log('- 10 Trending Datasets (most viewed & commented)');
console.log('- 10 Trending AI Outputs (most viewed & commented)');
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
