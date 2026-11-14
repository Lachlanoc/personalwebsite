import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatDate } from "./dates.ts";

describe("formatDate", () => {
  it("writes day, month in full, then year", () => {
    assert.equal(formatDate("2026-09-11"), "11 September 2026");
  });

  it("has no leading zero on the day", () => {
    assert.equal(formatDate("2025-07-01"), "1 July 2025");
    assert.equal(formatDate("2026-04-02"), "2 April 2026");
  });

  it("does not shift the date at the edges of a year", () => {
    assert.equal(formatDate("2026-01-01"), "1 January 2026");
    assert.equal(formatDate("2025-12-31"), "31 December 2025");
  });
});
