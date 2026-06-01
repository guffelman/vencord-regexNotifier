import { SavedNotification } from "./types";

export const MAX_ENTRIES = 200;

export function addCapped(
    list: SavedNotification[],
    entry: SavedNotification,
    max = MAX_ENTRIES
): SavedNotification[] {
    return [entry, ...list].slice(0, max);
}

export function removeById(list: SavedNotification[], id: string): SavedNotification[] {
    return list.filter(e => e.id !== id);
}
