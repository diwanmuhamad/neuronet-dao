# Sample Data Population Script

This script populates the backend with sample data for featured and trending items across all three types: prompts, datasets, and AI outputs.

## What it creates:

### Featured Items (Most Viewed)
- **10 Featured Prompts** - High-quality AI prompts with many views
- **10 Featured Datasets** - Comprehensive datasets with high view counts
- **10 Featured AI Outputs** - Professional AI-generated content with many views

### Trending Items (Most Viewed & Commented)
- **10 Trending Prompts** - Popular prompts with high engagement (views + comments)
- **10 Trending Datasets** - Popular datasets with high engagement
- **10 Trending AI Outputs** - Popular AI outputs with high engagement

## Categories Used:

### Prompts
- Midjourney, DALL-E, Stable Diffusion, Leonardo AI
- Randomized to minimize duplicates

### Datasets
- Healthcare, Finance, NLP, Vision, IoT, Climate, Audio, Security, Legal, Gaming
- Randomized to minimize duplicates

### AI Outputs
- Branding, Copywriting, Photography, Social Media, UI/UX, Video, SEO, Business, Education, Technical
- Randomized to minimize duplicates

## How to run:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the script:**
   ```bash
   npm run populate-data
   ```

## What the script does:

1. Creates 60 items total (30 featured + 30 trending)
2. Adds realistic view counts to create "most viewed" items
3. Adds comments and ratings to create "trending" items
4. Uses diverse categories to minimize duplicates
5. Provides detailed console output showing progress

## Sample Data Features:

- **Realistic titles and descriptions** for each item type
- **Varied pricing** based on item complexity and value
- **Diverse categories** to showcase different use cases
- **Quality comments** with realistic ratings (3-5 stars)
- **High view counts** to simulate popular content

## Notes:

- The script uses multiple principals to create items with different owners
- Items are randomly assigned to different principals for realistic data distribution
- All items are created with metadata tags for easy identification
- Featured items get 40-50 views each
- Trending items get 60+ views and 8 comments each
- Categories are randomized to ensure variety

## Principals Used:

The script uses the following principals to create items with different owners:
- `pubpm-wpthe-cmn2p-awz2m-zwvek-rxqt5-kh3kt-jxvjh-ycppn-g5vov-mqe` (your provided principal)
- Multiple anonymous identities (`2vxsx-fae`) for variety

This creates a more realistic marketplace with items from different creators.

## Backend Requirements:

The script requires the backend to have the `create_item_for_user` function added to the main.mo file and the corresponding DID file updated. This function allows creating items for different principals, which is necessary for creating realistic sample data with multiple owners.

## Output:

The script will show progress in the console and provide a summary at the end:
```
✅ Sample data population completed successfully!
Created 60 items total

Summary:
- Featured Items: 30 (most viewed)
- Trending Items: 30 (most viewed & commented)
- Total Items Created: 60
```
