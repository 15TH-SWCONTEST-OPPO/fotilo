export default function debounce(fn: Function, delay?: number) {
  let timeout: NodeJS.Timeout;
  return (e:any)=>  {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(e);
    }, delay || 300);
  };
}
