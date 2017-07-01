module.exports = (domain, url) => {
  if (typeof domain !== 'string') return domain;
  let regex = new RegExp(`^(http[s]?://)?${domain.replace(/\*/g, '[\\w\\d.-]*')}`);
  return regex.test(url);
};
