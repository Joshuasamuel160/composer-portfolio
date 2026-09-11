import { createClient } from "next-sanity";
import {
  ScreenProjectData,
  SongData,
  AlbumData,
  AdCampaignData,
  BrandData,
  ArtistData,
  BioData,
  mockScreenProjects,
  mockSongs,
  mockAds,
  mockBrands,
  mockArtists,
  mockBio,
} from "../mockData";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "50173b3c";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    enabled: true,
    studioUrl: "/studio",
  },
});

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
      id: b._id || `brand-${index}`,
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

export async function getScreenProjects(): Promise<ScreenProjectData[]> {
  try {
    const data = await client.fetch(
      `*[_type == "screenProject"] | order(order asc) {
        _id,
        title,
        year,
        role,
        director,
        executiveProducer,
        productionCompany,
        category,
        customCategory,
        "posterUrl": poster.asset->url,
        "videoFileUrl": videoFile.asset->url,
        videoUrl,
        description,
        scoreCues[] {
          _key,
          title,
          duration,
          audioUrl,
          "audioFileUrl": audioFile.asset->url
        }
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
      director: sp.director,
      executiveProducer: sp.executiveProducer,
      productionCompany: sp.productionCompany,
      category: (sp.customCategory && sp.customCategory.trim() !== "" ? sp.customCategory : sp.category) || "Cinema",
      posterUrl: sp.posterUrl || mockScreenProjects[index % mockScreenProjects.length].posterUrl,
      videoUrl: sp.videoFileUrl || sp.videoUrl || "",
      description: sp.description,
      scoreCues: sp.scoreCues
        ? sp.scoreCues.map((cue: any, cIdx: number) => ({
            id: cue._key || `cue-${cIdx}`,
            title: cue.title,
            duration: cue.duration || "2:30",
            audioUrl: cue.audioFileUrl || cue.audioUrl || "",
          }))
        : [],
    }));
  } catch {
    return mockScreenProjects;
  }
}

export async function getAlbums(): Promise<AlbumData[]> {
  try {
    // 1. Fetch Sanity standalone Album documents
    const sanityAlbumsData = await client.fetch(
      `*[_type == "album"] | order(order asc) {
        _id,
        title,
        "artistId": artist._ref,
        "artistNameRef": artist->name,
        artistName,
        "coverUrl": coverImage.asset->url,
        releaseYear,
        category,
        tracks[] {
          _key,
          title,
          role,
          audioUrl,
          "audioFileUrl": audioFile.asset->url
        }
      }`,
      {},
      { next: { revalidate: 0 } }
    );

    const sanityAlbums: AlbumData[] = (sanityAlbumsData || []).map((alb: any, idx: number) => ({
      id: alb._id || `alb-san-${idx}`,
      title: alb.title,
      artistId: alb.artistId || `art-alb-${idx}`,
      artistName: alb.artistNameRef || alb.artistName || "Julian Vance",
      coverUrl: alb.coverUrl || "",
      releaseYear: alb.releaseYear || "2024",
      category: alb.category || "Album",
      tracks: (alb.tracks || []).map((t: any, tIdx: number) => ({
        id: t._key || `t-${idx}-${tIdx}`,
        title: t.title,
        role: t.role || "Composer / Producer",
        audioUrl: t.audioFileUrl || t.audioUrl || "",
      })),
    }));

    // 2. Fetch Screen Projects and turn each into an Album (Soundtrack) under its Film Company/Studio
    const screenProjects = await getScreenProjects();
    const movieSoundtracks: AlbumData[] = [];

    screenProjects.forEach((sp) => {
      if (sp.scoreCues && sp.scoreCues.length > 0) {
        movieSoundtracks.push({
          id: `alb-sp-${sp.id}`,
          title: `${sp.title} (Original Motion Picture Soundtrack)`,
          artistId: `studio-${sp.id}`,
          artistName: sp.productionCompany || sp.director || "Film Production Co.",
          coverUrl: sp.posterUrl,
          releaseYear: sp.year,
          category: "Film Soundtrack",
          tracks: sp.scoreCues.map((cue) => ({
            id: `${sp.id}-${cue.id}`,
            title: cue.title,
            role: `${sp.role} (${sp.year})`,
            audioUrl: cue.audioUrl,
            duration: cue.duration,
          })),
        });
      }
    });

    const combined = [...movieSoundtracks, ...sanityAlbums];
    return combined;
  } catch (err) {
    console.error("Error fetching albums:", err);
    return [];
  }
}

export async function getSongs(): Promise<SongData[]> {
  try {
    const songData = await client.fetch(
      `*[_type == "song"] | order(order asc) {
        _id,
        title,
        role,
        audioUrl,
        "audioFileUrl": audioFile.asset->url,
        embedUrl,
        releaseYear,
        "artistId": artist._ref,
        "artistName": artist->name,
        "coverUrl": coverImage.asset->url
      }`,
      {},
      { next: { revalidate: 0 } }
    );

    let standaloneSongs: SongData[] = [];
    if (songData && songData.length > 0) {
      standaloneSongs = songData.map((s: any, index: number) => ({
        id: s._id || `s-${index}`,
        title: s.title,
        artistId: s.artistId || `art-${index}`,
        artistName: s.artistName || "Julian Vance",
        role: s.role || "Producer",
        coverUrl: s.coverUrl || mockSongs[index % mockSongs.length].coverUrl,
        audioUrl: s.audioFileUrl || s.audioUrl || "",
        embedUrl: s.embedUrl,
        releaseYear: s.releaseYear || "2024",
      }));
    }

    const screenProjects = await getScreenProjects();
    const movieCueSongs: SongData[] = [];

    screenProjects.forEach((proj) => {
      if (proj.scoreCues && proj.scoreCues.length > 0) {
        proj.scoreCues.forEach((cue) => {
          if (cue.audioUrl) {
            movieCueSongs.push({
              id: `cue-${proj.id}-${cue.id}`,
              title: cue.title,
              artistId: proj.id,
              artistName: proj.productionCompany || proj.title,
              role: `${proj.role} (${proj.year})`,
              coverUrl: proj.posterUrl,
              audioUrl: cue.audioUrl,
              releaseYear: proj.year,
            });
          }
        });
      }
    });

    const combined = [...standaloneSongs, ...movieCueSongs];
    if (combined.length === 0) return mockSongs;
    return combined;
  } catch {
    return mockSongs;
  }
}

export async function getHeroReels(): Promise<SongData[]> {
  try {
    const songs = await getSongs();
    if (songs && songs.length > 0) {
      return songs.slice(0, 4);
    }
    return mockSongs.slice(0, 4);
  } catch {
    return mockSongs.slice(0, 4);
  }
}

export async function getAds(): Promise<AdCampaignData[]> {
  try {
    const data = await client.fetch(
      `*[_type == "adCampaign"] | order(order asc) {
        _id,
        brandName,
        "thumbnailUrl": thumbnail.asset->url,
        "videoFileUrl": videoFile.asset->url,
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
      videoUrl: ad.videoFileUrl || ad.videoUrl || mockAds[index % mockAds.length].videoUrl,
      description: ad.description,
    }));
  } catch {
    return mockAds;
  }
}

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
    if (!data) return mockBio;
    return {
      name: data.name || mockBio.name,
      tagline: data.tagline || mockBio.tagline,
      photoUrl: data.photoUrl || mockBio.photoUrl,
      paragraphs: data.paragraphs || mockBio.paragraphs,
    };
  } catch {
    return mockBio;
  }
}
