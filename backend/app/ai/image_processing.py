"""OpenCV image preprocessing for better OCR results."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger("packsure.image_processing")

try:
    import cv2
    import numpy as np
    _cv2_available = True
except ImportError:
    _cv2_available = False
    logger.info("OpenCV not available — skipping image preprocessing.")


def preprocess_for_ocr(image_path: str, output_path: Optional[str] = None) -> str:
    """
    Apply OpenCV preprocessing to improve OCR accuracy.
    Returns path to processed image (original if OpenCV unavailable).
    """
    if not _cv2_available:
        return image_path

    try:
        img = cv2.imread(image_path)
        if img is None:
            logger.warning("Could not read image: %s", image_path)
            return image_path

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Denoise
        denoised = cv2.fastNlMeansDenoising(gray, h=10)

        # Adaptive threshold to handle uneven lighting
        thresh = cv2.adaptiveThreshold(
            denoised, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 11, 2
        )

        # Scale up if small
        h, w = thresh.shape
        if min(h, w) < 600:
            scale = 1200 / min(h, w)
            thresh = cv2.resize(thresh, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

        # Save
        out = output_path or image_path.replace(".", "_processed.")
        cv2.imwrite(out, thresh)
        logger.debug("Preprocessed image saved to: %s", out)
        return out

    except Exception as exc:
        logger.error("Image preprocessing error: %s", exc)
        return image_path


def get_image_quality(image_path: str) -> dict:
    """Analyze image quality metrics."""
    if not _cv2_available:
        return {"available": False, "note": "OpenCV not installed."}

    try:
        img = cv2.imread(image_path)
        if img is None:
            return {"available": False, "note": "Could not read image."}

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        mean_brightness = float(gray.mean())

        sharpness = min(100, int(laplacian_var * 0.5))
        brightness_score = max(0, 100 - abs(mean_brightness - 128) * 0.78)

        return {
            "available": True,
            "width": w,
            "height": h,
            "sharpness_score": sharpness,
            "brightness_score": int(brightness_score),
            "is_blurry": laplacian_var < 100,
            "note": "Physical font-size verification requires calibrated scale data.",
        }
    except Exception as exc:
        return {"available": False, "note": str(exc)}
