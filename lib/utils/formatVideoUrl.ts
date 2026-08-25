export function formatVideoEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  let formatted = url.trim();

  // YouTube watch links: https://www.youtube.com/watch?v=ID -> https://www.youtube.com/embed/ID
  if (formatted.includes("youtube.com/watch")) {
    const videoId = formatted.split("v=")[1]?.split("&")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  // YouTube short links: https://youtu.be/ID -> https://www.youtube.com/embed/ID
  if (formatted.includes("youtu.be/")) {
    const videoId = formatted.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  // Vimeo links: https://vimeo.com/12345678 -> https://player.vimeo.com/video/12345678
  if (formatted.includes("vimeo.com/") && !formatted.includes("player.vimeo.com")) {
    const videoId = formatted.split("vimeo.com/")[1]?.split("?")[0];
    if (videoId) return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }

  return formatted;
}
