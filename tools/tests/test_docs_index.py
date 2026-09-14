"""Tests for tools/check_docs_index.py."""

from pathlib import Path
from tools.check_docs_index import ROOT, expected_markdown_paths


def test_expected_markdown_paths_real_repo():
    """Verify expected_markdown_paths against actual repository structure."""
    paths = expected_markdown_paths()
    assert isinstance(paths, set)

    # Core root markdown files must be present
    assert "README.md" in paths
    assert "AGENTS.md" in paths
    assert "CLAUDE.md" in paths
    assert "CONTRIBUTING.md" in paths

    # Subdirectory READMEs
    assert "scrapers/README.md" in paths
    assert "templates/README.md" in paths
    assert "tools/README.md" in paths
    assert "validator/README.md" in paths
    assert "skills/stash-scraper-builder/SKILL.md" in paths

    # Files from docs directory
    for doc_file in (ROOT / "docs").glob("*.md"):
        rel_path = str(doc_file.relative_to(ROOT))
        assert rel_path in paths

    # Files from references directory
    ref_dir = ROOT / "skills" / "stash-scraper-builder" / "references"
    for ref_file in ref_dir.glob("*.md"):
        rel_path = str(ref_file.relative_to(ROOT))
        assert rel_path in paths


def test_expected_markdown_paths_mocked(tmp_path, monkeypatch):
    """Verify expected_markdown_paths logic with a mocked directory structure."""
    fake_root = tmp_path / "repo"
    fake_root.mkdir()

    # Create required subdirectories
    docs_dir = fake_root / "docs"
    docs_dir.mkdir()
    ref_dir = fake_root / "skills" / "stash-scraper-builder" / "references"
    ref_dir.mkdir(parents=True)

    # Create dummy files in globbed dirs
    (docs_dir / "doc1.md").write_text("# Doc 1")
    (docs_dir / "doc2.md").write_text("# Doc 2")
    (ref_dir / "ref1.md").write_text("# Ref 1")
    (ref_dir / "non_md.txt").write_text("ignore")

    monkeypatch.setattr("tools.check_docs_index.ROOT", fake_root)

    paths = expected_markdown_paths()

    expected_set = {
        "README.md",
        "AGENTS.md",
        "CLAUDE.md",
        "CONTRIBUTING.md",
        "scrapers/README.md",
        "templates/README.md",
        "tools/README.md",
        "tools/SRB-2.0-documentation.md",
        "validator/README.md",
        "skills/stash-scraper-builder/SKILL.md",
        "docs/doc1.md",
        "docs/doc2.md",
        "skills/stash-scraper-builder/references/ref1.md",
    }

    assert paths == expected_set
    assert "skills/stash-scraper-builder/references/non_md.txt" not in paths
