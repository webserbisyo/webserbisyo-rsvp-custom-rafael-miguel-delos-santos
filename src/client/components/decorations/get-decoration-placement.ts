export function getAlternatingDecorationOrientation(
  index: number
): "left" | "right" {
  return index % 2 === 0 ? "left" : "right";
}

export function getGridColumnDecoration(
  index: number,
  numColumns: number
): { position: "top-left" | "top-right"; orientation: "left" | "right" } | null {
  if (numColumns <= 1) {
    const isEven = index % 2 === 0;
    return {
      position: isEven ? "top-left" : "top-right",
      orientation: isEven ? "left" : "right",
    };
  }

  const col = index % numColumns;
  if (col === 0) {
    return { position: "top-left", orientation: "left" };
  }
  if (col === numColumns - 1) {
    return { position: "top-right", orientation: "right" };
  }
  return null;
}
