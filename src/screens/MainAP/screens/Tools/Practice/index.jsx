import React from 'react';
import { fromJS, Map } from 'immutable';
import Table from 'shared/components/Table';

const tableOptions = fromJS([
  {
    id: 'name',
    text: 'name',
    sortable: true,
  },
  {
    id: 'age',
    text: 'age',
    defaultValue: '--',
    sortable: true,
    sortFun: (a, b) => {
      if (parseInt(a, 10) - parseInt(b, 10) > 0) {
        return -1;
      } else if (parseInt(a, 10) - parseInt(b, 10) < 0) {
        return 1;
      }
      return 0;
    },
  },
  {
    id: 'owns',
    text: 'owns',
    options: [
      { label: 'BOOK', value: 'book' },
      { label: 'CUP', value: 'cup' },
      { label: 'PEN', value: 'pen' },
      // 'book', // options列表除了Map之外还可以有纯字符串
      // 'pen',
    ],
    multi: true, // 标志为多选
  },
]);

const tableList = fromJS([
  {
    name: 'zhanasdfagsan',
    age: '1',
    owns: 'book,pen',
  },
  {
    name: 'asdfas',
    age: '2',
    owns: 'book,pen',
  },
  {
    name: 'qwer',
    age: '3',
    owns: 'book,pen',
  },
  {
    name: 'fhhj',
    age: '2',
    owns: 'book,pen',
  },
  {
    name: 'qwesgf',
    age: '5',
    owns: 'book,pen',
  },
  {
    name: 'kljj',
    age: '6',
    owns: 'book,pen',
  },
  {
    name: 'asdc',
    age: '7',
    owns: 'book,pen',
  },
  {
    name: 'awedc',
    age: '8',
    owns: 'book,pen',
  },
  {
    name: 'xegg',
    age: '9',
    owns: 'book,pen',
  },
  {
    name: 'awefd',
    age: '10',
    owns: 'book,pen',
  },
  {
    name: 'sdgrg',
    age: '11',
    owns: 'book,pen',
  },
  {
    name: 'asdfxc',
    age: '12',
    owns: 'book,pen',
  },
  {
    name: 'aergd',
    age: '13',
    owns: 'book,pen',
  },
  {
    name: 'aerg',
    age: '14',
    owns: 'book,pen',
  },
  {
    name: 'zhangsan',
    age: '15',
    owns: 'book,pen',
  },
]);

const page = fromJS({
  totalPage: 3,
  currPage: 1,
  nextPage: 2,
});

export default class Practice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableList,
      page,
    };
  }
  render() {
    return (
      <div>
        <Table
          options={tableOptions}
          list={this.state.tableList}
          selectable
          page={page}
          onRowSelect={(e) => {
            const index = e.index;
            let tableList1;
            if (index >= 0) {
              const status = this.state.tableList.getIn([index, '__selected__']);
              tableList1 = this.state.tableList.setIn([index, '__selected__'], !status);
            } else if (index === -1) {
              const falseIndex = this.state.tableList.findIndex(item => item.get('__selected__') === false || typeof (item.get('__selected__')) === 'undefined');
              let status;
              if (falseIndex !== -1) status = true;
              else status = false;
              tableList1 = this.state.tableList.map(item => item.set('__selected__', status));
            }
            this.setState({
              tableList: tableList1,
            });
          }}
          // onRowClick={(e, i) => {
          //   const index = i;
          //   const status = this.state.tableList.getIn([index, '__selected__']);
          //   const tableList1 = this.state.tableList.setIn([index, '__selected__'], !status);
          //   this.setState({
          //     tableList: tableList1,
          //   });
          // }}
          onPageChange={(i) => {
            console.log('i', i);
            const totalPage = this.state.page.get('totalPage');
            let nextPage;// = this.state.page.get('nextPage');
            if (i >= totalPage - 1) {
              nextPage = totalPage;
            } else {
              nextPage = i + 1;
            }
            const page1 = this.state.page.set('currPage', i).set('nextPage', nextPage);
            this.setState({
              page: page1,
            });
            console.log(this.state.page.toJS());
          }}
        />
      </div>
    );
  }
}

