import * as DataStore from "@api/DataStore";
import { useEffect, useState } from "@webpack/common";

import { addCapped, removeById } from "./inboxCore";
import { SavedNotification } from "./types";

const KEY = "RegexNotifier_inbox";

let entries: SavedNotification[] = [];
let unread = 0;
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach(l => l());
}

function persist() {
    DataStore.set(KEY, { entries, unread }).catch(e =>
        console.error("[RegexNotifier] failed to persist inbox", e)
    );
}

export async function load() {
    try {
        const saved = await DataStore.get<{ entries: SavedNotification[]; unread: number; }>(KEY);
        if (saved) {
            entries = saved.entries ?? [];
            unread = saved.unread ?? 0;
            emit();
        }
    } catch (e) {
        console.error("[RegexNotifier] failed to load inbox", e);
    }
}

export function addEntry(entry: SavedNotification) {
    entries = addCapped(entries, entry);
    unread++;
    emit();
    persist();
}

export function removeEntry(id: string) {
    entries = removeById(entries, id);
    emit();
    persist();
}

export function clearAll() {
    entries = [];
    unread = 0;
    emit();
    persist();
}

export function markRead() {
    if (unread === 0) return;
    unread = 0;
    emit();
    persist();
}

export function useInbox() {
    const [, setTick] = useState(0);
    useEffect(() => {
        const cb = () => setTick(t => t + 1);
        listeners.add(cb);
        return () => void listeners.delete(cb);
    }, []);
    return { entries, unread };
}
