---
title: "ELias i love you heehehehehehee"
description: "A short note on React StrictMode, cleanup functions, and the double-invoke that trips everyone up."
date: 2026-06-05
tags: ["react", "frontend"]
---

If you've just upgraded and your effects suddenly run twice in development, you've met StrictMode.

## It's intentional

React intentionally double-invokes effects in development to surface missing cleanup. It's not a bug — it's a smoke test for your teardown logic.

The fix is almost always a proper cleanup function.
