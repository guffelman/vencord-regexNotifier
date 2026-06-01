import { findComponentByCodeLazy } from "@webpack";
import { Popout, useRef } from "@webpack/common";

import { InboxPopout } from "./InboxPopout";
import { markRead, useInbox } from "./store";

const HeaderBarIcon = findComponentByCodeLazy(".HEADER_BAR_BADGE_BOTTOM,", 'position:"bottom"');

function BellIcon() {
    return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 1 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2Z" />
        </svg>
    );
}

export function InboxButton() {
    const buttonRef = useRef(null);
    const { unread } = useInbox();

    return (
        <Popout
            position="bottom"
            align="right"
            animation={Popout.Animation.NONE}
            targetElementRef={buttonRef}
            renderPopout={() => <InboxPopout />}
        >
            {(props, { isShown }) => (
                <div style={{ position: "relative", display: "flex" }}>
                    <HeaderBarIcon
                        {...props}
                        ref={buttonRef}
                        tooltip={isShown ? null : "Regex Inbox"}
                        icon={BellIcon}
                        selected={isShown}
                        onClick={() => {
                            props.onClick?.();
                            markRead();
                        }}
                    />
                    {unread > 0 && (
                        <span
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                minWidth: 16,
                                height: 16,
                                padding: "0 4px",
                                borderRadius: 8,
                                background: "var(--status-danger)",
                                color: "#fff",
                                fontSize: 11,
                                lineHeight: "16px",
                                textAlign: "center",
                                pointerEvents: "none",
                            }}
                        >
                            {unread > 99 ? "99+" : unread}
                        </span>
                    )}
                </div>
            )}
        </Popout>
    );
}
