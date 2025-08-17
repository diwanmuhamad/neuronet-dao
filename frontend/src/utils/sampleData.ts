export interface FeaturedItem {
  title: string;
  price: string;
  category: string;
  image: string;
  size?: string;
  type?: string;
  rating?: number;
}

export interface TrendingItem {
  rank: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  image?: string;
}

export interface ActionCard {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  onClick?: () => void;
}

// Sample data for Featured Prompts
export const samplePrompts: FeaturedItem[] = [
  {
    title: "Immersive Retro RPG Videos",
    price: "$4.99",
    category: "Midjourney Video",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
  },
  {
    title: "About Me Graphic Social Bio Visuals",
    price: "$4.99",
    category: "ChatGPT Image",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
  },
  {
    title: "Motion Blur Focal Product Videos",
    price: "$4.99",
    category: "Midjourney Video",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
  },
  {
    title: "Back To School Poster Elements",
    price: "$3.99",
    category: "Imagen",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop",
  },
  {
    title: "Turn Anything Into Surprise Creative",
    price: "$5.99",
    category: "Veo",
    image: "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=300&h=200&fit=crop",
  },
  {
    title: "Modern Minimalist Design Templates",
    price: "$6.99",
    category: "DALL-E",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
  },
];

// Sample data for Featured Datasets
export const sampleDatasets: FeaturedItem[] = [
  {
    title: "Medical Image Classification Dataset",
    price: "$29.99",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
    size: "50K images",
  },
  {
    title: "Financial Time Series Data",
    price: "$19.99",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
    size: "100K records",
  },
  {
    title: "Natural Language Processing Corpus",
    price: "$24.99",
    category: "NLP",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
    size: "1M sentences",
  },
  {
    title: "E-commerce Product Reviews",
    price: "$15.99",
    category: "Retail",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
    size: "250K reviews",
  },
  {
    title: "Autonomous Vehicle Training Data",
    price: "$49.99",
    category: "Automotive",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop",
    size: "75K frames",
  },
  {
    title: "Social Media Sentiment Dataset",
    price: "$12.99",
    category: "Social",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop",
    size: "500K posts",
  },
];

// Sample data for Featured AI Outputs
export const sampleAIOutputs: FeaturedItem[] = [
  {
    title: "Professional Headshot Collection",
    price: "$9.99",
    category: "Portrait",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    type: "Images",
  },
  {
    title: "Brand Identity Design Package",
    price: "$19.99",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
    type: "Design",
  },
  {
    title: "Animated Logo Sequences",
    price: "$24.99",
    category: "Animation",
    image: "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=300&h=200&fit=crop",
    type: "Video",
  },
  {
    title: "Product Photography Set",
    price: "$14.99",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
    type: "Photos",
  },
  {
    title: "Social Media Content Pack",
    price: "$12.99",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop",
    type: "Mixed",
  },
  {
    title: "Architectural Visualization",
    price: "$34.99",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop",
    type: "3D Render",
  },
];

// Sample trending data
export const trendingPromptsColumn1: TrendingItem[] = [
  {
    rank: 1,
    title: "Haunted Halloween Dolls Video",
    category: "Midjourney Video",
    price: "$5.99",
    rating: 5.0,
  },
  {
    rank: 2,
    title: "Gothic Halloween Junk Journal",
    category: "Midjourney",
    price: "$3.99",
    rating: 5.0,
  },
  {
    rank: 3,
    title: "Adorable 3D Characters In Costume",
    category: "ChatGPT Image",
    price: "Free",
    rating: 5.0,
  },
  {
    rank: 4,
    title: "Cactus Dreams Boho Junk Journal",
    category: "Midjourney",
    price: "$2.99",
    rating: 4.8,
  },
  {
    rank: 5,
    title: "ASMR Squeezing Out Jelly Animation",
    category: "Veo",
    price: "$6.99",
    rating: 4.9,
  },
];

export const trendingPromptsColumn2: TrendingItem[] = [
  {
    rank: 6,
    title: "Victorian Halloween Junk Journal",
    category: "Midjourney",
    price: "$4.99",
    rating: 5.0,
  },
  {
    rank: 7,
    title: "Haunted Harvest Halloween Journal",
    category: "Midjourney",
    price: "$4.99",
    rating: 5.0,
  },
  {
    rank: 8,
    title: "Farmhouse Halloween Junk Journal",
    category: "Midjourney",
    price: "$4.99",
    rating: 5.0,
  },
  {
    rank: 9,
    title: "Discount Flyer Poster Creator",
    category: "ChatGPT Image",
    price: "$3.99",
    rating: 4.7,
  },
  {
    rank: 10,
    title: "Illustrations Of Ancient Chinese",
    category: "Midjourney",
    price: "$4.99",
    rating: 4.8,
  },
];

export const trendingPromptsColumn3: TrendingItem[] = [
  {
    rank: 11,
    title: "Medieval Tapestry Art Style",
    category: "Midjourney",
    price: "$4.99",
    rating: 4.9,
  },
  {
    rank: 12,
    title: "Adorable Stuffed Toy Design",
    category: "Midjourney",
    price: "$3.99",
    rating: 5.0,
  },
  {
    rank: 13,
    title: "Modern Blue Gold Art Style",
    category: "Midjourney",
    price: "$4.99",
    rating: 4.8,
  },
  {
    rank: 14,
    title: "Vintage Travel Poster Generator",
    category: "DALL-E",
    price: "$5.99",
    rating: 4.7,
  },
  {
    rank: 15,
    title: "Cyberpunk Character Creator",
    category: "Stable Diffusion",
    price: "$7.99",
    rating: 4.9,
  },
];

export const trendingPromptsColumn4: TrendingItem[] = [
  {
    rank: 16,
    title: "Watercolor Landscape Generator",
    category: "Midjourney",
    price: "$4.99",
    rating: 4.8,
  },
  {
    rank: 17,
    title: "Corporate Logo Designer",
    category: "ChatGPT Image",
    price: "$6.99",
    rating: 4.6,
  },
  {
    rank: 18,
    title: "Fantasy Creature Generator",
    category: "Midjourney",
    price: "$5.99",
    rating: 4.9,
  },
  {
    rank: 19,
    title: "Product Photography Setup",
    category: "Stable Diffusion",
    price: "$8.99",
    rating: 4.7,
  },
  {
    rank: 20,
    title: "Abstract Art Generator",
    category: "DALL-E",
    price: "$4.99",
    rating: 4.8,
  },
];

// Trending datasets
export const trendingDatasets: TrendingItem[][] = [
  [
    {
      rank: 1,
      title: "Medical Imaging Dataset",
      category: "Healthcare",
      price: "$49.99",
      rating: 5.0,
    },
    {
      rank: 2,
      title: "Financial Market Data",
      category: "Finance",
      price: "$29.99",
      rating: 4.9,
    },
    {
      rank: 3,
      title: "Social Media Analytics",
      category: "Marketing",
      price: "$19.99",
      rating: 4.8,
    },
  ],
  [
    {
      rank: 4,
      title: "Climate Change Data",
      category: "Environment",
      price: "$24.99",
      rating: 4.9,
    },
    {
      rank: 5,
      title: "E-commerce Behavior",
      category: "Retail",
      price: "$34.99",
      rating: 4.7,
    },
    {
      rank: 6,
      title: "Natural Language Corpus",
      category: "NLP",
      price: "$39.99",
      rating: 5.0,
    },
  ],
];

// Trending AI outputs
export const trendingAIOutputs: TrendingItem[][] = [
  [
    {
      rank: 1,
      title: "Professional Headshots",
      category: "Photography",
      price: "$14.99",
      rating: 5.0,
    },
    {
      rank: 2,
      title: "Brand Identity Package",
      category: "Design",
      price: "$24.99",
      rating: 4.9,
    },
    {
      rank: 3,
      title: "Product Renders",
      category: "3D Art",
      price: "$19.99",
      rating: 4.8,
    },
  ],
  [
    {
      rank: 4,
      title: "Marketing Videos",
      category: "Video",
      price: "$34.99",
      rating: 4.9,
    },
    {
      rank: 5,
      title: "Website Mockups",
      category: "UI/UX",
      price: "$29.99",
      rating: 4.7,
    },
    {
      rank: 6,
      title: "Art Illustrations",
      category: "Digital Art",
      price: "$16.99",
      rating: 5.0,
    },
  ],
];

// Default action cards
export const defaultActionCards: ActionCard[] = [
  {
    icon: "🎨",
    title: "Hire an AI Creator",
    description: "Discover world class AI experts",
    gradient: "bg-gradient-to-br from-purple-600 to-blue-600",
  },
  {
    icon: "🚀",
    title: "Build an AI App",
    description: "Create AI apps using prompts",
    gradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
  },
  {
    icon: "👥",
    title: "Join a Community",
    description: "Chat with other AI creators",
    gradient: "bg-gradient-to-br from-pink-600 to-red-600",
  },
  {
    icon: "🔍",
    title: "Explore the Marketplace",
    description: "Browse quality prompts",
    gradient: "bg-gradient-to-br from-green-600 to-teal-600",
    onClick: () => window.location.href = "/marketplace/prompt",
  },
];
