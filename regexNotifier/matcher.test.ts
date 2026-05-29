import { describe, expect, it } from "vitest";

import { findMatches, isValidPattern } from "./matcher";
import { FilterRule, MatchContext } from "./types";

function rule(partial: Partial<FilterRule>): FilterRule {
    return {
        id: "r1",
        enabled: true,
        label: "",
        targetType: "user",
        targetId: "123",
        pattern: "hello",
        caseInsensitive: false,
        ...partial,
    };
}

const ctx: MatchContext = {
    content: "well hello there",
    authorId: "123",
    channelId: "456",
    guildId: "789",
};

describe("findMatches", () => {
    it("matches a user rule when author + pattern match", () => {
        expect(findMatches([rule({})], ctx)).toHaveLength(1);
    });

    it("does not match a user rule for a different author", () => {
        expect(findMatches([rule({ targetId: "999" })], ctx)).toHaveLength(0);
    });

    it("matches a channel rule by channelId", () => {
        const r = rule({ targetType: "channel", targetId: "456" });
        expect(findMatches([r], ctx)).toHaveLength(1);
    });

    it("matches a guild rule by guildId", () => {
        const r = rule({ targetType: "guild", targetId: "789" });
        expect(findMatches([r], ctx)).toHaveLength(1);
    });

    it("does not match a guild rule in a DM (null guildId)", () => {
        const r = rule({ targetType: "guild", targetId: "789" });
        expect(findMatches([r], { ...ctx, guildId: null })).toHaveLength(0);
    });

    it("respects the enabled flag", () => {
        expect(findMatches([rule({ enabled: false })], ctx)).toHaveLength(0);
    });

    it("is case-sensitive by default", () => {
        expect(findMatches([rule({ pattern: "HELLO" })], ctx)).toHaveLength(0);
    });

    it("matches case-insensitively when flagged", () => {
        const r = rule({ pattern: "HELLO", caseInsensitive: true });
        expect(findMatches([r], ctx)).toHaveLength(1);
    });

    it("supports regex syntax, not just substrings", () => {
        const r = rule({ pattern: "h(i|ello)\\b" });
        expect(findMatches([r], ctx)).toHaveLength(1);
    });

    it("skips invalid regex without throwing", () => {
        const r = rule({ pattern: "([unclosed" });
        expect(() => findMatches([r], ctx)).not.toThrow();
        expect(findMatches([r], ctx)).toHaveLength(0);
    });

    it("skips empty patterns", () => {
        expect(findMatches([rule({ pattern: "" })], ctx)).toHaveLength(0);
    });

    it("returns every matching rule", () => {
        const a = rule({ id: "a", pattern: "hello" });
        const b = rule({ id: "b", pattern: "there" });
        expect(findMatches([a, b], ctx).map(r => r.id)).toEqual(["a", "b"]);
    });

    it("returns nothing for an empty rule list", () => {
        expect(findMatches([], ctx)).toEqual([]);
    });
});

describe("isValidPattern", () => {
    it("accepts a valid regex", () => {
        expect(isValidPattern("a.*b")).toBe(true);
    });

    it("rejects an invalid regex", () => {
        expect(isValidPattern("([")).toBe(false);
    });

    it("rejects an empty pattern", () => {
        expect(isValidPattern("")).toBe(false);
    });
});
