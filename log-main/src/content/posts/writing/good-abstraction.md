---
title: "The cost of good abstraction"
description: "Abstraction isn't free. On knowing when to add a layer, and when to tear one out."
date: 2026-05-20
tags: ["architecture", "craft"]
---

Every abstraction is a trade: you hide detail to gain leverage, and you pay for it in indirection.

## The hidden bill

The bill comes due when someone needs to understand what's underneath — usually at 2am during an incident.

## A rule of thumb

Add the layer when the duplication hurts. Not before.
