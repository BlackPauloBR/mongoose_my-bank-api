function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

export { isNumber };
