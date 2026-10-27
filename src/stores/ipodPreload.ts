/**
 * iPod default-track preloading, extracted from `useIpodStore`.
 *
 * `main.tsx` kicks this off before React mounts. Keeping it in its own thin
 * module means the entry chunk only pays for the song-metadata API client —
 * not the entire 2,600-line iPod store and its transitive dependencies.
 */
import { listAllCachedSongMetadata } from "@/utils/songMetadataCache";
import { mapCatalogSongToTrack } from "@/stores/ipodCatalogTrackMapping";
import type { Track } from "@/shared/media/library";
import { createClientLogger } from "@/utils/logger";

const log = createClientLogger("IpodPreload");

const FALLBACK_TRACKS: Track[] = [
  { id: "Ouem6cFXJvA", url: "https://www.youtube.com/watch?v=Ouem6cFXJvA", title: "Your Dog", artist: "Soccer Mommy" },
  { id: "BL2r9FZdJbo", url: "https://www.youtube.com/watch?v=BL2r9FZdJbo", title: "LOOK OUT FOR ME: KETTAMA VERSION", artist: "TURNSTILE" },
  { id: "ojCikI9npJQ", url: "https://www.youtube.com/watch?v=ojCikI9npJQ", title: "I'll Be Around", artist: "The Spinners" },
  { id: "36_4xjLFjM0", url: "https://www.youtube.com/watch?v=36_4xjLFjM0", title: "1901", artist: "Phoenix" },
  { id: "4oSjO9FP5t4", url: "https://www.youtube.com/watch?v=4oSjO9FP5t4", title: "Can't Decide", artist: "Max Dean, Luke Dean, Locky" },
  { id: "AE8y25CcE6s", url: "https://www.youtube.com/watch?v=AE8y25CcE6s", title: "Through The Wire", artist: "Kanye West" },
  { id: "sk3rpYkiHe8", url: "https://www.youtube.com/watch?v=sk3rpYkiHe8", title: "Devil In A New Dress", artist: "Kanye West" },
  { id: "SycVgytRTQ4", url: "https://www.youtube.com/watch?v=SycVgytRTQ4", title: "Fallin' For You", artist: "Colbie Caillat" },
  { id: "dAUUy7NMnaY", url: "https://www.youtube.com/watch?v=dAUUy7NMnaY", title: "Ventura Highway", artist: "America" },
  { id: "Cl6Rz1Uvi2M", url: "https://www.youtube.com/watch?v=Cl6Rz1Uvi2M", title: "Delilah (pull me out of this)", artist: "Fred again.." },
  { id: "FGBhQbmPwH8", url: "https://www.youtube.com/watch?v=FGBhQbmPwH8", title: "One More Time", artist: "Daft Punk" },
  { id: "K0HSD_i2DvA", url: "https://www.youtube.com/watch?v=K0HSD_i2DvA", title: "Around The World", artist: "Daft Punk" },
  { id: "ajUMhpotf8k", url: "https://www.youtube.com/watch?v=ajUMhpotf8k", title: "Talk To You", artist: "ANOTR ft. 54 Ultra" },
  { id: "d2iWMT9lBb4", url: "https://www.youtube.com/watch?v=d2iWMT9lBb4", title: "Think of You", artist: "KETTAMA, Prospa" },
];

// In-memory cache for iPod tracks data
let cachedIpodData: { tracks: Track[]; version: number } | null = null;
let ipodDataPromise: Promise<{ tracks: Track[]; version: number }> | null =
  null;
/** Only the latest load may write `cachedIpodData` (avoids stale force-refresh overwrites). */
let ipodLoadGeneration = 0;

/**
 * Preload iPod tracks data early (can be called before React mounts).
 * This starts fetching the JSON file without blocking.
 */
export function preloadIpodData(): void {
  if (cachedIpodData || ipodDataPromise) return;
  loadDefaultTracks();
}

/**
 * Load default tracks from Redis song metadata cache.
 * @param forceRefresh - If true, bypasses cache and fetches fresh data (used by syncLibrary)
 */
export async function loadDefaultTracks(forceRefresh = false): Promise<{
  tracks: Track[];
  version: number;
}> {
  // Return cached data immediately if available (unless force refresh)
  if (!forceRefresh && cachedIpodData) {
    return cachedIpodData;
  }

  // Return existing promise if fetch is in progress (deduplication)
  // But not if we need a force refresh
  if (!forceRefresh && ipodDataPromise) {
    return ipodDataPromise;
  }

  const thisGeneration = ++ipodLoadGeneration;

  // Start new fetch
  const fetchPromise = (async () => {
    try {
      // Load from Redis song metadata cache
      // Only sync songs created by user "ryo" (the admin/curator)
      const cachedSongs = await listAllCachedSongMetadata("ryo");

      log.debug("Loaded tracks from Redis cache", {
        trackCount: cachedSongs.length,
        createdBy: "ryo",
      });
      // Songs are already sorted by createdAt (newest first) from the API
      const tracks: Track[] = cachedSongs.length > 0
        ? cachedSongs.map(mapCatalogSongToTrack)
        : FALLBACK_TRACKS;
      const version =
        cachedSongs.length > 0
          ? Math.max(...cachedSongs.map((s) => s.createdAt || 1))
          : 1;
      const payload = { tracks, version };
      if (thisGeneration === ipodLoadGeneration) {
        cachedIpodData = payload;
        return payload;
      }
      // A newer load won the race; prefer latest cache so awaiters do not apply stale tracks.
      return cachedIpodData ?? payload;
    } catch (err) {
      console.error("Failed to load tracks from cache, using fallback playlist", err);
      return { tracks: FALLBACK_TRACKS, version: 1 };
    }
  })();

  // Only set the shared promise for non-force-refresh requests
  if (!forceRefresh) {
    ipodDataPromise = fetchPromise;
    fetchPromise.finally(() => {
      ipodDataPromise = null;
    });
  }

  return fetchPromise;
}
