export const msToHHMMSS = (ms: number): string => {
  const hours = padTo2Digits(Math.floor(ms / 3600000));
  const minutes = padTo2Digits(Math.floor((ms % 3600000) / 60000));
  const seconds = padTo2Digits(Math.floor(((ms % 3600000) % 60000) / 1000));

  return `${hours}:${minutes}:${seconds}`;
};

const padTo2Digits = (number: number): string | number => {
  return number < 10 ? `0${number}` : number;
};
