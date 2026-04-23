export const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?_=20210521171500'; // Default avatar
  if (imagePath.startsWith('http')) return imagePath; // Google Auth or external URLs

  // Clean up the path just in case "public" is stuck in your DB from earlier
  let cleanPath = imagePath.replace(/^\\?public[\\/]/, '/').replace(/^\/public\//, '/');

  // Ensure it starts with a slash
  if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  return `${baseUrl}${cleanPath}`;
};