import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { FiltersManager } from "./FiltersManager";
import { FilterRule } from "./types";

export const settings = definePluginSettings({
    rules: {
        type: OptionType.CUSTOM,
        default: [] as FilterRule[],
    },
    ignoreOwnMessages: {
        type: OptionType.BOOLEAN,
        description: "Don't notify for messages you send yourself",
        default: true,
    },
    respectMutes: {
        type: OptionType.BOOLEAN,
        description: "Skip muted servers/channels (off = notify even when muted)",
        default: false,
    },
    playSound: {
        type: OptionType.BOOLEAN,
        description: "Play a sound when a filter matches",
        default: true,
    },
    logToConsole: {
        type: OptionType.BOOLEAN,
        description: "Log matches to the dev console",
        default: false,
    },
    filtersUI: {
        type: OptionType.COMPONENT,
        description: "Manage regex filters",
        component: FiltersManager,
    },
});

export function getRules(): FilterRule[] {
    return settings.store.rules ?? [];
}
