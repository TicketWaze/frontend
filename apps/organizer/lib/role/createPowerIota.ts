export default function createPowerIota() {
  let value = 1n;

  return () => {
    const result = value;
    value = value << 1n; // Shift left to generate the next power of 2
    return result;
  };
}