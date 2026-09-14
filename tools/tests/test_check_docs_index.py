"""Integration and unit tests for tools/check_docs_index.py."""

from pathlib import Path

import pytest
import yaml

from tools import check_docs_index


def test_check_docs_index_main_success():
    """Test main() returns 0 on the actual repository documentation index."""
    assert check_docs_index.main() == 0


def test_frontmatter_valid(tmp_path):
    """Test frontmatter extraction with valid YAML frontmatter."""
    md_file = tmp_path / "doc.md"
    md_file.write_text("---\ndoc_id: DOC-TEST-01\ntitle: Test\n---\n\nContent", encoding="utf-8")
    data = check_docs_index.frontmatter(md_file)
    assert data == {"doc_id": "DOC-TEST-01", "title": "Test"}


def test_frontmatter_no_frontmatter(tmp_path):
    """Test frontmatter extraction when no frontmatter is present."""
    md_file = tmp_path / "doc.md"
    md_file.write_text("# Title\n\nContent", encoding="utf-8")
    assert check_docs_index.frontmatter(md_file) == {}


def test_frontmatter_unclosed(tmp_path):
    """Test frontmatter extraction when frontmatter block is unclosed."""
    md_file = tmp_path / "doc.md"
    md_file.write_text("---\ndoc_id: DOC-TEST-01\n", encoding="utf-8")
    assert check_docs_index.frontmatter(md_file) == {}


def test_frontmatter_invalid_yaml(tmp_path):
    """Test frontmatter extraction with malformed YAML content."""
    md_file = tmp_path / "doc.md"
    md_file.write_text("---\n: : : invalid yaml\n---\n", encoding="utf-8")
    assert check_docs_index.frontmatter(md_file) == {}


def test_frontmatter_non_mapping_yaml(tmp_path):
    """Test frontmatter extraction when YAML is not a dictionary."""
    md_file = tmp_path / "doc.md"
    md_file.write_text("---\n- item 1\n- item 2\n---\n", encoding="utf-8")
    assert check_docs_index.frontmatter(md_file) == {}


def test_expected_markdown_paths():
    """Test expected_markdown_paths returns expected files."""
    paths = check_docs_index.expected_markdown_paths()
    assert "README.md" in paths
    assert "AGENTS.md" in paths
    assert any(p.startswith("docs/") for p in paths)


def test_main_missing_index(monkeypatch, tmp_path):
    """Test main() fails when docs/index.yml is missing."""
    fake_index = tmp_path / "non_existent_index.yml"
    monkeypatch.setattr(check_docs_index, "INDEX_PATH", fake_index)
    assert check_docs_index.main() == 1


def test_main_invalid_version(monkeypatch, tmp_path, capsys):
    """Test main() fails when docs/index.yml version is not 1."""
    fake_index = tmp_path / "index.yml"
    fake_index.write_text("version: 2\ndocuments: []\n", encoding="utf-8")
    monkeypatch.setattr(check_docs_index, "INDEX_PATH", fake_index)
    assert check_docs_index.main() == 1
    captured = capsys.readouterr()
    assert "docs/index.yml must declare version: 1" in captured.out


def test_main_invalid_documents_type(monkeypatch, tmp_path, capsys):
    """Test main() fails when documents is not a list."""
    fake_index = tmp_path / "index.yml"
    fake_index.write_text("version: 1\ndocuments: not-a-list\n", encoding="utf-8")
    monkeypatch.setattr(check_docs_index, "INDEX_PATH", fake_index)
    assert check_docs_index.main() == 1
    captured = capsys.readouterr()
    assert "docs/index.yml must contain a documents list" in captured.out


def test_main_missing_required_prettier_files(monkeypatch, tmp_path):
    """Test main() fails when root prettier configuration files are missing."""
    fake_root = tmp_path / "root"
    fake_root.mkdir()
    fake_index = fake_root / "docs" / "index.yml"
    fake_index.parent.mkdir(parents=True)
    fake_index.write_text("version: 1\ndocuments: []\n", encoding="utf-8")

    monkeypatch.setattr(check_docs_index, "ROOT", fake_root)
    monkeypatch.setattr(check_docs_index, "INDEX_PATH", fake_index)

    assert check_docs_index.main() == 1


def test_main_validation_errors(monkeypatch, tmp_path, capsys):
    """Test main() with custom index data containing document validation errors."""
    fake_root = tmp_path / "root"
    fake_root.mkdir()
    (fake_root / ".prettierrc.yml").write_text("", encoding="utf-8")
    (fake_root / ".prettierignore").write_text("", encoding="utf-8")

    docs_dir = fake_root / "docs"
    docs_dir.mkdir()
    fake_index = docs_dir / "index.yml"

    # Create one valid doc file and one with doc_id mismatch
    doc1 = docs_dir / "doc1.md"
    doc1.write_text("---\ndoc_id: DOC-01\n---\n", encoding="utf-8")

    doc2 = docs_dir / "doc2.md"
    doc2.write_text("---\ndoc_id: DOC-WRONG\n---\n", encoding="utf-8")

    index_data = {
        "version": 1,
        "documents": [
            "not a dict",  # document #1 error
            {
                # missing fields (doc_id, title, etc)
                "doc_id": "DOC-01"
            },
            {
                "doc_id": "INVALID_ID_FORMAT",
                "title": "T",
                "path": "docs/doc1.md",
                "layer": "repository",
                "status": "active",
                "intents": ["test"],
            },
            {
                "doc_id": "DOC-01",
                "title": "T1",
                "path": "docs/doc1.md",
                "layer": "invalid_layer",
                "status": "invalid_status",
                "intents": "not-a-list",
            },
            {
                "doc_id": "DOC-02",
                "title": "T2",
                "path": "docs/doc2.md",
                "layer": "repository",
                "status": "active",
                "intents": ["test"],
                "read_after": ["DOC-UNKNOWN"],
            },
        ],
    }
    fake_index.write_text(yaml.dump(index_data), encoding="utf-8")

    monkeypatch.setattr(check_docs_index, "ROOT", fake_root)
    monkeypatch.setattr(check_docs_index, "INDEX_PATH", fake_index)
    monkeypatch.setattr(check_docs_index, "expected_markdown_paths", lambda: {"docs/doc1.md", "docs/doc2.md", "docs/missing.md"})

    result = check_docs_index.main()
    assert result == 1

    captured = capsys.readouterr()
    assert "document #1 must be a mapping" in captured.out
    assert "document #2 missing fields:" in captured.out
    assert "has invalid doc_id: 'INVALID_ID_FORMAT'" in captured.out
    assert "DOC-01: invalid status 'invalid_status'" in captured.out
    assert "DOC-01: invalid layer 'invalid_layer'" in captured.out
    assert "DOC-01: intents must be a non-empty string list" in captured.out
    assert "DOC-02: front matter doc_id 'DOC-WRONG' does not match index" in captured.out
    assert "DOC-02: read_after references unknown or later ID 'DOC-UNKNOWN'" in captured.out
    assert "Markdown document is not indexed: docs/missing.md" in captured.out
