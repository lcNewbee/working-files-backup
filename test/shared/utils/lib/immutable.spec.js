import { getNumberKeys } from 'shared/utils/lib/immutable';
import { fromJS } from 'immutable';

describe('validator.combine', () => {
  describe('#toNumberWithKeys()', () => {
    it('should return number list when param is list', () => {
      const formList = fromJS([
        {
          id: '1',
          linkId: 'link1',
          dataType: 'number',
        }, {
          id: '2',
          linkId: 'link2',
        }, {
          id: '3',
          linkId: 'link3',
          dataType: 'number',
        },
      ]);
      expect(getNumberKeys(formList)).toEqual([
        '1', 'link1', '3', 'link3',
      ]);
    });
    it('should deep walk when param is List tree', () => {
      const formList = fromJS([
        [
          {
            id: '0.1',
            linkId: 'link0.1',
            dataType: 'number',
          }, {
            id: '0.2',
            linkId: 'link2',
          },
        ], [
          {
            id: '0.11',
            dataType: 'number',
          }, {
            id: '0.22',
            linkId: 'link2',
          },
        ],
        {
          id: '1',
          linkId: 'link1',
          dataType: 'number',
        }, {
          id: '2',
          linkId: 'link2',
        }, {
          id: '3',
          linkId: 'link3',
          dataType: 'number',
        },
      ]);
      expect(getNumberKeys(formList)).toEqual([
        '0.1', 'link0.1', '0.11', '1', 'link1', '3', 'link3',
      ]);
    });
    it('should return [] when param is not List', () => {
      expect(getNumberKeys()).toEqual([]);
    });
  });
});
