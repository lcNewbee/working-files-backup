import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {fromJS} from 'immutable';
import {Table} from '../../components/Table';
import Button from 'comlan/components/Button';
import {Search} from '../../components/Form/Input';
import Select from 'comlan/components/Select';
import * as actions from './actions';
import reducer from './reducer';

const clientsTableOptions = fromJS([
  {
    'id': 'name',
    'text': 'MAC地址/名称'
  }, {
    'id': 'ip',
    'text': 'ip地址'
  }, {
    'id': 'ssid',
    'text': 'SSID'
  }, {
    'id': 'relateAp',
    'text': '关联AP'
  }, {
    'id': 'bandwidth',
    'text': '上下行流量'
  }, {
    'id': 'signalQuality',
    'text': '信号质量'
  }, {
    'id': 'channel',
    'text': '认证类型'
  }, {
    'id': 'runTime',
    'text': '运行时间'
  }, {
    id: 'op',
    text: '操作'
  }
]);

let testVal = 'one';

// 原生的 react 页面
export const Clients = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.handleSearch()
  },

  handleSearch() {
    this.props.fetchClients('/api/clients');
  },

  onChangeSearchText(e) {
    var val = e.target.value;

    this.props.changeClientsQuery({
      text: val
    });
  },

  onChangeType(i) {
    this.props.changeClientsQuery({
      type: i
    });
    this.handleSearch()
  },
  
  onChangeTableSize(option) {
    var val = '';
    
    if(option) {
      val = option.value;
    }
    
    this.props.changeClientsQuery({
      size: val
    });
  },

  render() {
    // 添加操作项
    const options = clientsTableOptions.setIn([-1, 'transform'],
      function(item) {
        return (
          <div>
            <Button
              role="unlock"
              text="解除封锁"
            />
            
            <Button
              role="repeat"
              text="重新连接"
            />
          </div>
        )
      }.bind(this)
    )
    const typeArr = fromJS([
      '全部',
      '无线',
      '有线',
      '来宾'
    ]);
    
    const selectOptions = [
      { value: 20, label: '20' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
    ];

    return (
      <div className="page-device">
        <h2>设备信息</h2>
        <div className="clearfix">

          <Search
            value={this.props.query.get('text')}
            updater={this.onChangeSearchText}
            onSearch={this.handleSearch}
          />

          <div className="btn-group fl">
            {
            typeArr.map(function(val, i){
              var classNameVal = 'btn';

              if(this.props.query.get('type') === i) {
                classNameVal += ' active';
              }

              return (
                <button
                  className={classNameVal}
                  key={'btnGroup' + i}
                  onClick={this.onChangeType.bind(this, i)}
                >
                  {val}
                </button>
              )
            }.bind(this))
          }
          </div>
          <Select
            className="fr"
            clearable={false}
            value={this.props.query.get('size')}
            onChange={this.onChangeTableSize}
            options={selectOptions}
          />
        </div>

        <Table
          className="table"
          options={options}
          list={this.props.data.get('list')}
        />

      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.clients;

  return {
    fetching: myState.get('fetching'),
    query: myState.get('query'),
    updateAt: myState.get('updateAt'),
    data: myState.get('data')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Clients);

export const clients = reducer;

