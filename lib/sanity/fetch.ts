import { createClient } from "next-sanity";
import {
  ScreenProjectData,
  SongData,
  AlbumData,
  AdCampaignData,
  BrandData,
  ArtistData,
  BioData,
  ContactInfoData,
  mockScreenProjects,
  mockSongs,
  mockAds,
  mockBrands,
  mockArtists,
  mockBio,
  mockContactInfo,
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
        spotifyUrl,
        appleMusicUrl,
        tracks[] {
          _key,
          title,
          role,
          audioUrl,
          "audioFileUrl": audioFile.asset->url,
          externalUrl
        }
      }`,
      {},
      { next: { revalidate: 0 } }
    );

    const sanityAlbums: AlbumData[] = (sanityAlbumsData || []).map((alb: any, idx: number) => ({
      id: alb._id || `alb-san-${idx}`,
      title: alb.title,
      artistId: alb.artistId || `art-alb-${idx}`,
      artistName: alb.artistNameRef || alb.artistName || "Joshua Samuel",
      coverUrl: alb.coverUrl || "",
      releaseYear: alb.releaseYear || "2024",
      category: alb.category || "Album",
      spotifyUrl: alb.spotifyUrl,
      appleMusicUrl: alb.appleMusicUrl,
      tracks: (alb.tracks || []).map((t: any, tIdx: number) => ({
        id: t._key || `t-${idx}-${tIdx}`,
        title: t.title,
        role: t.role || "Composer / Producer",
        audioUrl: t.audioFileUrl || t.audioUrl || "",
        externalUrl: t.externalUrl,
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

    // 3. Fetch standalone Song documents and convert into Single Album cards
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

    const standaloneSongAlbums: AlbumData[] = (songData || []).map((s: any, idx: number) => ({
      id: `alb-song-${s._id || idx}`,
      title: s.title,
      artistId: s.artistId || `art-s-${idx}`,
      artistName: s.artistName || "Joshua Samuel",
      coverUrl: s.coverUrl || "",
      releaseYear: s.releaseYear || "2024",
      category: "Single",
      tracks: [
        {
          id: s._id || `track-s-${idx}`,
          title: s.title,
          role: s.role || "Producer",
          audioUrl: s.audioFileUrl || s.audioUrl || "",
          externalUrl: s.embedUrl,
        },
      ],
    }));

    const combined = [...movieSoundtracks, ...sanityAlbums, ...standaloneSongAlbums];
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

    const VERIFIED_AUDIO_SAMPLES = [
      "https://raw.githubusercontent.com/goldfire/howler.js/master/examples/player/audio/rave_digger.mp3",
      "https://raw.githubusercontent.com/goldfire/howler.js/master/examples/player/audio/80s_vibe.mp3",
      "https://raw.githubusercontent.com/mdn/webaudio-examples/main/audio-analyser/vite.mp3",
      "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3",
    ];

    let standaloneSongs: SongData[] = [];
    if (songData && songData.length > 0) {
      standaloneSongs = songData.map((s: any, index: number) => {
        let audioSrc = s.audioFileUrl || s.audioUrl || s.embedUrl || "";
        if (!audioSrc || audioSrc.includes("soundhelix.com")) {
          console.warn(
            `[AudioFetchDiagnostic] Track "${s.title}" (ID: ${s._id || index}) is missing a direct resolved audio URL. Checked fields: audioFile.asset->url, audioUrl, embedUrl. Applying emergency sample fallback.`
          );
          audioSrc = VERIFIED_AUDIO_SAMPLES[index % VERIFIED_AUDIO_SAMPLES.length];
        } else {
          console.info(`[AudioFetchSuccess] Track "${s.title}" resolved playable URL:`, audioSrc);
        }
        return {
          id: s._id || `s-${index}`,
          title: s.title,
          artistId: s.artistId || `art-${index}`,
          artistName: s.artistName || "Joshua Samuel",
          role: s.role || "Producer",
          coverUrl: s.coverUrl || mockSongs[index % mockSongs.length].coverUrl,
          audioUrl: audioSrc,
          embedUrl: s.embedUrl,
          releaseYear: s.releaseYear || "2024",
        };
      });
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
    // 1. Check if specific featured songs/albums were selected in Sanity Studio
    const contactDoc = await client.fetch(
      `*[_type == "contactInfo"][0] {
        featuredSongs[]-> {
          _id,
          _type,
          title,
          year,
          role,
          director,
          productionCompany,
          audioUrl,
          "audioFileUrl": audioFile.asset->url,
          embedUrl,
          releaseYear,
          "artistNameRef": artist->name,
          artistName,
          "coverUrl": coverImage.asset->url,
          "posterUrl": poster.asset->url,
          scoreCues[] {
            _key,
            title,
            duration,
            audioUrl,
            "audioFileUrl": audioFile.asset->url
          },
          tracks[] {
            _key,
            title,
            role,
            audioUrl,
            "audioFileUrl": audioFile.asset->url
          }
        }
      }`,
      {},
      { next: { revalidate: 0 } }
    );

    if (contactDoc?.featuredSongs && contactDoc.featuredSongs.length > 0) {
      const selectedSongs: SongData[] = [];
      contactDoc.featuredSongs.forEach((item: any, idx: number) => {
        if (item._type === "song") {
          selectedSongs.push({
            id: item._id || `feat-song-${idx}`,
            title: item.title,
            artistId: item.artistId || `art-${idx}`,
            artistName: item.artistNameRef || "Joshua Samuel",
            role: item.role || "Composer / Producer",
            coverUrl: item.coverUrl || "",
            audioUrl: item.audioFileUrl || item.audioUrl || "",
            embedUrl: item.embedUrl,
            releaseYear: item.releaseYear || "2024",
          });
        } else if (item._type === "album" && item.tracks && item.tracks.length > 0) {
          const firstTrack = item.tracks[0];
          selectedSongs.push({
            id: `feat-alb-${item._id}`,
            title: firstTrack.title || item.title,
            artistId: item._id,
            artistName: item.artistNameRef || item.artistName || "Joshua Samuel",
            role: firstTrack.role || "Composer / Producer",
            coverUrl: item.coverUrl || "",
            audioUrl: firstTrack.audioFileUrl || firstTrack.audioUrl || "",
            releaseYear: item.releaseYear || "2024",
          });
        } else if (item._type === "screenProject") {
          const firstCue = item.scoreCues && item.scoreCues.length > 0 ? item.scoreCues[0] : null;
          selectedSongs.push({
            id: `feat-sp-${item._id}`,
            title: firstCue ? firstCue.title : `${item.title} (Main Score Theme)`,
            artistId: `sp-${item._id}`,
            artistName: item.productionCompany || item.title || "Joshua Samuel",
            role: `${item.role || "Composer"} (${item.year || "2024"})`,
            coverUrl: item.posterUrl || "",
            audioUrl: firstCue ? (firstCue.audioFileUrl || firstCue.audioUrl || "") : "",
            releaseYear: item.year || "2024",
          });
        }
      });
      if (selectedSongs.length > 0) return selectedSongs;
    }

    // Fallback: return top songs from getSongs
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

export async function getContactInfo(): Promise<ContactInfoData> {
  try {
    const data = await client.fetch(
      `*[_type == "contactInfo"][0] {
        email,
        locations,
        representation,
        socials[] {
          platform,
          url,
          handle
        }
      }`,
      {},
      { next: { revalidate: 0 } }
    );
    if (!data) return mockContactInfo;
    return {
      email: data.email || mockContactInfo.email,
      locations: data.locations || mockContactInfo.locations,
      representation: data.representation || mockContactInfo.representation,
      socials: data.socials && data.socials.length > 0 ? data.socials : mockContactInfo.socials,
    };
  } catch {
    return mockContactInfo;
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

export interface PortfolioItem {
  id: string;
  title: string;
  artist: string;
  role: string;
  category: "Screen" | "Song" | "Ad";
  coverUrl: string;
  year?: string;
  description?: string;
  mediaType: "video" | "audio";
  url: string;
  scoreCues?: Array<{ id: string; title: string; duration: string; audioUrl: string }>;
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const [screenProjects, songs, ads] = await Promise.all([
      getScreenProjects(),
      getSongs(),
      getAds(),
    ]);

    const screenItems: PortfolioItem[] = (screenProjects || []).map((sp) => ({
      id: sp.id,
      title: sp.title,
      artist: sp.productionCompany || sp.director || "Joshua Samuel",
      role: sp.role,
      category: "Screen",
      coverUrl: sp.posterUrl,
      year: sp.year,
      description: sp.description,
      mediaType: "video",
      url: sp.videoUrl,
      scoreCues: sp.scoreCues,
    }));

    const VERIFIED_AUDIO_SAMPLES = [
      "https://raw.githubusercontent.com/goldfire/howler.js/master/examples/player/audio/rave_digger.mp3",
      "https://raw.githubusercontent.com/goldfire/howler.js/master/examples/player/audio/80s_vibe.mp3",
      "https://raw.githubusercontent.com/mdn/webaudio-examples/main/audio-analyser/vite.mp3",
      "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3",
    ];

    const songItems: PortfolioItem[] = (songs || []).map((s, idx) => {
      let audioSrc = s.audioUrl || s.embedUrl || "";
      if (!audioSrc || audioSrc.includes("soundhelix.com")) {
        audioSrc = VERIFIED_AUDIO_SAMPLES[idx % VERIFIED_AUDIO_SAMPLES.length];
      }
      return {
        id: s.id,
        title: s.title,
        artist: s.artistName,
        role: s.role,
        category: "Song",
        coverUrl: s.coverUrl,
        year: s.releaseYear,
        description: `Original record production & composition featuring ${s.artistName}.`,
        mediaType: "audio",
        url: audioSrc,
      };
    });

    const adItems: PortfolioItem[] = (ads || []).map((ad) => ({
      id: ad.id,
      title: ad.brandName,
      artist: "Commercial Campaign",
      role: "Original Music & Sonic Branding",
      category: "Ad",
      coverUrl: ad.thumbnailUrl,
      description: ad.description,
      mediaType: "video",
      url: ad.videoUrl,
    }));

    // Interleave for rich variety in Cover Flow
    const combined: PortfolioItem[] = [];
    const maxLen = Math.max(screenItems.length, songItems.length, adItems.length);
    for (let i = 0; i < maxLen; i++) {
      if (screenItems[i]) combined.push(screenItems[i]);
      if (songItems[i]) combined.push(songItems[i]);
      if (adItems[i]) combined.push(adItems[i]);
    }

    if (combined.length > 0) return combined;

    return [];
  } catch (err) {
    console.error("Error fetching all portfolio items:", err);
    return [];
  }
}
