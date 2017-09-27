export default function copyRadioSsidsData(target, srcData) {
  const ret = target;
  const len = 16;

  if (srcData) {
    // 5G
    if (srcData.phymodesupport >= 8) {
      for (let i = 0; i < len; i += 1) {
        ret[`wlan_${i}_enable2g`] = ret[`wlan${i}enable`];
      }

    // 2.4G
    } else {
      for (let i = 0; i < len; i += 1) {
        ret[`wlan_${i}_enable5g`] = ret[`wlan${i}enable`];
      }
    }
  }

  return ret;
}

