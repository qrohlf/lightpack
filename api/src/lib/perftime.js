const secondsToMillis = (sec) => sec * 1000;
const nanosToMillis = (ns) => ns / 1000000;

export default () => {
  const start = process.hrtime();
  const stop = () => {
    const stop = process.hrtime();
    const ms =
      secondsToMillis(stop[0] - start[0]) + nanosToMillis(stop[1] - start[1]);
    return {
      ms,
      toString: () => ms.toLocaleString("en-US", { maximumFractionDigits: 2 }),
    };
  };
  return stop;
};
