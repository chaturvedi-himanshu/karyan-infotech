import type { HomePayload, HomePresenceBand } from "./types";

/**
 * If the stored document has no usable `presence.cityIds`, fold in legacy
 * `presenceResidential` / `presenceCommercial` when present.
 * Call after merging defaults with raw CMS data (shallow or deep).
 */
export function migrateLegacyHomePresence(
  data: HomePayload,
  raw: Record<string, unknown>
): HomePayload {
  const rawPresence = raw.presence as HomePresenceBand | undefined;
  const rawPresenceHasIds =
    rawPresence &&
    Array.isArray(rawPresence.cityIds) &&
    rawPresence.cityIds.some((id) => typeof id === "string" && id.length > 0);

  if (rawPresenceHasIds) return data;

  const pr = raw.presenceResidential as HomePresenceBand | undefined;
  const pc = raw.presenceCommercial as HomePresenceBand | undefined;
  const legacyIds = [...(pr?.cityIds ?? []), ...(pc?.cityIds ?? [])].filter(
    (id): id is string => typeof id === "string" && id.length > 0
  );

  if (!legacyIds.length) return data;

  const heading =
    (typeof pr?.heading === "string" && pr.heading.trim()) ||
    (typeof pc?.heading === "string" && pc.heading.trim()) ||
    data.presence.heading;

  return {
    ...data,
    presence: {
      eyebrow: data.presence.eyebrow,
      heading,
      subheading: data.presence.subheading,
      cityIds: Array.from(new Set(legacyIds)),
    },
  };
}
