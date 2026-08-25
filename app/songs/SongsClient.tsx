"use client";

import React, { useState } from "react";
import { ArtistData, SongData } from "@/lib/mockData";
import { ArtistStrip } from "@/components/ArtistStrip";
import { TrackList } from "@/components/TrackList";

interface SongsClientProps {
  artists: ArtistData[];
  songs: SongData[];
}

export const SongsClient: React.FC<SongsClientProps> = ({ artists, songs }) => {
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  return (
    <div>
      {/* Artist Filter Strip */}
      <ArtistStrip
        artists={artists}
        selectedArtistId={selectedArtistId}
        onSelectArtist={(id) => setSelectedArtistId(id)}
      />

      {/* Track List */}
      <TrackList songs={songs} selectedArtistId={selectedArtistId} />
    </div>
  );
};
