String.prototype.toTitleCase = function() {
  let newstr = this.split(' ');
  for (let i = 0; i < newstr.length; i++) {
    if (newstr[i] === '') continue;
    let copy = newstr[i].substring(1).toLowerCase();
    newstr[i] = newstr[i][0].toUpperCase() + copy;
  }
  newstr = newstr.join(' ');
  return newstr;
};

String.prototype.truncate = function(length, terminator = '...') {
  let string = this.valueOf();
  let terminatorLength = terminator.length;

  string = string.length > length
    ? string.substring(0, length - terminatorLength) + terminator
    : string;

  return string;
};
