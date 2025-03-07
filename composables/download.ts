/**
 * Download link
 * @param href - String of content
 * @param fileName - File name to save
 */
export function useDownloadLink(href: string, fileName: string, targetBlank = false) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = fileName;
  if (targetBlank) {
    anchor.target = '_blank';
  }
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
