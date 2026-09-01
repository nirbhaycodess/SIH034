from .inspection import InspectionStatus
from pydantic import BaseModel


class Product(BaseModel):
    id: str
    name: str
    brand: str
    manufacturer: str
    category: str
    last_inspection: str
    status: InspectionStatus
    violations: int
