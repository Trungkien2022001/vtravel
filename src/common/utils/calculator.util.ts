export function calculateDistance(d1, d2) {
  return Math.sqrt(
    (d1.latitude - d2.latitude) * (d1.latitude - d2.latitude) +
      (d1.longitude - d2.longitude) * (d1.longitude - d2.longitude),
  );
}
