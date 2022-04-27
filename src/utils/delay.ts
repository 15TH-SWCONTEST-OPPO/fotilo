export default (delay: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
};
