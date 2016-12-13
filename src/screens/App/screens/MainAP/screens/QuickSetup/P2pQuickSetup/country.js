import ctyArr from 'shared/config/country.json';

const countryMap = {
  ROW: 'NG',
};

for (let i = 0; i < ctyArr.length; i++) {
  const item = ctyArr[i];
  countryMap[item.en] = item.country;
}

export default countryMap;
