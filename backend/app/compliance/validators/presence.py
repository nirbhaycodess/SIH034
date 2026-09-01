def validate_presence(value: str | None) -> tuple[bool, str]:
    if value and value.strip():
        return True, "A non-empty declaration was detected."
    return False, "No declaration value was detected."
