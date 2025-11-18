export const normalize = (text, { trim = true, lower = true } = {}) => {
  if (text == null) return undefined;
  let s = String(text);
  if (trim) s = s.trim();
  if (lower) s = s.toLowerCase();
  return s;
};

export const normalizedTrimLowerCase = (text) =>
  normalize(text, { trim: true, lower: true });
export const normalizedTrim = (text) =>
  normalize(text, { trim: true, lower: false });
export const normalizedLowerCase = (text) =>
  normalize(text, { trim: false, lower: true });

export default normalize;
