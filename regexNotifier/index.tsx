import { findByPropsLazy } from "@webpack";
import { ChannelStore, FluxDispatcher, UserStore } from "@webpack/common";
import definePlugin from "@utils/types";
import ErrorBoundary from "@components/ErrorBoundary";
import type { PropsWithChildren } from "react";

import { findMatches } from "./matcher";
import { notifyMatch } from "./notify";
import { getRules, settings } from "./settings";
import { MatchContext } from "./types";
import { channelContextPatch, guildContextPatch, userContextPatch } from "./contextMenu";
import { InboxButton } from "./InboxButton";
import * as inbox from "./store";

const MuteStore = findByPropsLazy("isChannelMuted", "isGuildOrCategoryOrChannelMuted");

interface MessageCreatePayload {
    type: "MESSAGE_CREATE";
    channelId: string;
    message: {
        id: string;
        content: string;
        author?: { id: string; username: string; global_name?: string; };
        guild_id?: string;
    };
    optimistic?: boolean;
}

function isMuted(guildId: string | null, channelId: string): boolean {
    try {
        if (guildId && MuteStore.isGuildOrCategoryOrChannelMuted?.(guildId, channelId)) return true;
        if (MuteStore.isChannelMuted?.(guildId, channelId)) return true;
    } catch {}
    return false;
}

function onMessageCreate(payload: MessageCreatePayload) {
    const { message, channelId } = payload;
    if (!message?.author || message.content == null) return;

    if (settings.store.ignoreOwnMessages && message.author.id === UserStore.getCurrentUser()?.id) return;

    const channel = ChannelStore.getChannel(channelId);
    const guildId = message.guild_id ?? channel?.guild_id ?? null;

    if (settings.store.respectMutes && isMuted(guildId, channelId)) return;

    const ctx: MatchContext = {
        content: message.content,
        authorId: message.author.id,
        channelId,
        guildId,
    };

    const matches = findMatches(getRules(), ctx);
    if (matches.length === 0) return;

    const authorTag = message.author.global_name || message.author.username || message.author.id;

    for (const rule of matches) {
        notifyMatch({
            rule,
            content: message.content,
            authorTag,
            channelId,
            guildId,
            messageId: message.id,
        });
    }
}

export default definePlugin({
    name: "RegexNotifier",
    description: "Notifies you when a message matches a regex filter for a server, channel, or user.",
    authors: [{ name: "Garrett", id: 0n }],
    settings,
    contextMenus: {
        "user-context": userContextPatch,
        "channel-context": channelContextPatch,
        "guild-context": guildContextPatch,
    },

    patches: [
        {
            find: '?"BACK_FORWARD_NAVIGATION":',
            replacement: {
                match: /(trailing:.{0,50}?)\i\.Fragment,(?=\{children:\[)/,
                replace: "$1$self.TrailingWrapper,"
            }
        }
    ],

    TrailingWrapper({ children }: PropsWithChildren) {
        return (
            <>
                {children}
                <ErrorBoundary key="regex-inbox" noop>
                    <InboxButton />
                </ErrorBoundary>
            </>
        );
    },

    start() {
        inbox.load();
        FluxDispatcher.subscribe("MESSAGE_CREATE", onMessageCreate);
    },

    stop() {
        FluxDispatcher.unsubscribe("MESSAGE_CREATE", onMessageCreate);
    },
});
