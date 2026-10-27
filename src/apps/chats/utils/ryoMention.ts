export function parseRyoMention(
  input: string,
  nudgeText: string
): { isMention: boolean; messageContent: string } {
  if (input.startsWith("@jay ")) {
    return { isMention: true, messageContent: input.substring(4).trim() };
  }

  if (input === "@jay") {
    return { isMention: true, messageContent: nudgeText };
  }

  return { isMention: false, messageContent: "" };
}
