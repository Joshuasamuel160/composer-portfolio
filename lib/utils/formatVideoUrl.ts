export function isDirectVideoFile(url: string | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes(".mp4") ||
    lower.includes(".webm") ||
    lower.includes(".mov") ||
    lower.includes("cdn.sanity.io/files")
  );
}

const minimalTrailerParams = "controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1";

export function formatVideoEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  let formatted = url.trim();

  // If it's a direct uploaded MP4 / WebM / Sanity video file
  if (isDirectVideoFile(formatted)) {
    return formatted;
  }

  // YouTube watch links: https://www.youtube.com/watch?v=ID
  if (formatted.includes("youtube.com/watch")) {
    const videoId = formatted.split("v=")[1]?.split("&")[0];
    if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?${minimalTrailerParams}`;
  }

  // YouTube shorts/share links: https://youtu.be/ID
  if (formatted.includes("youtu.be/")) {
    const videoId = formatted.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?${minimalTrailerParams}`;
  }

  // Existing YouTube embed links
  if (formatted.includes("youtube.com/embed/")) {
    const videoId = formatted.split("youtube.com/embed/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?${minimalTrailerParams}`;
  }

  // Vimeo links: https://vimeo.com/12345678
  if (formatted.includes("vimeo.com/") && !formatted.includes("player.vimeo.com")) {
    const videoId = formatted.split("vimeo.com/")[1]?.split("?")[0];
    if (videoId) return `https://player.vimeo.com/video/${videoId}?controls=0&title=0&byline=0&portrait=0`;
  }

  return formatted;
}
