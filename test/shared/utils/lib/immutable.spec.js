import { getNumberKeys, getFormOptions, getDefaultData, selectList } from 'shared/utils/lib/immutable';
import { fromJS } from 'immutable';

describe('immutableUtils', () => {
  let sandbox;
  beforeEach(() => {
    // create a sandbox
    sandbox = sinon.sandbox.create();

    // stub some console methods
    sandbox.stub(console, 'error');
  });

  afterEach(() => {
    // restore the environment as it was before
    sandbox.restore();
  });

  describe('#getNumberKeys()', () => {
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
  describe('#getFormOptions()', () => {
    it('should return null list when no param', () => {
      expect(getFormOptions()).toBe(null);
    });
    it('should return null when param is not immutable List', () => {
      expect(getFormOptions(123)).toBe(null);
    });
    it('should Form Options when param is immutable List options', () => {
      const listOptions = fromJS([
        {
          id: '1',
          linkId: 'link1',
          formProps: {
            type: 'file',
            dataType: 'number',
          },
        },
        {
          id: '2',
          linkId: 'link2',
          formProps: {
            type: 'file',
          },
        },
        {
          id: '3',
          linkId: 'link3',
          label: 'test',
          notEditable: true,
          formProps: {
            type: 'file',
          },
        },
      ]);
      expect(getFormOptions(listOptions).toJS()).toEqual([
        {
          id: '1',
          linkId: 'link1',
          type: 'file',
          dataType: 'number',
        }, {
          id: '2',
          linkId: 'link2',
          type: 'file',
        }, {
          id: '3',
          linkId: 'link3',
          label: 'test',
          notEditable: true,
          type: 'file',
        },
      ]);
    });
  });
  describe('#getDefaultData()', () => {
    it('should return null when param is not immutable List', () => {
      expect(getDefaultData(123)).toBe(null);
      expect(getDefaultData()).toBe(null);
      sinon.assert.calledTwice(console.error);
    });
    it('should Form Options when param is immutable List options', () => {
      const listOptions = fromJS([
        [
          {
            id: '0.1',
            defaultValue: 'link1',
          },

          // 需要剔除 undefined 的值
          {
            id: '0.2',
            defaultValue: undefined,
          },
        ],

        // 能处理列表
        [
          {
            id: '0.11',
            defaultValue: 'link1',
          }, {
            id: '0.22',
            defaultValue: 'link1',
          },
        ],

        // 需要保持 ‘’ 空的值
        {
          id: '1',
          defaultValue: '',
          formProps: {
            type: 'file',
            dataType: 'number',
          },
        },
        {
          id: 'sads',
          defaultValue: 'link2',
          formProps: {
            type: 'file',
          },
        },
      ]);
      expect(getDefaultData(listOptions)).toEqual({
        1: '', // 保持空值
        0.1: 'link1',
        // '0.2' 被剔除
        0.11: 'link1',
        0.22: 'link1',
        sads: 'link2',
      });
    });
  });
  describe('#selectList()', () => {
    const $$list = fromJS([
      {
        id: 1,
        name: '111',
      },
      {
        id: 2,
        name: '222',
      },
    ]);
    it('should return null when not first argument or second argument', () => {
      expect(selectList()).toEqual(null);
      expect(selectList(fromJS([]))).toEqual(null);
      sinon.assert.calledTwice(console.error);
    });
    it('should return correct $$list and selectedList when second argument is to select one', () => {
      const data = {
        index: 1,
        selected: true,
      };

      expect(selectList($$list, data)).toEqual({
        $$list: fromJS([
          {
            id: 1,
            name: '111',
          },
          {
            id: 2,
            name: '222',
            __selected__: true,
          },
        ]),
        selectedList: fromJS([1]),
      });
    });
    it('should return correct $$list and selectedList when second argument is to unselect one', () => {
      const $$listSelected = fromJS([
        {
          id: 1,
          name: '111',
        },
        {
          id: 2,
          name: '222',
          __selected__: true,
        },
      ]);
      const data = {
        index: 1,
        selected: false,
      };

      expect(selectList($$listSelected, data)).toEqual({
        $$list: fromJS([
          {
            id: 1,
            name: '111',
          },
          {
            id: 2,
            name: '222',
            __selected__: false,
          },
        ]),
        selectedList: fromJS([]),
      });
    });
    it('should return correct $$list and selectedList when second argument is to select all', () => {
      const $$listSelected = fromJS([
        {
          id: 1,
          name: '111',
        },
        {
          id: 2,
          name: '222',
          __selected__: true,
        },
      ]);
      const data = {
        index: -1,
        selected: true,
      };

      expect(selectList($$listSelected, data)).toEqual({
        $$list: fromJS([
          {
            id: 1,
            name: '111',
            __selected__: true,
          },
          {
            id: 2,
            name: '222',
            __selected__: true,
          },
        ]),
        selectedList: fromJS([0, 1]),
      });
    });
    it('should return correct $$list and selectedList when second argument is to unselect all', () => {
      const $$listSelected = fromJS([
        {
          id: 1,
          name: '111',
        },
        {
          id: 2,
          name: '222',
          __selected__: true,
        },
      ]);
      const data = {
        index: -1,
        selected: false,
      };

      expect(selectList($$listSelected, data)).toEqual({
        $$list: fromJS([
          {
            id: 1,
            name: '111',
            __selected__: false,
          },
          {
            id: 2,
            name: '222',
            __selected__: false,
          },
        ]),
        selectedList: fromJS([]),
      });
    });
  });
});

