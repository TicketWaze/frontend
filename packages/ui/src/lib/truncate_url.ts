export default function truncate_url(url: string, maxLength: number = 37): string {
  return url.length > maxLength ? url.slice(0, maxLength) + '...' : url
}
