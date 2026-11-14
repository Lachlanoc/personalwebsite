import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAdjacentPosts,
  getAllPosts,
  getAllTags,
  getPostBySlug,
  getPostsByTagSlug,
  getTagBySlug,
  readingTime,
  tagSlug,
} from "./api.ts";

describe("posts", () => {
  const posts = getAllPosts();

  it("finds the posts in _posts", () => {
    assert.ok(posts.length >= 10);
  });

  it("orders posts newest first", () => {
    const dates = posts.map((post) => post.date);
    assert.deepEqual(dates, [...dates].sort().reverse());
  });

  it("gives every post the fields the pages rely on", () => {
    for (const post of posts) {
      assert.match(post.slug, /^[\w-]+$/, post.slug);
      assert.ok(post.title, `${post.slug} title`);
      assert.ok(post.excerpt, `${post.slug} excerpt`);
      assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/, `${post.slug} date`);
      assert.ok(post.coverImage.startsWith("/assets/"), `${post.slug} coverImage`);
      assert.ok(post.ogImage?.url, `${post.slug} ogImage`);
      assert.ok(post.tags.length > 0, `${post.slug} has at least one tag`);
      assert.ok(post.readingTime >= 1, `${post.slug} readingTime`);
    }
  });

  it("returns a post by slug", () => {
    assert.equal(getPostBySlug(posts[0].slug)?.title, posts[0].title);
  });

  it("returns null for a slug that does not exist", () => {
    assert.equal(getPostBySlug("no-such-post"), null);
  });

  it("refuses slugs that are not plain file names", () => {
    assert.equal(getPostBySlug("../package"), null);
    assert.equal(getPostBySlug("a/b"), null);
  });
});

describe("adjacent posts", () => {
  const posts = getAllPosts();

  it("has nothing newer than the newest post", () => {
    const { newer, older } = getAdjacentPosts(posts[0].slug);
    assert.equal(newer, null);
    assert.equal(older?.slug, posts[1].slug);
  });

  it("has nothing older than the oldest post", () => {
    const { newer, older } = getAdjacentPosts(posts.at(-1)!.slug);
    assert.equal(older, null);
    assert.equal(newer?.slug, posts.at(-2)!.slug);
  });

  it("returns nothing for an unknown slug", () => {
    assert.deepEqual(getAdjacentPosts("no-such-post"), { older: null, newer: null });
  });
});

describe("tags", () => {
  it("turns a tag into a URL-safe slug", () => {
    assert.equal(tagSlug("cyber security"), "cyber-security");
    assert.equal(tagSlug("Homelab"), "homelab");
  });

  it("counts posts per tag, most used first", () => {
    const tags = getAllTags();
    assert.ok(tags.length > 0);
    for (const { tag, slug, count } of tags) {
      assert.equal(getPostsByTagSlug(slug).length, count, tag);
    }
    const counts = tags.map((entry) => entry.count);
    assert.deepEqual(counts, [...counts].sort((a, b) => b - a));
  });

  it("gives every tag a distinct slug", () => {
    const slugs = getAllTags().map((entry) => entry.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  it("finds a tag by its slug", () => {
    const [first] = getAllTags();
    assert.equal(getTagBySlug(first.slug)?.tag, first.tag);
    assert.equal(getTagBySlug("no-such-tag"), null);
  });

  it("returns no posts for an unused tag", () => {
    assert.deepEqual(getPostsByTagSlug("no-such-tag"), []);
  });
});

describe("readingTime", () => {
  it("is never less than a minute", () => {
    assert.equal(readingTime(""), 1);
    assert.equal(readingTime("a few words"), 1);
  });

  it("rounds to whole minutes at 220 words a minute", () => {
    assert.equal(readingTime("word ".repeat(220)), 1);
    assert.equal(readingTime("word ".repeat(660)), 3);
  });
});
