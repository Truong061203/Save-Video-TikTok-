/**
 * Handles the "Hard Part": Downloading files avoiding cross-origin tab opening.
 * Strategy: Fetch Blob -> ObjectURL -> Anchor Click.
 * Fallback: Direct window.open.
 */
export const handleDownload = async (
  url: string,
  filename: string,
  onProgress?: (msg: string) => void
): Promise<void> => {
  try {
    if (onProgress) onProgress('Connecting...');

    // Attempt to fetch as blob to bypass "Open in new tab" behavior
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (onProgress) onProgress('Downloading...');
    
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    if (onProgress) onProgress('Finalizing...');

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
    
    if (onProgress) onProgress('Complete');

  } catch (error) {
    console.warn('Blob download failed due to CORS or Network, falling back to direct link.', error);
    
    // Fallback strategy
    if (onProgress) onProgress('Opening in new tab...');
    
    // Create a temporary link to force download if possible, else it opens in new tab
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};