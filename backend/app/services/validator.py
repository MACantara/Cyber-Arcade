from typing import Any

VALID_DIFFICULTIES = {"beginner", "easy", "medium", "hard"}


def validate_manifest(
    manifest: dict[str, Any],
    index: int,
    domain_ids: set[str],
    all_ids: set[str],
) -> list[str]:
    errors: list[str] = []
    required = [
        "id",
        "title",
        "domain",
        "difficulty",
        "description",
        "xp",
        "objective",
        "hints",
        "successCriteria",
    ]

    for field in required:
        if field not in manifest or manifest[field] is None:
            errors.append(f"manifest[{index}].{field} is required")

    domain = manifest.get("domain")
    if domain is not None and domain not in domain_ids:
        errors.append(f'manifest[{index}].domain "{domain}" is not a known domain')

    difficulty = manifest.get("difficulty")
    if difficulty is not None and difficulty not in VALID_DIFFICULTIES:
        errors.append(
            f'manifest[{index}].difficulty must be one of '
            f'{", ".join(sorted(VALID_DIFFICULTIES))}'
        )

    xp = manifest.get("xp")
    if xp is not None and (not isinstance(xp, (int, float)) or xp < 0):
        errors.append(f"manifest[{index}].xp must be a non-negative number")

    hints = manifest.get("hints")
    if hints is not None and not isinstance(hints, list):
        errors.append(f"manifest[{index}].hints must be an array")

    prerequisites = manifest.get("prerequisites", [])
    if not isinstance(prerequisites, list):
        errors.append(f"manifest[{index}].prerequisites must be an array")
    else:
        for prereq in prerequisites:
            if not isinstance(prereq, str):
                errors.append(
                    f"manifest[{index}].prerequisites must contain only strings"
                )
                break
            if prereq not in all_ids:
                errors.append(
                    f'manifest[{index}] references unknown prerequisite "{prereq}"'
                )

    return errors
