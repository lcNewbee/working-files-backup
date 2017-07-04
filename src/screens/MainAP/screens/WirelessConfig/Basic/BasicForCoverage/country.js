import ctyArr from 'shared/config/country.json';

const countryMap = {};

for (let i = 0; i < ctyArr.length; i++) {
  const item = ctyArr[i];
  countryMap[item.en] = item.country;
}

countryMap.ROW = 'NG';

export default countryMap;
