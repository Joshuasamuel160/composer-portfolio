export interface BrandData {
  id: string;
  name: string;
  logoUrl: string;
}

export interface ArtistData {
  id: string;
  name: string;
  photoUrl: string;
  bio?: string;
}

export interface SongData {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  role: string;
  coverUrl: string;
  audioUrl: string;
  embedUrl?: string;
  releaseYear: string;
}

export interface ScoreCue {
  id: string;
  title: string;
  duration: string;
  audioUrl: string;
}

export interface ScreenProjectData {
  id: string;
  title: string;
  year: string;
  role: string;
  director?: string;
  executiveProducer?: string;
  productionCompany?: string;
  category: "Cinema" | "YouTube";
  posterUrl: string;
  videoUrl: string;
  description: string;
  scoreCues?: ScoreCue[];
}

export interface AdCampaignData {
  id: string;
  brandName: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
}

export interface BioData {
  name: string;
  tagline: string;
  photoUrl: string;
  paragraphs: string[];
}

export interface FeaturedWorkItem {
  id: string;
  title: string;
  category: "Screen" | "Song" | "Ad";
  role: string;
  image: string;
  link: string;
  description: string;
}

export const mockBio: BioData = {
  name: "Julian Vance",
  tagline: "Composer & Music Producer for Film, TV, and Brands",
  photoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
  paragraphs: [
    "Julian Vance is a Los Angeles and London-based composer and music producer crafting immersive sonic landscapes for film, narrative series, global commercial campaigns, and record releases.",
    "Trained in classical composition at the Royal Academy of Music and refined in electronic sound design, Vance bridges orchestral grandeur with raw analog synthesis. His signature aesthetic lives at the intersection of emotional intimacy and visceral weight.",
    "Over the past decade, Vance has scored feature films premiered at Sundance and Cannes, collaborated with chart-topping alternative recording artists, and forged distinctive sonic identities for international luxury brands."
  ]
};

export const mockBrands: BrandData[] = [
  { id: "b1", name: "A24", logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=80&q=80" },
  { id: "b2", name: "HBO", logoUrl: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=200&h=80&q=80" },
  { id: "b3", name: "Nike", logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&h=80&q=80" },
  { id: "b4", name: "Apple", logoUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&h=80&q=80" },
  { id: "b5", name: "Rolex", logoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&h=80&q=80" },
  { id: "b6", name: "Netflix", logoUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=200&h=80&q=80" }
];

export const mockArtists: ArtistData[] = [
  {
    id: "art-1",
    name: "Serafina",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Dark pop & cinematic electronica vocalist"
  },
  {
    id: "art-2",
    name: "Kaelen Voss",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Neoclassical pianist and ambient producer"
  },
  {
    id: "art-3",
    name: "Echo Horizon",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Indie synth-wave duo"
  },
  {
    id: "art-4",
    name: "Lydia Thorne",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Avant-garde cellist and composer"
  }
];

export const mockSongs: SongData[] = [
  {
    id: "s1",
    title: "Ghost in the Velvet",
    artistId: "art-1",
    artistName: "Serafina",
    role: "Producer & Arranger",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&h=400&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112247.mp3",
    releaseYear: "2024"
  },
  {
    id: "s2",
    title: "Nocturne Noctis",
    artistId: "art-2",
    artistName: "Kaelen Voss",
    role: "Producer & Mixing Engineer",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&h=400&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-score-18234.mp3",
    releaseYear: "2024"
  },
  {
    id: "s3",
    title: "Neon Static",
    artistId: "art-3",
    artistName: "Echo Horizon",
    role: "Co-Producer & Additional Synths",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&h=400&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a149b5.mp3?filename=synthwave-retro-drive-10459.mp3",
    releaseYear: "2023"
  },
  {
    id: "s4",
    title: "Resonance in Minor",
    artistId: "art-4",
    artistName: "Lydia Thorne",
    role: "String Arranger & Orchestrator",
    coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&h=400&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-score-18234.mp3",
    releaseYear: "2023"
  },
  {
    id: "s5",
    title: "Solaris Fade",
    artistId: "art-1",
    artistName: "Serafina",
    role: "Producer & Sound Design",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&h=400&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112247.mp3",
    releaseYear: "2023"
  }
];

export const mockScreenProjects: ScreenProjectData[] = [
  {
    id: "scr-1",
    title: "The Silent Canopy",
    year: "2024",
    role: "Original Motion Picture Score",
    category: "Cinema",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&h=900&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Award-winning psychological thriller exploring isolation in the Pacific Northwest wilderness. Official Selection Cannes 2024.",
    scoreCues: [
      {
        id: "cue-101",
        title: "Cue 01: Main Theme (Opening Sequence)",
        duration: "2:45",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112247.mp3"
      },
      {
        id: "cue-102",
        title: "Cue 02: Fog over the Ridge",
        duration: "1:50",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-score-18234.mp3"
      },
      {
        id: "cue-103",
        title: "Cue 03: Final Descent",
        duration: "3:10",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a149b5.mp3?filename=synthwave-retro-drive-10459.mp3"
      }
    ]
  },
  {
    id: "scr-2",
    title: "Chronicles of Aethel",
    year: "2023",
    role: "Series Composer (Episodes 1-8)",
    category: "Cinema",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&h=900&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Epic historical drama miniseries featuring a 70-piece orchestral score recorded at Abbey Road Studios.",
    scoreCues: [
      {
        id: "cue-201",
        title: "Cue 01: Kingdom of Ashes (Main Title)",
        duration: "3:20",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112247.mp3"
      },
      {
        id: "cue-202",
        title: "Cue 02: March to the Frontier",
        duration: "2:15",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-score-18234.mp3"
      }
    ]
  },
  {
    id: "scr-3",
    title: "Fragments of Light",
    year: "2024",
    role: "Original Score & Sound Design",
    category: "YouTube",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&h=900&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Independent short sci-fi narrative film accumulating over 4 million views online.",
    scoreCues: [
      {
        id: "cue-301",
        title: "Cue 01: Event Horizon Motif",
        duration: "2:05",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a149b5.mp3?filename=synthwave-retro-drive-10459.mp3"
      }
    ]
  },
  {
    id: "scr-4",
    title: "Substratum",
    year: "2023",
    role: "Documentary Score",
    category: "YouTube",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&h=900&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Deep sea environmental documentary featuring experimental modular synthesizer textures and bowed bass.",
    scoreCues: [
      {
        id: "cue-401",
        title: "Cue 01: Abyss Echoes",
        duration: "3:40",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-score-18234.mp3"
      }
    ]
  }
];

export const mockAds: AdCampaignData[] = [
  {
    id: "ad-1",
    brandName: "Rolex — Perpetually Forward",
    thumbnailUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&h=500&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Original score + sound design for 60s international commercial spot."
  },
  {
    id: "ad-2",
    brandName: "Nike — Beyond Breath",
    thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=500&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "High-octane hybrid orchestral-electronic score for global Olympics digital launch."
  },
  {
    id: "ad-3",
    brandName: "Apple Vision — Spatial Realities",
    thumbnailUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&h=500&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Ethereal synth composition & spatial audio soundscape for keynote launch trailer."
  }
];

export const mockFeaturedWork: FeaturedWorkItem[] = [
  {
    id: "fw-1",
    title: "The Silent Canopy",
    category: "Screen",
    role: "Original Motion Picture Score",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&h=500&q=80",
    link: "/screen",
    description: "Features a dark string quartet paired with sub-bass pulses."
  },
  {
    id: "fw-2",
    title: "Ghost in the Velvet",
    category: "Song",
    role: "Producer & Arranger (Serafina)",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&h=500&q=80",
    link: "/songs",
    description: "Cinematic dark pop release with multi-layered vocal production."
  },
  {
    id: "fw-3",
    title: "Rolex — Perpetually Forward",
    category: "Ad",
    role: "Original Score & Sound Design",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&h=500&q=80",
    link: "/ads",
    description: "Pulsing brass motif build for global television spot."
  }
];

export const mockHeroPiece: SongData = {
  id: "hero-track-1",
  title: "The Silent Canopy — Main Theme (Overture)",
  artistId: "julian-vance",
  artistName: "Julian Vance",
  role: "Composer & Producer",
  coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&h=600&q=80",
  audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112247.mp3",
  releaseYear: "2024"
};

export const mockHeroReels: SongData[] = [
  {
    id: "hero-reel-1",
    title: "The Silent Canopy (Main Theme)",
    artistId: "julian-vance",
    artistName: "Film & TV Score Reel",
    role: "Orchestral Score & Sub-Bass",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&h=600&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112247.mp3",
    releaseYear: "2024"
  },
  {
    id: "hero-reel-2",
    title: "Ghost in the Velvet (Acoustic Mix)",
    artistId: "serafina",
    artistName: "Artist Production Reel",
    role: "Producer & Vocal Arrangement",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&h=600&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-score-18234.mp3",
    releaseYear: "2024"
  },
  {
    id: "hero-reel-3",
    title: "Rolex — Perpetually Forward",
    artistId: "rolex",
    artistName: "Commercial Score Reel",
    role: "Original Composition & Sound Design",
    coverUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&h=600&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a149b5.mp3?filename=synthwave-retro-drive-10459.mp3",
    releaseYear: "2023"
  }
];
