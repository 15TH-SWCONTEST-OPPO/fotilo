export default function getTime(value: number): string {
  let num = value;
  let second = (Math.floor((num % 60) / 10) === 0 ? '0' : '') + (num % 60);
  num = Math.floor(num / 60);
  let min = (Math.floor((num % 60) / 10) === 0 ? '0' : '') + (num % 60);
  num = Math.floor(num / 60);
  let hour = (Math.floor((num % 60) / 10) === 0 ? '0' : '') + (num % 60);
  if (hour !== '00') return hour + ':' + min + ':' + second;
  return min + ':' + second;
}
