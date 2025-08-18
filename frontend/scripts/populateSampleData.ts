import { getActor } from "../src/ic/agent";
import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Generate unique sample data for different item types
function generateUniqueData() {
  const promptCategories = ["Midjourney", "DALL-E", "Stable Diffusion", "Leonardo AI", "FLUX", "Sora", "Runway", "Pika Labs", "AnimateDiff", "ComfyUI", "Automatic1111", "ChatGPT Image", "Imagen", "Veo", "Midjourney Video"];
  const datasetCategories = ["Healthcare", "Finance", "NLP", "Retail", "Automotive", "Social", "Vision", "IoT", "Climate", "Audio", "Security", "Legal", "Gaming", "Property", "Logistics", "Geospatial", "Translation", "Biometrics", "Agriculture", "Network", "Education", "Research", "Government"];
  const aiOutputCategories = ["Photography", "Design", "Copywriting", "Product", "Development", "Content", "Branding", "Marketing", "E-commerce", "Social Media", "Video", "Business", "Career", "Presentation", "Newsletter", "Podcasting", "Education", "Web Design", "UI/UX", "SEO", "Animation", "Legal", "Technical", "Creative", "Professional"];

  const prompts = [];
  const datasets = [];
  const aiOutputs = [];

  // Generate 20 unique prompts
  for (let i = 1; i <= 20; i++) {
    const category = promptCategories[i % promptCategories.length];
    prompts.push({
      title: `AI Prompt ${i}: ${getPromptTitle(i)}`,
      description: `Professional AI prompt for ${getPromptDescription(i)}`,
      content: getPromptContent(i, category),
      price: Math.floor(Math.random() * 50) + 15, // 15-65
      category: category
    });
  }

  // Generate 20 unique datasets
  for (let i = 1; i <= 20; i++) {
    const category = datasetCategories[i % datasetCategories.length];
    datasets.push({
      title: `Dataset ${i}: ${getDatasetTitle(i)}`,
      description: `Comprehensive dataset for ${getDatasetDescription(i)}`,
      content: getDatasetContent(i, category),
      price: Math.floor(Math.random() * 800) + 200, // 200-1000
      category: category
    });
  }

  // Generate 20 unique AI outputs
  for (let i = 1; i <= 20; i++) {
    const category = aiOutputCategories[i % aiOutputCategories.length];
    aiOutputs.push({
      title: `AI Output ${i}: ${getAIOutputTitle(i)}`,
      description: `Professional AI-generated ${getAIOutputDescription(i)}`,
      content: getAIOutputContent(i, category),
      price: Math.floor(Math.random() * 1200) + 300, // 300-1500
      category: category
    });
  }

  return { prompts, datasets, aiOutputs };
}

// Helper functions to generate unique content
function getPromptTitle(index: number): string {
  const titles = [
    "Professional Portrait Photography", "Sci-Fi Cityscape Generation", "Anime Character Design", 
    "Nature Landscape Photography", "Abstract Art Creation", "Product Photography Setup",
    "Fantasy Creature Design", "Urban Street Photography", "Minimalist Design", "Vintage Film Style",
    "Cyberpunk Character", "Futuristic Architecture", "Magical Forest Scene", "Space Exploration",
    "Underwater Photography", "Steampunk Aesthetic", "Neon Light Photography", "Desert Landscape",
    "Mountain Adventure", "Ocean Wave Photography"
  ];
  return titles[index - 1];
}

function getPromptDescription(index: number): string {
  const descriptions = [
    "creating stunning professional portraits", "generating futuristic cityscapes", "designing anime characters",
    "capturing natural landscapes", "creating abstract art pieces", "setting up product photography",
    "designing fantasy creatures", "capturing urban street life", "creating minimalist designs",
    "recreating vintage film aesthetics", "designing cyberpunk characters", "creating futuristic architecture",
    "generating magical forest scenes", "exploring space themes", "capturing underwater scenes",
    "creating steampunk aesthetics", "photographing neon lights", "capturing desert landscapes",
    "documenting mountain adventures", "photographing ocean waves"
  ];
  return descriptions[index - 1];
}

function getPromptContent(index: number, category: string): string {
  const baseContent = [
    "Professional portrait photography, studio lighting, high resolution, detailed facial features, professional attire, clean background, 8K quality, photorealistic",
    "Futuristic cityscape, neon lights, flying cars, skyscrapers, cyberpunk aesthetic, advanced technology, night scene, detailed architecture",
    "Anime character, detailed face, colorful hair, expressive eyes, fantasy clothing, magical aura, high quality, vibrant colors",
    "Natural landscape, mountains, forest, golden hour lighting, panoramic view, high resolution, realistic photography, peaceful atmosphere",
    "Abstract art, vibrant colors, geometric patterns, modern style, artistic composition, creative design, high contrast",
    "Product photography, studio lighting, clean background, professional setup, high resolution, commercial quality, white background",
    "Fantasy creature, mythical beast, detailed scales, magical aura, fantasy setting, epic lighting, high detail, artistic style",
    "Street photography, urban setting, candid moments, natural lighting, city life, documentary style, black and white option",
    "Minimalist design, clean lines, simple composition, white space, modern aesthetic, geometric shapes, subtle colors",
    "Vintage film photography, grain texture, warm tones, retro aesthetic, film camera look, nostalgic atmosphere, classic style",
    "Cyberpunk character, neon lighting, futuristic clothing, digital effects, high contrast, urban setting, detailed features",
    "Futuristic architecture, glass buildings, flying structures, advanced materials, sustainable design, innovative concepts",
    "Magical forest, glowing mushrooms, fairy lights, mystical creatures, enchanted atmosphere, fantasy elements",
    "Space exploration, stars, planets, galaxies, cosmic phenomena, astronomical objects, deep space",
    "Underwater photography, marine life, coral reefs, ocean depths, aquatic environment, marine biology",
    "Steampunk aesthetic, brass gears, steam power, Victorian era, mechanical elements, industrial design",
    "Neon light photography, urban nightlife, colorful lighting, city streets, vibrant atmosphere",
    "Desert landscape, sand dunes, arid environment, desert wildlife, harsh lighting, vast horizons",
    "Mountain adventure, alpine scenery, hiking trails, mountain peaks, outdoor exploration, natural beauty",
    "Ocean wave photography, coastal scenes, wave patterns, beach environment, marine photography"
  ];
  return `${baseContent[index - 1]}, ${category} style, high quality, professional grade`;
}

function getDatasetTitle(index: number): string {
  const titles = [
    "Medical Imaging Collection", "Financial Market Analytics", "Natural Language Corpus", 
    "Computer Vision Dataset", "IoT Sensor Readings", "Climate Research Data",
    "Audio Processing Files", "Cybersecurity Logs", "Legal Document Archive", "Gaming Analytics",
    "Retail Transaction Data", "Automotive Sensor Data", "Social Media Analytics", "Biometric Database",
    "Agricultural Monitoring", "Network Traffic Analysis", "Educational Content", "Government Records",
    "Translation Database", "Geospatial Information"
  ];
  return titles[index - 1];
}

function getDatasetDescription(index: number): string {
  const descriptions = [
    "medical imaging and diagnosis", "financial market analysis", "natural language processing",
    "computer vision applications", "IoT sensor monitoring", "climate change research",
    "audio processing and analysis", "cybersecurity threat detection", "legal document processing",
    "gaming behavior analytics", "retail transaction analysis", "automotive sensor monitoring",
    "social media trend analysis", "biometric identification", "agricultural monitoring systems",
    "network traffic analysis", "educational content delivery", "government record management",
    "translation services", "geospatial data analysis"
  ];
  return descriptions[index - 1];
}

function getDatasetContent(index: number, category: string): string {
  const baseContent = [
    "X-ray images, MRI scans, CT scans, medical diagnosis, healthcare AI, annotated data, patient cases",
    "Stock prices, market indicators, trading data, financial analysis, time series data, market trends",
    "Text data, language processing, machine learning, annotated text, linguistic patterns, semantic analysis",
    "Object detection, image classification, computer vision, annotated images, training data, AI models",
    "Sensor readings, IoT devices, smart city data, environmental monitoring, real-time data, analytics",
    "Temperature data, weather patterns, climate models, environmental science, research data, global warming",
    "Speech audio, music files, audio processing, machine learning, sound analysis, voice recognition",
    "Security logs, threat detection, cybersecurity, network data, attack patterns, intrusion detection",
    "Legal documents, contracts, case law, legal analysis, document processing, compliance data",
    "Player statistics, game metrics, user behavior, gaming analytics, performance data, engagement metrics",
    "Transaction records, customer behavior, sales data, inventory management, retail analytics",
    "Vehicle sensors, driving patterns, automotive data, safety monitoring, performance metrics",
    "Social interactions, user engagement, content analysis, trend detection, social analytics",
    "Fingerprint data, facial recognition, biometric identification, security systems, identity verification",
    "Crop monitoring, soil analysis, weather data, agricultural technology, farming optimization",
    "Network packets, traffic patterns, bandwidth usage, security monitoring, performance analysis",
    "Learning materials, student progress, assessment data, educational technology, curriculum development",
    "Public records, administrative data, government services, policy analysis, civic engagement",
    "Multilingual text, translation pairs, language models, cultural context, linguistic diversity",
    "Satellite imagery, GPS coordinates, mapping data, geographic information, spatial analysis"
  ];
  return `${baseContent[index - 1]}, ${category} domain, comprehensive coverage, high quality data`;
}

function getAIOutputTitle(index: number): string {
  const titles = [
    "Brand Identity Package", "Website Copywriting Suite", "Product Photography Collection",
    "Social Media Strategy", "UI/UX Design System", "Video Marketing Package",
    "SEO Content Strategy", "Business Plan Template", "Educational Course", "Technical Documentation",
    "Logo Design Collection", "Marketing Campaign", "E-commerce Content", "Presentation Materials",
    "Newsletter Template", "Podcast Production", "Web Design Package", "Animation Collection",
    "Legal Document Set", "Creative Portfolio"
  ];
  return titles[index - 1];
}

function getAIOutputDescription(index: number): string {
  const descriptions = [
    "complete brand identity including logo, colors, and guidelines",
    "professional website content for businesses and organizations",
    "high-quality product images for e-commerce and marketing",
    "monthly social media content strategy and posts",
    "complete design system for web and mobile applications",
    "professional video content for marketing campaigns",
    "comprehensive SEO content plan and optimization",
    "professional business plan template with financial projections",
    "complete online course with materials and assessments",
    "comprehensive technical documentation for software products",
    "professional logo designs for various industries",
    "complete marketing campaign materials and strategy",
    "e-commerce product descriptions and marketing content",
    "professional presentation materials and templates",
    "newsletter templates and content strategy",
    "podcast production materials and episode planning",
    "complete web design package with responsive layouts",
    "animation collection for various use cases",
    "legal document templates and compliance materials",
    "creative portfolio showcasing various design styles"
  ];
  return descriptions[index - 1];
}

function getAIOutputContent(index: number, category: string): string {
  const baseContent = [
    "Logo design, brand colors, typography, style guide, marketing materials, visual identity, brand guidelines",
    "Website copy, landing pages, about us, services, call-to-action, SEO optimized, conversion focused",
    "Product photos, lifestyle shots, detail images, marketing visuals, e-commerce ready, professional quality",
    "Content calendar, social posts, hashtag strategy, engagement tactics, platform optimization, brand voice",
    "Design tokens, component library, style guide, interaction patterns, accessibility guidelines, responsive design",
    "Promotional videos, product demos, brand stories, video editing, motion graphics, marketing content",
    "Keyword research, content strategy, SEO optimization, backlink analysis, technical SEO, content calendar",
    "Business model, market analysis, financial projections, executive summary, marketing strategy, operational plan",
    "Course curriculum, lesson plans, assessments, multimedia content, learning objectives, student resources",
    "API documentation, user guides, technical specifications, troubleshooting guides, developer resources",
    "Logo variations, brand identity elements, design concepts, color palettes, typography choices",
    "Campaign materials, advertising copy, visual assets, marketing strategy, audience targeting",
    "Product descriptions, category pages, shopping cart optimization, conversion copy, e-commerce strategy",
    "Slide templates, presentation content, visual aids, speaker notes, audience engagement materials",
    "Newsletter layouts, content templates, email marketing strategy, subscriber engagement, analytics",
    "Episode planning, show notes, promotional materials, guest coordination, audience building",
    "Website layouts, responsive design, user experience, visual design, development specifications",
    "Animation sequences, motion graphics, visual effects, storytelling, brand animation",
    "Legal templates, compliance documents, contract forms, regulatory guidance, legal frameworks",
    "Portfolio pieces, case studies, design process, creative concepts, professional presentation"
  ];
  return `${baseContent[index - 1]}, ${category} focus, professional quality, ready for implementation`;
}

// Sample comments for trending items
const sampleComments = [
  "Excellent quality! Exactly what I was looking for.",
  "Great prompt, very detailed and easy to follow.",
  "This dataset is comprehensive and well-organized.",
  "High-quality output, worth every penny.",
  "Perfect for my project needs, highly recommended!",
  "Very creative and unique approach.",
  "Professional grade content, exceeded expectations.",
  "Fast delivery and excellent communication.",
  "This saved me hours of work, thank you!",
  "Outstanding results, will definitely use again.",
  "Well-structured and easy to implement.",
  "Great value for the price, highly satisfied.",
  "Creative and innovative solution.",
  "Professional quality, meets all requirements.",
  "Excellent customer service and support."
];

// Sample principals for creating items with different owners
const samplePrincipals = [
  "pubpm-wpthe-cmn2p-awz2m-zwvek-rxqt5-kh3kt-jxvjh-ycppn-g5vov-mqe",
  "wcfk5-w4fiu-tab33-6pqei-sxuzh-irlwu-t4uam-a7yoj-zvwxv-5cb5y-mqe"
];

// Helper function to get a random principal
function getRandomPrincipal(): Principal {
  const principalString = samplePrincipals[Math.floor(Math.random() * samplePrincipals.length)];
  return Principal.fromText(principalString);
}

async function populateSampleData() {
  try {
    console.log("Starting to populate sample data...");
    
    const actor = await getActor();
    
    // Generate unique data
    const sampleData = generateUniqueData();
    
    // Create items for each category
    const createdItems: { id: number; itemType: string; category: string }[] = [];
    
    // Create Prompts
    console.log("Creating Prompts...");
    for (let i = 0; i < 5; i++) {
      const prompt = sampleData.prompts[i];
      const ownerPrincipal = getRandomPrincipal();
      const itemId = await actor.create_item_for_user(
        ownerPrincipal,
        prompt.title,
        prompt.description,
        prompt.content,
        prompt.price,
        "prompt",
        prompt.category,
        "sample_prompt",
        "Non-commercial use only",
        BigInt(0)
      );
      createdItems.push({ id: Number(itemId), itemType: "prompt", category: prompt.category });
      console.log(`Created Prompt ${i + 1}: ${prompt.title} ${itemId} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Create Datasets
    console.log("Creating Datasets...");
    for (let i = 0; i < 5; i++) {
      const dataset = sampleData.datasets[i];
      const ownerPrincipal = getRandomPrincipal();
      const itemId = await actor.create_item_for_user(
        ownerPrincipal,
        dataset.title,
        dataset.description,
        dataset.content,
        dataset.price,
        "dataset",
        dataset.category,
        "sample_dataset",
        "Non-commercial use only",
        BigInt(0)
      );
      createdItems.push({ id: Number(itemId), itemType: "dataset", category: dataset.category });
      console.log(`Created Dataset ${i + 1}: ${dataset.title} ${itemId} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Create AI Outputs
    console.log("Creating AI Outputs...");
    for (let i = 0; i < 5; i++) {
      const aiOutput = sampleData.aiOutputs[i];
      const ownerPrincipal = getRandomPrincipal();
      const itemId = await actor.create_item_for_user(
        ownerPrincipal,
        aiOutput.title,
        aiOutput.description,
        aiOutput.content,
        aiOutput.price,
        "ai_output",
        aiOutput.category,
        "sample_ai_output",
        "Non-commercial use only",
        BigInt(0)
      );
      createdItems.push({ id: Number(itemId), itemType: "ai_output", category: aiOutput.category });
      console.log(`Created AI Output ${i + 1}: ${aiOutput.title} ${itemId} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Add random views and comments to all items
    console.log("Adding random views and comments to all items...");
    
    for (const item of createdItems) {
      // Add random number of views (5-50)
      const viewCount = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
      for (let i = 0; i < viewCount; i++) {
        await actor.add_view(item.id);
      }
      
      // Add random number of comments (0-10)
      const commentCount = Math.floor(Math.random() * 11);
      for (let i = 0; i < commentCount; i++) {
        const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
        await actor.add_comment(item.id, comment, rating);
      }
      
      console.log(`Added ${viewCount} views and ${commentCount} comments to item ${item.id}`);
    }
    
    console.log("Sample data population completed successfully!");
    console.log(`Created ${createdItems.length} items total`);
    
    // Print summary
    const promptCount = createdItems.filter(item => item.itemType === "prompt").length;
    const datasetCount = createdItems.filter(item => item.itemType === "dataset").length;
    const aiOutputCount = createdItems.filter(item => item.itemType === "ai_output").length;
    
    console.log(`\nSummary:`);
    console.log(`- Prompts: ${promptCount}`);
    console.log(`- Datasets: ${datasetCount}`);
    console.log(`- AI Outputs: ${aiOutputCount}`);
    console.log(`- Total Items Created: ${createdItems.length}`);
    console.log(`- All items have random views (5-50) and comments (0-10)`);
    
  } catch (error) {
    console.error("Error populating sample data:", error);
  }
}

// Export the function
export { populateSampleData };

// If running directly
if (typeof window === 'undefined') {
  populateSampleData();
}
