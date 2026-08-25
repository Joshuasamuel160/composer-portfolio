import { createClient } from "next-sanity";
import {
  mockBio,
  mockBrands,
  mockArtists,
  mockSongs,
  mockScreenProjects,
  mockAds,
  mockFeaturedWork,
  mockHeroPiece,
  mockHeroReels,
  BrandData,
  ArtistData,
  SongData,
  ScreenProjectData,
  AdCampaignData,
  BioData,
  FeaturedWorkItem
} from "../mockData";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

export async function getBio(): Promise<BioData> {
  if (!client) return mockBio;
  try {
    const data = await client.fetch(`*[_type == "bio"][0]`);
    if (!data) return mockBio;
    return {
      name: data.name || mockBio.name,
      tagline: data.tagline || mockBio.tagline,
      photoUrl: data.photo?.asset?.url || mockBio.photoUrl,
      paragraphs: data.paragraphs || mockBio.paragraphs,
    };
  } catch {
    return mockBio;
  }
}

export async function getBrands(): Promise<BrandData[]> {
  if (!client) return mockBrands;
  try {
    const data = await client.fetch(`*[_type == "brand"] | order(order asc)`);
    if (!data || data.length === 0) return mockBrands;
    return data.map((b: any, index: number) => ({
      id: b._id || `b-${index}`,
      name: b.name,
      logoUrl: b.logo?.asset?.url || mockBrands[index % mockBrands.length].logoUrl,
    }));
  } catch {
    return mockBrands;
  }
}

export async function getArtists(): Promise<ArtistData[]> {
  if (!client) return mockArtists;
  try {
    const data = await client.fetch(`*[_type == "artist"] | order(order asc)`);
    if (!data || data.length === 0) return mockArtists;
    return data.map((a: any, index: number) => ({
      id: a._id || `art-${index}`,
      name: a.name,
      photoUrl: a.photo?.asset?.url || mockArtists[index % mockArtists.length].photoUrl,
      bio: a.bio,
    }));
  } catch {
    return mockArtists;
  }
}

export async function getSongs(): Promise<SongData[]> {
  if (!client) return mockSongs;
  try {
    const data = await client.fetch(
      `*[_type == "song"] | order(order asc) {
        _id,
        title,
        role,
        audioUrl,
        embedUrl,
        releaseYear,
        "artistId": artist._ref,
        "artistName": artist->name,
        "coverUrl": coverImage.asset->url
      }`
    );
    if (!data || data.length === 0) return mockSongs;
    return data.map((s: any, index: number) => ({
      id: s._id || `s-${index}`,
      title: s.title,
      artistId: s.artistId || `art-${index}`,
      artistName: s.artistName || "Artist",
      role: s.role,
      coverUrl: s.coverUrl || mockSongs[index % mockSongs.length].coverUrl,
      audioUrl: s.audioUrl || mockSongs[index % mockSongs.length].audioUrl,
      embedUrl: s.embedUrl,
      releaseYear: s.releaseYear || "2024",
    }));
  } catch {
    return mockSongs;
  }
}

export async function getScreenProjects(): Promise<ScreenProjectData[]> {
  if (!client) return mockScreenProjects;
  try {
    const data = await client.fetch(`*[_type == "screenProject"] | order(order asc)`);
    if (!data || data.length === 0) return mockScreenProjects;
    return data.map((sp: any, index: number) => ({
      id: sp._id || `scr-${index}`,
      title: sp.title,
      year: sp.year,
      role: sp.role,
      category: sp.category || "Cinema",
      posterUrl: sp.poster?.asset?.url || mockScreenProjects[index % mockScreenProjects.length].posterUrl,
      videoUrl: sp.videoUrl || mockScreenProjects[index % mockScreenProjects.length].videoUrl,
      description: sp.description,
    }));
  } catch {
    return mockScreenProjects;
  }
}

export async function getAds(): Promise<AdCampaignData[]> {
  if (!client) return mockAds;
  try {
    const data = await client.fetch(`*[_type == "adCampaign"] | order(order asc)`);
    if (!data || data.length === 0) return mockAds;
    return data.map((ad: any, index: number) => ({
      id: ad._id || `ad-${index}`,
      brandName: ad.brandName,
      thumbnailUrl: ad.thumbnail?.asset?.url || mockAds[index % mockAds.length].thumbnailUrl,
      videoUrl: ad.videoUrl || mockAds[index % mockAds.length].videoUrl,
      description: ad.description,
    }));
  } catch {
    return mockAds;
  }
}

export async function getFeaturedWork(): Promise<FeaturedWorkItem[]> {
  if (!client) return mockFeaturedWork;
  try {
    const data = await client.fetch(`*[_type == "featuredWork"] | order(order asc)`);
    if (!data || data.length === 0) return mockFeaturedWork;
    return data.map((fw: any, index: number) => ({
      id: fw._id || `fw-${index}`,
      title: fw.title,
      category: fw.category,
      role: fw.role,
      image: fw.image?.asset?.url || mockFeaturedWork[index % mockFeaturedWork.length].image,
      link: fw.link || "/screen",
      description: fw.description || "",
    }));
  } catch {
    return mockFeaturedWork;
  }
}

export async function getHeroPiece(): Promise<SongData> {
  return mockHeroPiece;
}

export async function getHeroReels(): Promise<SongData[]> {
  return mockHeroReels;
}
