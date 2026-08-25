export function formatVideoEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  let formatted = url.trim();

  // YouTube watch links: https://www.youtube.com/watch?v=ID
  if (formatted.includes("youtube.com/watch")) {
    const videoId = formatted.split("v=")[1]?.split("&")[0];
    if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  // YouTube shorts/share links: https://youtu.be/ID
  if (formatted.includes("youtu.be/")) {
    const videoId = formatted.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  // Existing YouTube embed links
  if (formatted.includes("youtube.com/embed/")) {
    const videoId = formatted.split("youtube.com/embed/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  // Vimeo links: https://vimeo.com/12345678 -> https://player.vimeo.com/video/12345678
  if (formatted.includes("vimeo.com/") && !formatted.includes("player.vimeo.com")) {
    const videoId = formatted.split("vimeo.com/")[1]?.split("?")[0];
    if (videoId) return `https://player.vimeo.com/video/${videoId}`;
  }

  return formatted;
}
