export type TargetType = "all" | "guild" | "channel" | "user";

export interface FilterRule {
    id: string;
    enabled: boolean;
    label: string;
    targetType: TargetType;
    targetId: string;
    pattern: string;
    caseInsensitive: boolean;
}

export interface MatchContext {
    content: string;
    authorId: string;
    channelId: string;
    guildId: string | null;
}

export interface SavedNotification {
    id: string;
    ruleLabel: string;
    authorTag: string;
    content: string;
    channelId: string;
    guildId: string | null;
    messageId: string;
    timestamp: number;
}
