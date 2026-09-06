"""OpenCV image preprocessing for better OCR results."""
from __future__ import annotations

import logging

logger = logging.getLogger("packsure.image_processing")

try:
    import cv2
    import numpy as np
    _cv2_available = True
except ImportError:
    _cv2_available = False
    logger.info("OpenCV not available — skipping image preprocessing.")


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
