const changeYear = (year) => {
  if (year === 0) {
    return year += 1;
  } else {
    return year -= 1;
  }
};

const toHex = (str) => {
  str = str.toString();
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += `${str.charCodeAt(i).toString(16)}`;
  }
  return hex.trim();
};

export default { changeYear, toHex };
