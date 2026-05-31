import { FilterRule, MatchContext } from "./types";

function targetMatches(rule: FilterRule, ctx: MatchContext): boolean {
    switch (rule.targetType) {
        case "all":
            return ctx.guildId !== null;
        case "user":
            return ctx.authorId === rule.targetId;
        case "channel":
            return ctx.channelId === rule.targetId;
        case "guild":
            return ctx.guildId !== null && ctx.guildId === rule.targetId;
        default:
            return false;
    }
}

function patternMatches(rule: FilterRule, content: string): boolean {
    if (!rule.pattern) return false;
    try {
        return new RegExp(rule.pattern, rule.caseInsensitive ? "i" : "").test(content);
    } catch {
        return false;
    }
}

export function findMatches(rules: FilterRule[], ctx: MatchContext): FilterRule[] {
    return rules.filter(
        rule => rule.enabled && targetMatches(rule, ctx) && patternMatches(rule, ctx.content)
    );
}

export function isValidPattern(pattern: string): boolean {
    if (!pattern) return false;
    try {
        RegExp(pattern);
        return true;
    } catch {
        return false;
    }
}
