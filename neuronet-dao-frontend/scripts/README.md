# Sample Data Population Script

This script populates the backend with sample data for all three types: prompts, datasets, and AI outputs. Each item gets random views and comments to create natural popularity distribution.

## What it creates:

### Items with Random Engagement
- **5 Prompts** - AI prompts with random views and comments
- **5 Datasets** - Datasets with random views and comments  
- **5 AI Outputs** - AI-generated content with random views and comments

### Natural Popularity Distribution
- **Random Views**: Each item gets 5-50 random views
- **Random Comments**: Each item gets 0-10 random comments with ratings
- **Different Owners**: Items are created by different principals
- **Unique Content**: Each item has completely unique title, description, and content
- **Varied Categories**: Categories are distributed across all available options

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

1. Creates 15 items total (5 prompts + 5 datasets + 5 AI outputs)
2. Generates completely unique content for each item (no duplicates)
3. Adds random views (5-50) to each item for natural popularity distribution
4. Adds random comments (0-10) with ratings (3-5 stars) to each item
5. Uses diverse categories distributed across all available options
6. Assigns different owners to create realistic marketplace data
7. Provides detailed console output showing progress

## Sample Data Features:

- **Completely unique titles and descriptions** for each item (no duplicates)
- **Varied pricing** based on item complexity and value
- **Diverse categories** distributed across all available options
- **Quality comments** with realistic ratings (3-5 stars)
- **Random view counts** to simulate natural popularity distribution
- **Unique content** tailored to each category and item type

## Notes:

- The script uses multiple principals to create items with different owners
- Items are randomly assigned to different principals for realistic data distribution
- All items are created with metadata tags for easy identification
- Each item gets random views (5-100) for natural popularity distribution
- Each item gets random comments (0-10) with realistic ratings (3-5 stars)
- Categories are distributed across all available options to ensure variety
- Each item has completely unique content - no duplicates whatsoever
- This creates a natural marketplace where some items are more popular than others

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
- Prompts: 20
- Datasets: 20
- AI Outputs: 20
- Total Items Created: 60
- All items have random views (5-100) and comments (0-10)
```
