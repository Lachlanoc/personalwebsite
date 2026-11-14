import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resultHref, searchPosts, type SearchEntry } from "./search.ts";

const index: SearchEntry[] = [
  {
    slug: "vps-setup",
    title: "How I Setup a New VPS",
    excerpt: "Ensuring things are secure on a VPS running Debian.",
    date: "2026-02-14",
    tags: ["homelab", "cyber security"],
    sections: [
      { id: "ssh", text: "SSH" },
      { id: "firewall", text: "Firewall" },
    ],
  },
  {
    slug: "reverse-proxy",
    title: "Securely Access Your Homelab",
    excerpt: "Caddy, Authelia and Wireguard on a VPS.",
    date: "2026-02-16",
    tags: ["homelab", "cyber security"],
    sections: [
      { id: "wireguard", text: "Wireguard" },
      { id: "caddy", text: "Caddy" },
    ],
  },
  {
    slug: "anki",
    title: "672 Days of Anki Flashcards",
    excerpt: "What I've learnt doing flashcards every day.",
    date: "2026-01-01",
    tags: ["japanese"],
    sections: [{ id: "settings", text: "Settings" }],
  },
];

const slugs = (query: string) => searchPosts(index, query).map((result) => result.entry.slug);

describe("searchPosts", () => {
  it("matches nothing for an empty or blank query", () => {
    assert.deepEqual(slugs(""), []);
    assert.deepEqual(slugs("   "), []);
  });

  it("finds posts by a word in the title, ignoring case", () => {
    assert.deepEqual(slugs("anki"), ["anki"]);
    assert.deepEqual(slugs("ANKI"), ["anki"]);
  });

  it("finds posts by tag", () => {
    assert.deepEqual(slugs("japanese"), ["anki"]);
  });

  it("finds posts by part of a word", () => {
    assert.deepEqual(slugs("flash"), ["anki"]);
  });

  it("ranks a title match above an excerpt match", () => {
    // "vps" is in the first post's title but only in the second's excerpt.
    assert.deepEqual(slugs("vps"), ["vps-setup", "reverse-proxy"]);
  });

  it("puts the newer post first when scores tie", () => {
    assert.deepEqual(slugs("homelab cyber").slice(0, 1), ["reverse-proxy"]);
    assert.deepEqual(slugs("cyber"), ["reverse-proxy", "vps-setup"]);
  });

  it("requires every word of the query to match", () => {
    assert.deepEqual(slugs("vps firewall"), ["vps-setup"]);
    assert.deepEqual(slugs("anki firewall"), []);
  });

  it("returns nothing when no post matches", () => {
    assert.deepEqual(slugs("kubernetes"), []);
  });

  it("points at the section when the match is in a heading, not the title", () => {
    const [result] = searchPosts(index, "firewall");
    assert.equal(result.entry.slug, "vps-setup");
    assert.deepEqual(result.section, { id: "firewall", text: "Firewall" });
    assert.equal(resultHref(result), "/posts/vps-setup#firewall");
  });

  it("links to the top of the post when the title matches", () => {
    const [result] = searchPosts(index, "anki");
    assert.equal(result.section, undefined);
    assert.equal(resultHref(result), "/posts/anki");
  });
});
