# Incident Review: Schema Drift in Scraper Guidance

**Date:** 2026-09-03  
**Scope:** `stash-scraper-builder` documentation and examples  
**Related:** Issues #21, #22, #23, #24, #25, #26, #28

## What happened

A false heuristic — that the filename supplies the scraper name and therefore the root `name` key should be omitted — was copied into several reference documents. A separate incorrect causal claim said that adding `sceneByFragment` prevents a nil-pointer panic. A third documentation error incorrectly described the `{title}` placeholder as unsupported.

The rules were repeated in the skill entry point, checklists, examples, and specialized references. Repetition made the claims appear authoritative even though they contradicted the official schema or upstream issue evidence.

## Why review missed it

- The local schema stub was treated as a convenient reference instead of an explicitly incomplete compatibility aid.
- Documentation examples were not extracted and validated as test fixtures.
- Heuristics and verified schema rules were not labeled differently.
- Review focused on individual files instead of searching for repeated claims across the reference tree.
- The evaluation pack checked generated output shapes but did not lint every embedded example.

## Detection

The Phase 1 audit compared the local documentation against the official schema. A control test showed that the script guidance without `name:` fails with `'name' is a required property`. Extracting the corrected examples and validating them with the official draft-07 schema caught additional `queryURLReplace` and entry-point errors, including omission of the valid `phash` key.

## Corrective actions

- Require root `name:` in every complete YAML example.
- Mark schema-backed rules with an official schema path or upstream documentation source.
- Mark experience-based selector and quality advice as `Heuristic` and require live verification.
- Add a documentation contradiction checker that validates embedded full-document YAML and rejects known stale claims.
- Keep the official vendored schema/validator authoritative; label the local stub as incomplete or replace it with an automated upstream sync.
- Add an incident-review document and contributor checklist.

## Prevention checklist

Before merging scraper guidance:

- Compare every normative schema claim with the official schema.
- Search the full reference tree for the rule being changed and update duplicates together.
- Extract and validate every complete YAML example.
- Separate `Source:` facts from `Heuristic:` recommendations.
- Run the documentation contradiction checker and the official scraper validator.
- For runtime claims, cite an upstream issue, reproduction, or live test; do not infer causality from one failure.

## Lessons

A rule repeated across files is not independently verified. Documentation needs the same regression discipline as code: one canonical source, executable examples, authoritative fixtures, and checks that fail when contradictions return.
