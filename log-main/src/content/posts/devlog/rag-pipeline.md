---
title: "Rebuilding my RAG pipeline with a local LLM"
description: "testing 12345"
date: 2026-06-18
tags: ["infra", "llm", "python"]
---

I'd been paying for a hosted embedding API longer than I should have. This post walks through moving the whole pipeline local.

## Why bother

The hosted API was fine until traffic spiked. Latency became unpredictable, and every request was a network round-trip I didn't control.

## The caching layer

The biggest win wasn't the model swap — it was caching embeddings for repeated queries. A simple content-hash key cut average response time by about 40%.

> The model change got the headlines. The cache did the work.

More to come on the eval setup.
