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
        "```\n"
    )
    md_file.write_text(content, encoding="utf-8")
    blocks = check_scraper_docs.full_yaml_blocks(md_file)
    assert len(blocks) == 2
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
