export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "ca-badge ca-badge-easy";
    case "medium":
      return "ca-badge ca-badge-medium";
    case "hard":
      return "ca-badge ca-badge-hard";
    default:
      return "ca-badge";
  }
};
