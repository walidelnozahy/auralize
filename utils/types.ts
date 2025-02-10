export interface SpotifyImage {
  height: number;
  width: number;
  url: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  track: {
    id: string;
    name: string;
    artists: any[];
    album: SpotifyAlbum;
    uri: string;
  };
}
export interface Track {
  id: string;
  name: string;
  artists: any[];
  album: {
    images: { url: string }[];
  };
  uri: string;
}

export interface TrackCarouselProps {
  tracks: Track[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export interface TrackCardProps {
  track: Track;
  isCurrent: boolean;
}
