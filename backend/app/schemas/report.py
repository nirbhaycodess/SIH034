from .inspection import InspectionStatus
from pydantic import BaseModel


class Report(BaseModel):
    id: str
    inspection_id: str
    product: str
    date: str
    status: InspectionStatus
    inspector: str
    download_url: str
