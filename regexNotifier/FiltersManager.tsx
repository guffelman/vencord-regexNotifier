import { Button, Forms, Select, Switch, TextInput, useState } from "@webpack/common";

import { isValidPattern } from "./matcher";
import { settings } from "./settings";
import { FilterRule, TargetType } from "./types";

const TARGET_OPTIONS: { label: string; value: TargetType; }[] = [
    { label: "All Servers", value: "all" },
    { label: "Server", value: "guild" },
    { label: "Channel", value: "channel" },
    { label: "User", value: "user" },
];

function newRule(): FilterRule {
    return {
        id: crypto.randomUUID(),
        enabled: true,
        label: "",
        targetType: "user",
        targetId: "",
        pattern: "",
        caseInsensitive: true,
    };
}

function CommitInput({ initialValue, placeholder, onCommit, validate, disabled }: {
    initialValue: string;
    placeholder: string;
    onCommit(value: string): void;
    validate?(value: string): string | undefined;
    disabled?: boolean;
}) {
    const [value, setValue] = useState(initialValue);
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            spellCheck={false}
            disabled={disabled}
            error={validate?.(value)}
            onChange={setValue}
            onBlur={() => value !== initialValue && onCommit(value)}
        />
    );
}

export function FiltersManager() {
    const { rules } = settings.use(["rules"]) as { rules: FilterRule[]; };

    return (
        <Forms.FormSection>
            <Forms.FormTitle>Regex Filters</Forms.FormTitle>
            <Forms.FormText>
                Each rule notifies you when a message in the chosen server/channel, or from the
                chosen user, matches the regex. Use Developer Mode (User Settings → Advanced) to
                copy IDs via right-click.
            </Forms.FormText>

            {rules.map((rule, index) => (
                <div
                    key={rule.id}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        padding: 12,
                        marginTop: 8,
                        border: "1px solid var(--background-modifier-accent)",
                        borderRadius: 8,
                    }}
                >
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Switch
                            value={rule.enabled}
                            onChange={v => (rules[index].enabled = v)}
                            hideBorder
                            style={{ marginBottom: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                            <CommitInput
                                placeholder="Label (optional)"
                                initialValue={rule.label}
                                onCommit={v => (rules[index].label = v)}
                            />
                        </div>
                        <Button
                            color={Button.Colors.RED}
                            size={Button.Sizes.SMALL}
                            onClick={() => rules.splice(index, 1)}
                        >
                            Delete
                        </Button>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ minWidth: 120 }}>
                            <Select
                                options={TARGET_OPTIONS}
                                isSelected={v => v === rule.targetType}
                                select={v => (rules[index].targetType = v as TargetType)}
                                serialize={v => v}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <CommitInput
                                placeholder={rule.targetType === "all" ? "Applies to every server" : "Target ID (server/channel/user snowflake)"}
                                initialValue={rule.targetId}
                                onCommit={v => (rules[index].targetId = v.trim())}
                                disabled={rule.targetType === "all"}
                            />
                        </div>
                    </div>

                    <CommitInput
                        placeholder="Regex pattern"
                        initialValue={rule.pattern}
                        onCommit={v => (rules[index].pattern = v)}
                        validate={v => (v.length > 0 && !isValidPattern(v) ? "Invalid regex" : undefined)}
                    />

                    <Switch
                        value={rule.caseInsensitive}
                        onChange={v => (rules[index].caseInsensitive = v)}
                        hideBorder
                        style={{ marginBottom: 0 }}
                    >
                        Case insensitive
                    </Switch>
                </div>
            ))}

            <Button style={{ marginTop: 12 }} onClick={() => rules.push(newRule())}>
                Add filter
            </Button>
        </Forms.FormSection>
    );
}
