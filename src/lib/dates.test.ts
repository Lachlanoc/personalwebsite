import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatDate, yearOf } from "./dates.ts";

describe("formatDate", () => {
  it("writes the day first, with the month in full", () => {
    assert.equal(formatDate("2026-09-11"), "11 September 2026");
    assert.equal(formatDate("2025-07-01"), "1 July 2025");
  });

  it("has a day-and-month form for lists grouped by year", () => {
    assert.equal(formatDate("2026-04-02", "dayMonth"), "2 Apr");
    assert.equal(formatDate("2025-09-03", "dayMonth"), "3 Sep");
    assert.equal(formatDate("2025-07-14", "dayMonth"), "14 Jul");
  });

  it("does not shift the date at the edges of a year", () => {
    assert.equal(formatDate("2026-01-01"), "1 January 2026");
    assert.equal(formatDate("2025-12-31"), "31 December 2025");
  });
});

describe("yearOf", () => {
  it("returns the year of an ISO date", () => {
    assert.equal(yearOf("2026-01-01"), "2026");
  });
});
