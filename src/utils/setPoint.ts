export default function setPoint(value: number): string {
  return Math.ceil(value) !== value ? value + 'x' : value + '.0x';
}
