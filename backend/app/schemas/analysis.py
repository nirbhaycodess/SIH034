from pydantic import BaseModel, Field


DECLARATION_FIELDS = (
    "product_name",
    "manufacturer",
    "packer",
    "importer",
    "net_quantity",
    "mrp",
    "manufacturing_date",
    "consumer_care",
    "country_of_origin",
)


class ExtractedField(BaseModel):
    value: str | None = None
    confidence: float = Field(default=0, ge=0, le=1)


class DeclarationExtraction(BaseModel):
    product_name: ExtractedField = Field(default_factory=ExtractedField)
    manufacturer: ExtractedField = Field(default_factory=ExtractedField)
    packer: ExtractedField = Field(default_factory=ExtractedField)
    importer: ExtractedField = Field(default_factory=ExtractedField)
    net_quantity: ExtractedField = Field(default_factory=ExtractedField)
    mrp: ExtractedField = Field(default_factory=ExtractedField)
    manufacturing_date: ExtractedField = Field(default_factory=ExtractedField)
    consumer_care: ExtractedField = Field(default_factory=ExtractedField)
    country_of_origin: ExtractedField = Field(default_factory=ExtractedField)


class ImageAnalysisResponse(BaseModel):
    filename: str
    fields: DeclarationExtraction
    ocr_status: str
    ocr_error: str | None = None
