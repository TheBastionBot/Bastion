String.prototype.substitute = function () {
  let count = 0;
  let args = arguments;
  return this.replace(/%var%/g, () => args[count++]);
};
