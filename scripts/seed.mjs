import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "50173b3c",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN, // Optional token if dataset requires auth
});

const bioDoc = {
  _id: "bio-singleton",
  _type: "bio",
  name: "Julian Vance",
  tagline: "Composer & Music Producer for Film, TV, and Brands",
  paragraphs: [
    "Julian Vance is a Los Angeles and London-based composer and music producer crafting immersive sonic landscapes for film, narrative series, global commercial campaigns, and record releases.",
    "Trained in classical composition at the Royal Academy of Music and refined in electronic sound design, Vance bridges orchestral grandeur with raw analog synthesis. His signature aesthetic lives at the intersection of emotional intimacy and visceral weight.",
    "Over the past decade, Vance has scored feature films premiered at Sundance and Cannes, collaborated with chart-topping alternative recording artists, and forged distinctive sonic identities for international luxury brands."
  ]
};

const sampleProjects = [
  {
    _id: "screen-1",
    _type: "screenProject",
    title: "The Silent Canopy",
    year: "2024",
    role: "Original Motion Picture Score",
    category: "Cinema",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Award-winning psychological thriller exploring isolation in the Pacific Northwest wilderness. Official Selection Cannes 2024.",
    order: 1
  },
  {
    _id: "screen-2",
    _type: "screenProject",
    title: "Chronicles of Aethel",
    year: "2023",
    role: "Series Composer (Episodes 1-8)",
    category: "Cinema",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Epic historical drama miniseries featuring a 70-piece orchestral score recorded at Abbey Road Studios.",
    order: 2
  }
];

const sampleArtists = [
  {
    _id: "artist-1",
    _type: "artist",
    name: "Serafina",
    bio: "Dark pop & cinematic electronica vocalist",
    order: 1
  },
  {
    _id: "artist-2",
    _type: "artist",
    name: "Kaelen Voss",
    bio: "Neoclassical pianist and ambient producer",
    order: 2
  }
];

const sampleSongs = [
  {
    _id: "song-1",
    _type: "song",
    title: "Ghost in the Velvet",
    artist: { _type: "reference", _ref: "artist-1" },
    role: "Producer & Arranger",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112247.mp3",
    releaseYear: "2024",
    order: 1
  },
  {
    _id: "song-2",
    _type: "song",
    title: "Nocturne Noctis",
    artist: { _type: "reference", _ref: "artist-2" },
    role: "Producer & Mixing Engineer",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-score-18234.mp3",
    releaseYear: "2024",
    order: 2
  }
];

const sampleAds = [
  {
    _id: "ad-1",
    _type: "adCampaign",
    brandName: "Rolex — Perpetually Forward",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Original score + sound design for 60s international commercial spot.",
    order: 1
  },
  {
    _id: "ad-2",
    _type: "adCampaign",
    brandName: "Nike — Beyond Breath",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "High-octane hybrid orchestral-electronic score for global Olympics digital launch.",
    order: 2
  }
];

const sampleBrands = [
  { _id: "brand-1", _type: "brand", name: "A24", order: 1 },
  { _id: "brand-2", _type: "brand", name: "HBO", order: 2 },
  { _id: "brand-3", _type: "brand", name: "Nike", order: 3 },
  { _id: "brand-4", _type: "brand", name: "Apple", order: 4 },
  { _id: "brand-5", _type: "brand", name: "Rolex", order: 5 }
];

async function seed() {
  console.log("Seeding Sanity dataset 50173b3c...");
  try {
    await client.createOrReplace(bioDoc);
    for (const doc of [...sampleProjects, ...sampleArtists, ...sampleSongs, ...sampleAds, ...sampleBrands]) {
      await client.createOrReplace(doc);
    }
    console.log("Successfully seeded initial documents into Sanity!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seed();
