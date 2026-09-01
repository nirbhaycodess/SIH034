class ImageAnalysisError(Exception):
    """An expected failure while decoding, preprocessing, or analyzing an image."""


class OCRProviderError(ImageAnalysisError):
    """The configured OCR provider could not analyze the image."""
