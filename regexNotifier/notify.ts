import { showNotification } from "@api/Notifications";
import { findByPropsLazy } from "@webpack";
import { NavigationRouter } from "@webpack/common";

import { settings } from "./settings";
import { FilterRule } from "./types";

const SoundUtils = findByPropsLazy("playSound");

interface NotifyArgs {
    rule: FilterRule;
    content: string;
    authorTag: string;
    channelId: string;
    guildId: string | null;
    messageId: string;
}

function jumpTo(guildId: string | null, channelId: string, messageId: string) {
    NavigationRouter.transitionTo(`/channels/${guildId ?? "@me"}/${channelId}/${messageId}`);
}

export function notifyMatch({ rule, content, authorTag, channelId, guildId, messageId }: NotifyArgs) {
    const title = rule.label || `RegexNotifier: ${rule.targetType} match`;

    if (settings.store.logToConsole) {
        console.log(`[RegexNotifier] rule "${rule.label || rule.pattern}" matched message from ${authorTag}: ${content}`);
    }

    showNotification({
        title,
        body: `${authorTag}: ${content}`,
        onClick: () => jumpTo(guildId, channelId, messageId),
    });

    if (settings.store.playSound) {
        try {
            SoundUtils.playSound("message1", 0.4);
        } catch (e) {
            console.error("[RegexNotifier] failed to play sound", e);
        }
    }
}
