import test from "node:test";
import assert from "node:assert/strict";
import {
  createDomainIdentity,
  isValidConfidence,
  isValidDevLoopReadiness,
  isValidDomainStatus,
  normalizeSlug
} from "../lib/domain";

test("normalizes entity identity into stable slug and id", () => {
  const identity = createDomainIdentity("PUB Leads", "Product");
  assert.equal(identity.slug, "pub-leads");
  assert.equal(identity.id, "product:pub-leads");
});

test("accepts only the declared confidence enum values", () => {
  assert.equal(isValidConfidence("CONFIRMED"), true);
  assert.equal(isValidConfidence("BROKEN"), false);
});

test("accepts only the declared readiness enum values", () => {
  assert.equal(isValidDevLoopReadiness("READY_WITH_MINOR_FIXES"), true);
  assert.equal(isValidDevLoopReadiness("FAST"), false);
});

test("accepts only the declared domain status enum values", () => {
  assert.equal(isValidDomainStatus("IN_DEVELOPMENT"), true);
  assert.equal(isValidDomainStatus("BROKEN"), false);
});

test("normalizes slugs consistently", () => {
  assert.equal(normalizeSlug(" PUB Leads "), "pub-leads");
});

