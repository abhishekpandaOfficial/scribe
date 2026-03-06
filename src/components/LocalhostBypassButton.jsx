import { useMemo } from "react";
import { isLocalhostRuntime } from "../utils/env";
import { Btn } from "./ui";

export default function LocalhostBypassButton({
  onBypass,
  label = "Bypass sign-in (localhost)",
  style = {},
}) {
  const enabled = useMemo(() => isLocalhostRuntime(), []);

  if (!enabled) {
    return null;
  }

  return (
    <Btn
      variant="outline"
      size="sm"
      onClick={onBypass}
      style={{ justifyContent: "center", ...style }}
      title="Shown only on localhost"
    >
      {label}
    </Btn>
  );
}
