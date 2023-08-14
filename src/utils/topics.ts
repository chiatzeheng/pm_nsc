const TOPICS = {
  0: "Boolean",
  1: "Shorthand",
  2: "Post/pre in/decrement",
  3: "If/Else",
  4: "Switch",
  5: "For",
  6: "While",
  7: "Do...While",
  8: "Length",
  9: "Index",
  10: "Index Operations",
  11: "Methods",
  12: "Function",
};
export type CategoryTypes =
  | "Operations"
  | "Selection"
  | "Repetition"
  | "Arrays"
  | "Functions";
export const getCategory = (topic: keyof typeof TOPICS) => {
  if (topic >= 0 && topic <= 2) return "Operations";
  if (topic >= 3 && topic <= 4) return "Selection";
  if (topic >= 5 && topic <= 7) return "Repetition";
  if (topic >= 8 && topic <= 11) return "Arrays";
  if (topic >= 12 && topic <= 12) return "Functions";
  return "Operations";
};
export const getTopic = (topic: keyof typeof TOPICS) => {
  return TOPICS[topic];
};
export default TOPICS;
