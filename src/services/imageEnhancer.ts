export interface ImageQualityMetrics {
  sharpnessScore: number; // 0 - 100
  contrastScore: number; // 0 - 100
  brightnessScore: number; // 0 - 100
  resolutionWidth: number;
  resolutionHeight: number;
  overallQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR_RETAKE_RECOMMENDED';
  issuesDetected: string[];
  retakeRecommended: boolean;
  retakeGuidance: string[];
}

export interface EnhancedImageResult {
  enhancedFile: File;
  enhancedUrl: string;
  originalUrl: string;
  metrics: ImageQualityMetrics;
}

/**
 * Loads a File or URL into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Analyzes Image Quality: Detects blur, low contrast, underexposure, and glare.
 */
export async function assessImageQuality(file: File): Promise<ImageQualityMetrics> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    // Downscale for fast metric calculation
    const sampleWidth = Math.min(600, img.naturalWidth || 600);
    const sampleHeight = Math.round((sampleWidth / (img.naturalWidth || 1)) * (img.naturalHeight || 400));
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

    const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
    const data = imgData.data;

    // 1. Brightness and Contrast (Mean & Variance of luminance)
    let totalLum = 0;
    const lumArray: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      // Perceptual luminance formula: 0.299R + 0.587G + 0.114B
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      totalLum += lum;
      lumArray.push(lum);
    }
    const meanLum = totalLum / lumArray.length;

    let lumVar = 0;
    for (let i = 0; i < lumArray.length; i++) {
      lumVar += (lumArray[i] - meanLum) ** 2;
    }
    const lumStdDev = Math.sqrt(lumVar / lumArray.length);

    const brightnessScore = Math.round(Math.max(0, 100 - Math.abs(meanLum - 128) * 0.78));
    const contrastScore = Math.min(100, Math.round((lumStdDev / 64) * 100));

    // 2. Blur / Sharpness calculation using Laplacian variance gradient approximation
    let edgeSum = 0;
    let edgeCount = 0;
    const w = sampleWidth;
    const h = sampleHeight;

    for (let y = 1; y < h - 1; y += 2) {
      for (let x = 1; x < w - 1; x += 2) {
        const idx = y * w + x;
        const center = lumArray[idx];
        const top = lumArray[(y - 1) * w + x];
        const bottom = lumArray[(y + 1) * w + x];
        const left = lumArray[y * w + (x - 1)];
        const right = lumArray[y * w + (x + 1)];

        // 2D Laplacian operator: 4*center - top - bottom - left - right
        const laplacian = Math.abs(4 * center - top - bottom - left - right);
        edgeSum += laplacian;
        edgeCount++;
      }
    }

    const avgEdgeGradient = edgeCount > 0 ? edgeSum / edgeCount : 0;
    // Map average edge gradient to 0 - 100 sharpness score
    const sharpnessScore = Math.min(100, Math.max(10, Math.round(avgEdgeGradient * 2.8)));

    // 3. Issue detection and retake guidance
    const issuesDetected: string[] = [];
    const retakeGuidance: string[] = [];

    const isLowResolution = (img.naturalWidth || 0) < 600 || (img.naturalHeight || 0) < 600;
    const isBlurry = sharpnessScore < 40;
    const isLowContrast = contrastScore < 35;
    const isUnderExposed = meanLum < 50;
    const isOverExposed = meanLum > 210;

    if (isBlurry) {
      issuesDetected.push('Camera Blur / Unfocused Text Detected');
      retakeGuidance.push('Hold your camera steady and tap the product text directly to trigger autofocus.');
    }

    if (isLowContrast) {
      issuesDetected.push('Low Contrast / Faint Text');
      retakeGuidance.push('Adjust angle to prevent reflective glare from shiny packaging or foil.');
    }

    if (isUnderExposed) {
      issuesDetected.push('Insufficient Illumination / Heavy Shadows');
      retakeGuidance.push('Move product to a brightly illuminated area or turn on room lighting.');
    }

    if (isOverExposed) {
      issuesDetected.push('Overexposed Lighting / Flash Glare');
      retakeGuidance.push('Disable camera flash to avoid washing out small printed numerals.');
    }

    if (isLowResolution) {
      issuesDetected.push('Low Image Resolution (< 600px)');
      retakeGuidance.push('Move camera closer to the Principal Display Panel (PDP) so text is sharp and legible.');
    }

    const retakeRecommended = isBlurry || (isLowContrast && isUnderExposed) || isOverExposed;

    let overallQuality: ImageQualityMetrics['overallQuality'] = 'EXCELLENT';
    if (retakeRecommended) {
      overallQuality = 'POOR_RETAKE_RECOMMENDED';
    } else if (sharpnessScore < 60 || contrastScore < 50) {
      overallQuality = 'FAIR';
    } else if (sharpnessScore >= 80 && contrastScore >= 70) {
      overallQuality = 'EXCELLENT';
    } else {
      overallQuality = 'GOOD';
    }

    return {
      sharpnessScore,
      contrastScore,
      brightnessScore,
      resolutionWidth: img.naturalWidth || sampleWidth,
      resolutionHeight: img.naturalHeight || sampleHeight,
      overallQuality,
      issuesDetected,
      retakeRecommended,
      retakeGuidance,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * High-Performance Image Enhancer:
 * 1. Upscales low-res labels with bicubic/bilinear smoothing.
 * 2. Applies adaptive histogram stretching for contrast boosting.
 * 3. Applies 3x3 unsharp masking convolution kernel to sharpen font edges.
 */
export async function enhanceImageForOcr(
  file: File,
  targetMinDimension = 1200
): Promise<EnhancedImageResult> {
  const originalUrl = URL.createObjectURL(file);
  const metrics = await assessImageQuality(file);

  const img = await loadImage(originalUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create enhancement canvas');

  // Compute upscaled target dimensions if too small
  const origW = img.naturalWidth || 800;
  const origH = img.naturalHeight || 600;
  const scale = Math.max(1, targetMinDimension / Math.min(origW, origH));
  const targetW = Math.round(origW * Math.min(2.5, scale));
  const targetH = Math.round(origH * Math.min(2.5, scale));

  canvas.width = targetW;
  canvas.height = targetH;

  // Draw with high quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const imgData = ctx.getImageData(0, 0, targetW, targetH);
  const d = imgData.data;

  // 1. Contrast Normalization (Stretch 5% to 95% percentile)
  let minLum = 255;
  let maxLum = 0;
  for (let i = 0; i < d.length; i += 16) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const range = Math.max(20, maxLum - minLum);
  const stretchFactor = 255 / range;

  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, Math.max(0, (d[i] - minLum) * stretchFactor));
    d[i + 1] = Math.min(255, Math.max(0, (d[i + 1] - minLum) * stretchFactor));
    d[i + 2] = Math.min(255, Math.max(0, (d[i + 2] - minLum) * stretchFactor));
  }
  ctx.putImageData(imgData, 0, 0);

  // 2. Convolution Sharpening Kernel (Unsharp Mask)
  // [  0, -0.4,  0 ]
  // [ -0.4, 2.6, -0.4 ]
  // [  0, -0.4,  0 ]
  const sharpenedData = ctx.createImageData(targetW, targetH);
  const s = sharpenedData.data;
  const w = targetW;
  const h = targetH;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const center = d[idx + c];
        const top = d[((y - 1) * w + x) * 4 + c];
        const bottom = d[((y + 1) * w + x) * 4 + c];
        const left = d[(y * w + (x - 1)) * 4 + c];
        const right = d[(y * w + (x + 1)) * 4 + c];

        const sharpVal = center * 2.6 - (top + bottom + left + right) * 0.4;
        s[idx + c] = Math.min(255, Math.max(0, sharpVal));
      }
      s[idx + 3] = 255; // alpha
    }
  }
  ctx.putImageData(sharpenedData, 0, 0);

  // Convert enhanced canvas to Blob & File
  const enhancedBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || file), 'image/jpeg', 0.95);
  });

  const enhancedFile = new File([enhancedBlob], `enhanced_${file.name}`, { type: 'image/jpeg' });
  const enhancedUrl = URL.createObjectURL(enhancedBlob);

  return {
    enhancedFile,
    enhancedUrl,
    originalUrl,
    metrics,
  };
}
