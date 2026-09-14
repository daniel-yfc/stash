"""Tests for tools/check_docs_index.py."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from tools.check_docs_index import frontmatter, main


def test_frontmatter_valid(tmp_path: Path):
    """Test parsing valid YAML frontmatter."""
    md_file = tmp_path / "doc.md"
    md_file.write_text("---\ndoc_id: DOC-01\ntitle: Sample\n---\n\nContent here.", encoding="utf-8")
    result = frontmatter(md_file)
    assert result == {"doc_id": "DOC-01", "title": "Sample"}


def test_frontmatter_yaml_error(tmp_path: Path):
    """Test handling of invalid YAML frontmatter triggering yaml.YAMLError."""
    md_file = tmp_path / "invalid_yaml.md"
    md_file.write_text("---\n: invalid: yaml: [\n---\n\nContent", encoding="utf-8")
    result = frontmatter(md_file)
    assert result == {}


def test_frontmatter_missing_start_delimiter(tmp_path: Path):
    """Test file with no starting --- header."""
    md_file = tmp_path / "no_start.md"
    md_file.write_text("doc_id: DOC-01\n---\n\nContent", encoding="utf-8")
    result = frontmatter(md_file)
    assert result == {}


def test_frontmatter_missing_end_delimiter(tmp_path: Path):
    """Test file with no closing --- delimiter."""
    md_file = tmp_path / "no_end.md"
    md_file.write_text("---\ndoc_id: DOC-01\ntitle: Sample", encoding="utf-8")
    result = frontmatter(md_file)
    assert result == {}


def test_frontmatter_non_dict(tmp_path: Path):
    """Test frontmatter that parses to non-dict types (e.g., list or string)."""
    md_file = tmp_path / "list_yaml.md"
    md_file.write_text("---\n- item1\n- item2\n---\n\nContent", encoding="utf-8")
    result = frontmatter(md_file)
    assert result == {}


def test_frontmatter_empty(tmp_path: Path):
    """Test frontmatter that parses to None (empty frontmatter)."""
    md_file = tmp_path / "empty_yaml.md"
    md_file.write_text("---\n\n---\n\nContent", encoding="utf-8")
    result = frontmatter(md_file)
    assert result == {}


def test_check_docs_index_main_passes():
    """Test that main() passes for the current repository setup."""
    assert main() == 0
