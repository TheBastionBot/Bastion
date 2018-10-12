Array.prototype.unique = e => [ ...new Set(e) ];

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.shuffle = function() {
  let i = this.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
};

Array.prototype.intersect = function(...a) {
  return [ this, ...a ].reduce((p, c) => p.filter(e => c.includes(e)));
};
