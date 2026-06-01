import { describe, expect, it } from "vitest";

import { addCapped, MAX_ENTRIES, removeById } from "./inboxCore";
import { SavedNotification } from "./types";

function entry(id: string): SavedNotification {
    return {
        id,
        ruleLabel: "",
        authorTag: "a",
        content: "c",
        channelId: "1",
        guildId: "2",
        messageId: "3",
        timestamp: 0,
    };
}

describe("addCapped", () => {
    it("prepends the new entry (newest first)", () => {
        const result = addCapped([entry("a")], entry("b"));
        expect(result.map(e => e.id)).toEqual(["b", "a"]);
    });

    it("does not mutate the input array", () => {
        const list = [entry("a")];
        addCapped(list, entry("b"));
        expect(list.map(e => e.id)).toEqual(["a"]);
    });

    it("drops the oldest beyond the cap", () => {
        let list: SavedNotification[] = [];
        for (let i = 0; i < MAX_ENTRIES + 5; i++) list = addCapped(list, entry(`e${i}`));
        expect(list).toHaveLength(MAX_ENTRIES);
        expect(list[0].id).toBe(`e${MAX_ENTRIES + 4}`);
        expect(list.at(-1)!.id).toBe("e5");
    });

    it("respects an explicit cap argument", () => {
        const result = addCapped([entry("a"), entry("b")], entry("c"), 2);
        expect(result.map(e => e.id)).toEqual(["c", "a"]);
    });
});

describe("removeById", () => {
    it("removes the matching entry", () => {
        expect(removeById([entry("a"), entry("b")], "a").map(e => e.id)).toEqual(["b"]);
    });

    it("returns the list unchanged when id is absent", () => {
        expect(removeById([entry("a")], "x").map(e => e.id)).toEqual(["a"]);
    });
});
