import { getActor } from "../src/ic/agent";
import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Sample data for different item types
const sampleData = {
  prompts: [
    {
      title: "Professional Portrait Photography Prompt",
      description: "Create stunning professional portraits with perfect lighting and composition",
      content: "Professional portrait photography, studio lighting, high resolution, detailed facial features, professional attire, clean background, 8K quality, photorealistic",
      price: 25,
      category: "Midjourney"
    },
    {
      title: "Sci-Fi Cityscape Generation",
      description: "Generate futuristic cityscapes with advanced technology and neon lights",
      content: "Futuristic cityscape, neon lights, flying cars, skyscrapers, cyberpunk aesthetic, advanced technology, night scene, detailed architecture",
      price: 30,
      category: "DALL-E"
    },
    {
      title: "Anime Character Design Prompt",
      description: "Create beautiful anime characters with unique personalities and styles",
      content: "Anime character, detailed face, colorful hair, expressive eyes, fantasy clothing, magical aura, high quality, vibrant colors",
      price: 20,
      category: "Stable Diffusion"
    },
    {
      title: "Nature Landscape Photography",
      description: "Capture breathtaking natural landscapes with perfect composition",
      content: "Natural landscape, mountains, forest, golden hour lighting, panoramic view, high resolution, realistic photography, peaceful atmosphere",
      price: 35,
      category: "Leonardo AI"
    },
    {
      title: "Abstract Art Generation",
      description: "Create unique abstract art pieces with vibrant colors and patterns",
      content: "Abstract art, vibrant colors, geometric patterns, modern style, artistic composition, creative design, high contrast",
      price: 28,
      category: "Midjourney"
    },
    {
      title: "Product Photography Setup",
      description: "Professional product photography with perfect lighting and staging",
      content: "Product photography, studio lighting, clean background, professional setup, high resolution, commercial quality, white background",
      price: 40,
      category: "DALL-E"
    },
    {
      title: "Fantasy Creature Design",
      description: "Design mythical creatures with detailed features and magical elements",
      content: "Fantasy creature, mythical beast, detailed scales, magical aura, fantasy setting, epic lighting, high detail, artistic style",
      price: 32,
      category: "Stable Diffusion"
    },
    {
      title: "Urban Street Photography",
      description: "Capture the essence of urban life with street photography",
      content: "Street photography, urban setting, candid moments, natural lighting, city life, documentary style, black and white option",
      price: 22,
      category: "Leonardo AI"
    },
    {
      title: "Minimalist Design Prompt",
      description: "Create clean, minimalist designs with simple yet effective composition",
      content: "Minimalist design, clean lines, simple composition, white space, modern aesthetic, geometric shapes, subtle colors",
      price: 18,
      category: "Midjourney"
    },
    {
      title: "Vintage Film Photography",
      description: "Recreate the nostalgic feel of vintage film photography",
      content: "Vintage film photography, grain texture, warm tones, retro aesthetic, film camera look, nostalgic atmosphere, classic style",
      price: 26,
      category: "DALL-E"
    }
  ],
  datasets: [
    {
      title: "Medical Imaging Dataset",
      description: "Comprehensive dataset of medical images for AI training",
      content: "X-ray images, MRI scans, CT scans, medical diagnosis, healthcare AI, annotated data, patient cases",
      price: 500,
      category: "Healthcare"
    },
    {
      title: "Financial Market Data",
      description: "Real-time financial market data for trading algorithms",
      content: "Stock prices, market indicators, trading data, financial analysis, time series data, market trends",
      price: 800,
      category: "Finance"
    },
    {
      title: "Natural Language Processing Corpus",
      description: "Large text corpus for NLP model training",
      content: "Text data, language processing, machine learning, annotated text, linguistic patterns, semantic analysis",
      price: 600,
      category: "NLP"
    },
    {
      title: "Computer Vision Dataset",
      description: "Image dataset for computer vision applications",
      content: "Object detection, image classification, computer vision, annotated images, training data, AI models",
      price: 450,
      category: "Vision"
    },
    {
      title: "IoT Sensor Data",
      description: "Internet of Things sensor data for smart city applications",
      content: "Sensor readings, IoT devices, smart city data, environmental monitoring, real-time data, analytics",
      price: 350,
      category: "IoT"
    },
    {
      title: "Climate Change Dataset",
      description: "Environmental data for climate research and analysis",
      content: "Temperature data, weather patterns, climate models, environmental science, research data, global warming",
      price: 400,
      category: "Climate"
    },
    {
      title: "Audio Processing Dataset",
      description: "Audio files for speech recognition and music analysis",
      content: "Speech audio, music files, audio processing, machine learning, sound analysis, voice recognition",
      price: 300,
      category: "Audio"
    },
    {
      title: "Cybersecurity Dataset",
      description: "Security logs and threat data for cybersecurity analysis",
      content: "Security logs, threat detection, cybersecurity, network data, attack patterns, intrusion detection",
      price: 700,
      category: "Security"
    },
    {
      title: "Legal Document Corpus",
      description: "Legal documents and contracts for legal AI applications",
      content: "Legal documents, contracts, case law, legal analysis, document processing, compliance data",
      price: 550,
      category: "Legal"
    },
    {
      title: "Gaming Analytics Dataset",
      description: "Player behavior and game performance data",
      content: "Player statistics, game metrics, user behavior, gaming analytics, performance data, engagement metrics",
      price: 250,
      category: "Gaming"
    }
  ],
  aiOutputs: [
    {
      title: "Brand Identity Design Package",
      description: "Complete brand identity including logo, colors, and guidelines",
      content: "Logo design, brand colors, typography, style guide, marketing materials, visual identity, brand guidelines",
      price: 1200,
      category: "Branding"
    },
    {
      title: "Website Copywriting Suite",
      description: "Professional website content for businesses and organizations",
      content: "Website copy, landing pages, about us, services, call-to-action, SEO optimized, conversion focused",
      price: 800,
      category: "Copywriting"
    },
    {
      title: "Product Photography Collection",
      description: "High-quality product images for e-commerce and marketing",
      content: "Product photos, lifestyle shots, detail images, marketing visuals, e-commerce ready, professional quality",
      price: 600,
      category: "Photography"
    },
    {
      title: "Social Media Content Calendar",
      description: "Monthly social media content strategy and posts",
      content: "Content calendar, social posts, hashtag strategy, engagement tactics, platform optimization, brand voice",
      price: 400,
      category: "Social Media"
    },
    {
      title: "UI/UX Design System",
      description: "Complete design system for web and mobile applications",
      content: "Design tokens, component library, style guide, interaction patterns, accessibility guidelines, responsive design",
      price: 1500,
      category: "UI/UX"
    },
    {
      title: "Video Marketing Package",
      description: "Professional video content for marketing campaigns",
      content: "Promotional videos, product demos, brand stories, video editing, motion graphics, marketing content",
      price: 900,
      category: "Video"
    },
    {
      title: "SEO Content Strategy",
      description: "Comprehensive SEO content plan and optimization",
      content: "Keyword research, content strategy, SEO optimization, backlink analysis, technical SEO, content calendar",
      price: 700,
      category: "SEO"
    },
    {
      title: "Business Plan Template",
      description: "Professional business plan template with financial projections",
      content: "Business model, market analysis, financial projections, executive summary, marketing strategy, operational plan",
      price: 500,
      category: "Business"
    },
    {
      title: "Educational Course Content",
      description: "Complete online course with materials and assessments",
      content: "Course curriculum, lesson plans, assessments, multimedia content, learning objectives, student resources",
      price: 1000,
      category: "Education"
    },
    {
      title: "Technical Documentation",
      description: "Comprehensive technical documentation for software products",
      content: "API documentation, user guides, technical specifications, troubleshooting guides, developer resources",
      price: 850,
      category: "Technical"
    }
  ]
};

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
    
    // Create items for each category
    const createdItems: { id: number; itemType: string; category: string }[] = [];
    
    // Create Featured Prompts (most viewed)
    console.log("Creating Featured Prompts...");
    for (let i = 0; i < 10; i++) {
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
        "featured_prompt"
      );
      createdItems.push({ id: Number(itemId), itemType: "prompt", category: prompt.category });
      console.log(`Created Featured Prompt ${i + 1}: ${prompt.title} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Create Featured Datasets (most viewed)
    console.log("Creating Featured Datasets...");
    for (let i = 0; i < 10; i++) {
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
        "featured_dataset"
      );
      createdItems.push({ id: Number(itemId), itemType: "dataset", category: dataset.category });
      console.log(`Created Featured Dataset ${i + 1}: ${dataset.title} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Create Featured AI Outputs (most viewed)
    console.log("Creating Featured AI Outputs...");
    for (let i = 0; i < 10; i++) {
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
        "featured_ai_output"
      );
      createdItems.push({ id: Number(itemId), itemType: "ai_output", category: aiOutput.category });
      console.log(`Created Featured AI Output ${i + 1}: ${aiOutput.title} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Create Trending Prompts (most viewed & commented)
    console.log("Creating Trending Prompts...");
    for (let i = 0; i < 10; i++) {
      const prompt = sampleData.prompts[(i + 5) % sampleData.prompts.length]; // Use different prompts
      const ownerPrincipal = getRandomPrincipal();
      const itemId = await actor.create_item_for_user(
        ownerPrincipal,
        `Trending: ${prompt.title}`,
        prompt.description,
        prompt.content,
        prompt.price,
        "prompt",
        prompt.category,
        "trending_prompt"
      );
      createdItems.push({ id: Number(itemId), itemType: "prompt", category: prompt.category });
      console.log(`Created Trending Prompt ${i + 1}: ${prompt.title} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Create Trending Datasets (most viewed & commented)
    console.log("Creating Trending Datasets...");
    for (let i = 0; i < 10; i++) {
      const dataset = sampleData.datasets[(i + 5) % sampleData.datasets.length]; // Use different datasets
      const ownerPrincipal = getRandomPrincipal();
      const itemId = await actor.create_item_for_user(
        ownerPrincipal,
        `Trending: ${dataset.title}`,
        dataset.description,
        dataset.content,
        dataset.price,
        "dataset",
        dataset.category,
        "trending_dataset"
      );
      createdItems.push({ id: Number(itemId), itemType: "dataset", category: dataset.category });
      console.log(`Created Trending Dataset ${i + 1}: ${dataset.title} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Create Trending AI Outputs (most viewed & commented)
    console.log("Creating Trending AI Outputs...");
    for (let i = 0; i < 10; i++) {
      const aiOutput = sampleData.aiOutputs[(i + 5) % sampleData.aiOutputs.length]; // Use different outputs
      const ownerPrincipal = getRandomPrincipal();
      const itemId = await actor.create_item_for_user(
        ownerPrincipal,
        `Trending: ${aiOutput.title}`,
        aiOutput.description,
        aiOutput.content,
        aiOutput.price,
        "ai_output",
        aiOutput.category,
        "trending_ai_output"
      );
      createdItems.push({ id: Number(itemId), itemType: "ai_output", category: aiOutput.category });
      console.log(`Created Trending AI Output ${i + 1}: ${aiOutput.title} (Owner: ${ownerPrincipal.toText().substring(0, 8)}...)`);
    }
    
    // Add views and comments to create trending items
    console.log("Adding views and comments to create trending items...");
    
    for (const item of createdItems) {
      // Add more views to featured items (most viewed)
      if (item.itemType === "prompt" && item.category.includes("featured")) {
        for (let i = 0; i < 50; i++) {
          await actor.add_view(item.id);
        }
      } else if (item.itemType === "dataset" && item.category.includes("featured")) {
        for (let i = 0; i < 40; i++) {
          await actor.add_view(item.id);
        }
      } else if (item.itemType === "ai_output" && item.category.includes("featured")) {
        for (let i = 0; i < 45; i++) {
          await actor.add_view(item.id);
        }
      }
      
      // Add views and comments to trending items (most viewed & commented)
      if (item.category.includes("trending")) {
        // Add many views
        for (let i = 0; i < 60; i++) {
          await actor.add_view(item.id);
        }
        
        // Add multiple comments
        for (let i = 0; i < 8; i++) {
          const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
          const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
          await actor.add_comment(item.id, comment, rating);
        }
      }
    }
    
    console.log("Sample data population completed successfully!");
    console.log(`Created ${createdItems.length} items total`);
    
    // Print summary
    const featuredCount = createdItems.filter(item => item.category.includes("featured")).length;
    const trendingCount = createdItems.filter(item => item.category.includes("trending")).length;
    
    console.log(`\nSummary:`);
    console.log(`- Featured Items: ${featuredCount} (most viewed)`);
    console.log(`- Trending Items: ${trendingCount} (most viewed & commented)`);
    console.log(`- Total Items Created: ${createdItems.length}`);
    
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
