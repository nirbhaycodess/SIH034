from __future__ import annotations

import numpy as np

from .errors import ImageAnalysisError


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    if not image_bytes:
        raise ImageAnalysisError("The uploaded image is empty.")

    try:
        import cv2
    except ImportError as exc:
        raise ImageAnalysisError("OpenCV is not installed.") from exc

    image = cv2.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ImageAnalysisError("The uploaded file is not a readable image.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    return cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
