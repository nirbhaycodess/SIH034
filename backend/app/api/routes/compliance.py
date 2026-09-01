from fastapi import APIRouter

from ...compliance.engine.compliance_engine import ComplianceEngine
from ...compliance.rules.demo_rules import DEMO_RULES
from ...compliance.schemas.results import ComplianceEvaluation
from ...schemas.analysis import DeclarationExtraction

router = APIRouter()
engine = ComplianceEngine(DEMO_RULES)


@router.post("/evaluate", response_model=ComplianceEvaluation)
async def evaluate_compliance(declarations: DeclarationExtraction) -> ComplianceEvaluation:
    return engine.evaluate(declarations)
