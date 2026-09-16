<<<<<<< HEAD
"""Integration and unit tests for tools/check_scraper_docs.py."""

from tools import check_scraper_docs


def test_check_scraper_docs_main_success():
    """Test main() returns 0 on the actual repository docs."""
    assert check_scraper_docs.main() == 0


def test_full_yaml_blocks(tmp_path):
    """Test full_yaml_blocks extracts YAML blocks with Unix and Windows newlines."""
    md_file = tmp_path / "doc.md"
    content = (
        "Some text\n"
        "```yaml\n"
        "name: Block1\n"
        "sceneByURL: http://example.com\n"
        "```\n"
        "Middle text\n"
        "```yaml\r\n"
        "name: Block2\r\n"
        "sceneByName: Test\r\n"
=======
"""Unit and integration tests for tools/check_scraper_docs.py."""

from pathlib import Path
import pytest
from tools import check_scraper_docs


def test_full_yaml_blocks_single_block(tmp_path: Path):
    """Extract single YAML block from markdown."""
    md_file = tmp_path / "test.md"
    content = (
        "# Title\n\n"
        "```yaml\n"
        "name: test_scraper\n"
        "sceneByURL:\n"
        "  - action: scrape\n"
        "```\n"
    )
    md_file.write_text(content, encoding="utf-8")
    blocks = check_scraper_docs.full_yaml_blocks(md_file)
    assert len(blocks) == 1
    assert blocks[0] == "name: test_scraper\nsceneByURL:\n  - action: scrape\n"


def test_full_yaml_blocks_multiple_blocks(tmp_path: Path):
    """Extract multiple YAML blocks from markdown."""
    md_file = tmp_path / "test.md"
    content = (
        "```yaml\n"
        "block1: true\n"
        "```\n\n"
        "Some text\n\n"
        "```yaml\n"
        "block2: true\n"
>>>>>>> 98922ed (test: add unit tests for full_yaml_blocks extraction)
        "```\n"
    )
    md_file.write_text(content, encoding="utf-8")
    blocks = check_scraper_docs.full_yaml_blocks(md_file)
    assert len(blocks) == 2
<<<<<<< HEAD
    assert "name: Block1" in blocks[0]
    assert "name: Block2" in blocks[1]


def test_has_mapping():
    """Test has_mapping checks for expected mapping suffix keys."""
    assert check_scraper_docs.has_mapping({"sceneByURL": {}}) is True
    assert check_scraper_docs.has_mapping({"performerByName": {}}) is True
    assert check_scraper_docs.has_mapping({"movieByFragment": {}}) is True
    assert check_scraper_docs.has_mapping({"galleryByQueryFragment": {}}) is True
    assert check_scraper_docs.has_mapping({"name": "Test"}) is False
    assert check_scraper_docs.has_mapping("not a dict") is False


def test_main_missing_schema(monkeypatch, tmp_path):
    """Test main() fails when schema file does not exist."""
    fake_schema = tmp_path / "missing.json"
    monkeypatch.setattr(check_scraper_docs, "SCHEMA", fake_schema)
    assert check_scraper_docs.main() == 2


def test_main_invalid_schema(monkeypatch, tmp_path):
    """Test main() fails when schema file is invalid YAML."""
    fake_schema = tmp_path / "invalid.json"
    fake_schema.write_text("invalid: yaml: [", encoding="utf-8")
    monkeypatch.setattr(check_scraper_docs, "SCHEMA", fake_schema)
    assert check_scraper_docs.main() == 2


def test_main_contradiction_failures(monkeypatch, tmp_path):
    """Test main() catches documentation forbidden claim failures and invalid YAML blocks."""
    fake_doc_root = tmp_path / "skills"
    fake_doc_root.mkdir()

    bad_doc = fake_doc_root / "bad.md"
    bad_doc.write_text(
        "No root `name forbidden claim\n"
        "```yaml\n"
        "invalid: yaml: [\n"
        "```\n"
        "```yaml\n"
        "name: Scraper\n"
        "sceneByURL: invalid\n"
        "```\n",
        encoding="utf-8",
    )

    monkeypatch.setattr(check_scraper_docs, "DOC_ROOT", fake_doc_root)
    assert check_scraper_docs.main() == 1
=======
    assert blocks[0] == "block1: true\n"
    assert blocks[1] == "block2: true\n"


def test_full_yaml_blocks_crlf_line_endings(tmp_path: Path):
    """Extract YAML blocks with CRLF (\\r\\n) line endings."""
    md_file = tmp_path / "test.md"
    content = (
        "```yaml\r\n"
        "name: crlf_test\r\n"
        "sceneByName:\r\n"
        "  - action: scrape\r\n"
        "```\r\n"
    )
    md_file.write_bytes(content.encode("utf-8"))
    blocks = check_scraper_docs.full_yaml_blocks(md_file)
    assert len(blocks) == 1
    assert "name: crlf_test" in blocks[0]


def test_full_yaml_blocks_no_yaml_blocks(tmp_path: Path):
    """Return empty list when no yaml blocks are present."""
    md_file = tmp_path / "test.md"
    content = (
        "# Heading\n\n"
        "```python\n"
        "print('hello')\n"
        "```\n\n"
        "```json\n"
        '{"key": "value"}\n'
        "```\n"
    )
    md_file.write_text(content, encoding="utf-8")
    blocks = check_scraper_docs.full_yaml_blocks(md_file)
    assert blocks == []


def test_full_yaml_blocks_empty_yaml_block(tmp_path: Path):
    """Extract empty YAML code block."""
    md_file = tmp_path / "test.md"
    content = "```yaml\n```\n"
    md_file.write_text(content, encoding="utf-8")
    blocks = check_scraper_docs.full_yaml_blocks(md_file)
    assert len(blocks) == 1
    assert blocks[0] == ""


def test_has_mapping():
    """Test mapping identification helper."""
    assert check_scraper_docs.has_mapping({"name": "test", "sceneByURL": []}) is True
    assert check_scraper_docs.has_mapping({"name": "test", "performerByName": []}) is True
    assert check_scraper_docs.has_mapping({"name": "test", "movieByFragment": []}) is True
    assert check_scraper_docs.has_mapping({"name": "test", "galleryByQueryFragment": []}) is True
    assert check_scraper_docs.has_mapping({"name": "test"}) is False
    assert check_scraper_docs.has_mapping(["not", "a", "dict"]) is False
    assert check_scraper_docs.has_mapping(None) is False


def test_check_scraper_docs_main_success():
    """Test check_scraper_docs.main() passes on real repository docs."""
    assert check_scraper_docs.main() == 0
>>>>>>> 98922ed (test: add unit tests for full_yaml_blocks extraction)
