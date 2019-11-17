Array.intersection = function(arr1, arr2) {
  return arr1.unique().filter(e => arr2.includes(e));
};

Array.union = function(arr1, arr2) {
  return [ ...new Set([ ...arr1, ...arr2 ]) ];
};

Array.zip = function(...arr) {
  return [ ...arr[0] ].map((_, i) => arr.map(a => a[i]));
};
