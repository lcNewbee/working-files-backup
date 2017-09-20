
/**
 *
 *
 * @export
 */
export function getSizeStyleUnit(val) {
  let ret = val;

  if (typeof val === 'number') {
    ret = `${ret}px`;
  }

  return ret;
}

export default {
  getSizeStyleUnit,
};

