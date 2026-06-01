import { Button, ChannelStore, GuildStore, NavigationRouter, Text } from "@webpack/common";

import { clearAll, removeEntry, useInbox } from "./store";
import { SavedNotification } from "./types";

function locationLabel(n: SavedNotification): string {
    const channel = ChannelStore.getChannel(n.channelId);
    const guild = n.guildId ? GuildStore.getGuild(n.guildId) : null;
    const channelName = channel?.name ? `#${channel.name}` : "channel";
    return guild?.name ? `${guild.name} · ${channelName}` : channelName;
}

function jump(n: SavedNotification) {
    NavigationRouter.transitionTo(`/channels/${n.guildId ?? "@me"}/${n.channelId}/${n.messageId}`);
}

export function InboxPopout() {
    const { entries } = useInbox();

    return (
        <div
            style={{
                width: 380,
                maxHeight: 500,
                overflowY: "auto",
                background: "var(--background-base-lower, #2b2d31)",
                boxShadow: "var(--elevation-high)",
                borderRadius: 8,
                padding: 12,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <Text variant="heading-md/semibold" style={{ flex: 1 }}>Regex Inbox</Text>
                {entries.length > 0 && (
                    <Button size={Button.Sizes.SMALL} color={Button.Colors.PRIMARY} onClick={() => clearAll()}>
                        Clear all
                    </Button>
                )}
            </div>

            {entries.length === 0 && (
                <Text variant="text-sm/normal" style={{ color: "var(--text-muted)", padding: "16px 4px" }}>
                    No matches yet.
                </Text>
            )}

            {entries.map(n => (
                <div
                    key={n.id}
                    style={{
                        display: "flex",
                        gap: 8,
                        padding: 8,
                        marginBottom: 6,
                        background: "var(--background-mod-subtle, rgba(255, 255, 255, 0.06))",
                        borderRadius: 6,
                    }}
                >
                    <div style={{ flex: 1, cursor: "pointer", minWidth: 0 }} onClick={() => jump(n)}>
                        <Text variant="text-xs/semibold" style={{ color: "var(--text-muted)" }}>
                            {n.ruleLabel ? `${n.ruleLabel} — ` : ""}{locationLabel(n)}
                        </Text>
                        <Text variant="text-sm/normal">
                            <b>{n.authorTag}:</b> {n.content}
                        </Text>
                    </div>
                    <Button
                        size={Button.Sizes.MIN}
                        color={Button.Colors.TRANSPARENT}
                        onClick={() => removeEntry(n.id)}
                    >
                        ✕
                    </Button>
                </div>
            ))}
        </div>
    );
}
