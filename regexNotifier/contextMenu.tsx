import { Menu } from "@webpack/common";
import { Toasts } from "@webpack/common";
import type { NavContextMenuPatchCallback } from "@api/ContextMenu";

import { settings } from "./settings";
import { FilterRule, TargetType } from "./types";

function addRuleFor(targetType: TargetType, targetId: string, label: string) {
    const rule: FilterRule = {
        id: crypto.randomUUID(),
        enabled: false,
        label,
        targetType,
        targetId,
        pattern: "",
        caseInsensitive: true,
    };
    if (!settings.store.rules) settings.store.rules = [];
    settings.store.rules.push(rule);
    Toasts.show({
        message: "Filter added — set your pattern in RegexNotifier settings.",
        id: Toasts.genId(),
        type: Toasts.Type.SUCCESS,
    });
}

function item(targetType: TargetType, targetId: string, label: string) {
    return (
        <Menu.MenuItem
            id="regexnotifier-add"
            label="Create regex filter"
            action={() => addRuleFor(targetType, targetId, label)}
        />
    );
}

export const userContextPatch: NavContextMenuPatchCallback = (children, props) => {
    const user = props?.user;
    if (!user) return;
    children.push(item("user", user.id, user.username ?? ""));
};

export const channelContextPatch: NavContextMenuPatchCallback = (children, props) => {
    const channel = props?.channel;
    if (!channel) return;
    children.push(item("channel", channel.id, channel.name ?? ""));
};

export const guildContextPatch: NavContextMenuPatchCallback = (children, props) => {
    const guild = props?.guild;
    if (!guild) return;
    children.push(item("guild", guild.id, guild.name ?? ""));
};
