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

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "50173b3c";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export async function getBio(): Promise<BioData> {
  try {
    const data = await client.fetch(
      `*[_type == "bio"][0] {
        name,
        tagline,
        "photoUrl": photo.asset->url,
        paragraphs
      }`,
      {},
      { next: { revalidate: 0 } }
    );
    if (!data || !data.name) return mockBio;
    return {
      name: data.name || mockBio.name,
      tagline: data.tagline || mockBio.tagline,
      photoUrl: data.photoUrl || mockBio.photoUrl,
      paragraphs: data.paragraphs && data.paragraphs.length > 0 ? data.paragraphs : mockBio.paragraphs,
    };
  } catch {
    return mockBio;
  }
}

export async function getBrands(): Promise<BrandData[]> {
  try {
    const data = await client.fetch(
      `*[_type == "brand"] | order(order asc) {
        _id,
        name,
        "logoUrl": logo.asset->url
      }`,
      {},
      { next: { revalidate: 0 } }
    );
    if (!data || data.length === 0) return mockBrands;
    return data.map((b: any, index: number) => ({
      id: b._id || `b-${index}`,
      name: b.name,
      logoUrl: b.logoUrl || mockBrands[index % mockBrands.length].logoUrl,
    }));
  } catch {
    return mockBrands;
  }
}

export async function getArtists(): Promise<ArtistData[]> {
  try {
    const data = await client.fetch(
      `*[_type == "artist"] | order(order asc) {
        _id,
        name,
        "photoUrl": photo.asset->url,
        bio
      }`,
      {},
      { next: { revalidate: 0 } }
    );
    if (!data || data.length === 0) return mockArtists;
    return data.map((a: any, index: number) => ({
      id: a._id || `art-${index}`,
      name: a.name,
      photoUrl: a.photoUrl || mockArtists[index % mockArtists.length].photoUrl,
      bio: a.bio,
    }));
  } catch {
    return mockArtists;
  }
}

export async function getSongs(): Promise<SongData[]> {
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
      }`,
      {},
      { next: { revalidate: 0 } }
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
  try {
    const data = await client.fetch(
      `*[_type == "screenProject"] | order(order asc) {
        _id,
        title,
        year,
        role,
        category,
        "posterUrl": poster.asset->url,
        videoUrl,
        description,
        scoreCues
      }`,
      {},
      { next: { revalidate: 0 } }
    );
    if (!data || data.length === 0) return mockScreenProjects;
    return data.map((sp: any, index: number) => ({
      id: sp._id || `scr-${index}`,
      title: sp.title,
      year: sp.year,
      role: sp.role,
      category: sp.category || "Cinema",
      posterUrl: sp.posterUrl || mockScreenProjects[index % mockScreenProjects.length].posterUrl,
      videoUrl: sp.videoUrl || mockScreenProjects[index % mockScreenProjects.length].videoUrl,
      description: sp.description,
      scoreCues: sp.scoreCues || mockScreenProjects[index % mockScreenProjects.length].scoreCues,
    }));
  } catch {
    return mockScreenProjects;
  }
}

export async function getAds(): Promise<AdCampaignData[]> {
  try {
    const data = await client.fetch(
      `*[_type == "adCampaign"] | order(order asc) {
        _id,
        brandName,
        "thumbnailUrl": thumbnail.asset->url,
        videoUrl,
        description
      }`,
      {},
      { next: { revalidate: 0 } }
    );
    if (!data || data.length === 0) return mockAds;
    return data.map((ad: any, index: number) => ({
      id: ad._id || `ad-${index}`,
      brandName: ad.brandName,
      thumbnailUrl: ad.thumbnailUrl || mockAds[index % mockAds.length].thumbnailUrl,
      videoUrl: ad.videoUrl || mockAds[index % mockAds.length].videoUrl,
      description: ad.description,
    }));
  } catch {
    return mockAds;
  }
}

export async function getFeaturedWork(): Promise<FeaturedWorkItem[]> {
  try {
    const data = await client.fetch(
      `*[_type == "featuredWork"] | order(order asc) {
        _id,
        title,
        category,
        role,
        "image": image.asset->url,
        link,
        description
      }`,
      {},
      { next: { revalidate: 0 } }
    );
    if (!data || data.length === 0) return mockFeaturedWork;
    return data.map((fw: any, index: number) => ({
      id: fw._id || `fw-${index}`,
      title: fw.title,
      category: fw.category,
      role: fw.role,
      image: fw.image || mockFeaturedWork[index % mockFeaturedWork.length].image,
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
  const songs = await getSongs();
  if (songs && songs.length >= 3) {
    return songs.slice(0, 3);
  }
  return mockHeroReels;
}
