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
