import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import { FormGroup, FormInput, Search, Table } from 'shared/components';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import * as settingActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import * as selfActions from './actions';
import reducer from './reducer';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetch: PropTypes.func,
  save: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),

  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  changePageObject: PropTypes.func,
  changeTableList: PropTypes.func,
  changeStartNo: PropTypes.func,
  changePerPageNum: PropTypes.func,
  changeSearchItem: PropTypes.func,
  changSearchList: PropTypes.func,
};

const defaultProps = {};

export default class SystemLogs extends Component {
  constructor(props) {
    super(props);
    this.onChangeLogSwitch = this.onChangeLogSwitch.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangeSearchItem = this.onChangeSearchItem.bind(this);
    this.fetchlogAndShow = this.fetchlogAndShow.bind(this);
    this.generateLogNo = this.generateLogNo.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      defaultData: {
        logList: [],
        logEnable: '0',
      },
    });
    this.props.fetch('goform/get_log_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.updateItemSettings({
          logEnable: json.data.logEnable,
        });
      }
      return json;
    }).then((json) => {
      if (json.state && json.state.code === 2000) {
        if (json.data.logEnable === '1') {
          this.fetchlogAndShow();
        }
      }
    });
  }

  componentWillReceiveProps() {
    this.n = 0;
  }

  onChangeLogSwitch(data) {
    this.props.updateItemSettings({
      logEnable: data.value,
    });
    if (data.value === '1') {
      this.props.save('goform/set_log', { logEnable: '1' }).then((json) => {
        if (json.state && json.state.code === 2000) {
          // this.props.fetch('goform/get_log_list').then((json2) => {
          //   if (json2.state && json2.state.code === 2000) {
          //     this.props.updateItemSettings({
          //       logList: fromJS(json2.data.logList),
          //     });
          //   }
          // });
          this.fetchlogAndShow();
        }
      });
    } else {
      this.props.save('goform/set_log', { logEnable: '0' });
      this.props.updateItemSettings({
        logList: fromJS([]),
      });
    }
  }

  onChangePage(data) {
    const totalPage = this.props.selfState.getIn(['logPage', 'totalPage']);
    // console.log('totalPage', totalPage);
    // console.log('selfState.get(searchItem)', this.props.selfState.get('searchItem'));
    // this.onChangeSearchItem(this.props.selfState.get('searchItem'));
    // let logList;
    // let perPageNum;
    // window.setTimeout(() => {
    //   logList = this.props.selfState.get('tableList').toJS();
    //   console.log(logList);
    //   perPageNum = this.props.selfState.get('perPageNum');
    // }, 0);
    const logList = this.props.selfState.get('searchList').toJS();
    const perPageNum = this.props.selfState.get('perPageNum');
    const listLen = logList.length;
    const startNo = (data - 1) * perPageNum;
    // console.log(startNo, listLen);
    const list = [];
    let currPage;
    let nextPage;
    if (data < totalPage && (data + 1) <= totalPage) {
      currPage = data;
      nextPage = data + 1;
    } else if (data === totalPage) {
      currPage = data;
      nextPage = -1;
    }
    this.props.changePageObject(fromJS({
      totalPage,
      currPage,
      nextPage,
      lastPage: totalPage,
    }));
    if (startNo > listLen) {
      throw new Error(__('The page does not exist'));
    }
    this.props.changeStartNo(startNo + 1);
    for (let i = 0; i < perPageNum && (startNo + i) < listLen; i++) {
      list.push(logList[startNo + i]);
    }
    this.props.changeTableList(fromJS(list));
  }

  onChangeNumOfPerPage(data) {
    this.props.changePerPageNum(data.value);
    this.onChangeSearchItem(this.props.selfState.get('searchItem'));
    window.setTimeout(() => {
      this.props.changePageObject(fromJS({
        totalPage: Math.ceil(this.props.selfState.get('searchList').size / data.value),
        currPage: 1,
      }));
      this.onChangePage(1);
    }, 0);
  }

  onChangeSearchItem(val) {
    const temp = val;
    this.props.changeSearchItem(val);
    const logList = this.props.store.getIn(['curData', 'logList']).toJS();
    const searchList = logList.map((log) => {
      if (log.time.indexOf(temp) !== -1 || log.content.indexOf(temp) !== -1) {
        return log;
      }
      return '';
    }).filter(item => item !== '');

    // this.props.changeTableList(fromJS(searchList));
    this.props.changSearchList(fromJS(searchList));
    this.props.changePageObject(fromJS({
      totalPage: Math.ceil(searchList.length / this.props.selfState.get('perPageNum')),
    }));
  }

  fetchlogAndShow() {
    this.props.fetch('goform/get_log_list').then((json) => {
      this.props.updateItemSettings({
        logList: fromJS(json.data.logList),
      });
      this.props.changeSearchItem('');
      this.props.changSearchList(fromJS(json.data.logList));
      const totalLogs = json.data.logList.length;
      const perPageNum = this.props.selfState.get('perPageNum');
      const totalPage = Math.ceil(totalLogs / perPageNum);
      let nextPage;
      if (totalPage < 2) { nextPage = -1; }
      this.props.changePageObject(fromJS({
        totalPage,
        currPage: 1,
        nextPage,
        lastPage: totalPage,
      }));
      this.onChangePage(1);
    });
  }

  generateLogNo() {
    const no = this.props.selfState.get('startNoForEveryPage') + this.n;
    this.n = this.n + 1;
    return no;
  }

  render() {
    // let n = 0;
    const systemLogOptions = fromJS([
      {
        id: 'id',
        text: __('No.'),
        transform: this.generateLogNo,
        width: '80px',
      },
      {
        id: 'time',
        text: __('Time'),
        width: '200px',
      },
      {
        id: 'content',
        text: __('Content'),
      },
    ]);

    const numOfPerPageOptions = [
      { value: 20, label: '20' },
      { value: 30, label: '30' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
    ];

    return (
      <div className="stats-group">
        <h3>{__('System Logs')}</h3>
        <FormGroup
          type="checkbox"
          label={__('System Log')}
          checked={this.props.store.getIn(['curData', 'logEnable']) === '1'}
          onChange={data => this.onChangeLogSwitch(data)}
        />
        {
          this.props.store.getIn(['curData', 'logEnable']) === '1' ? (
            <div
              style={{
                width: '90%',
                margin: 'auto',
              }}
            >
              <div>
                <Search
                  value={this.props.selfState.get('searchItem')}
                  onChange={(val, e) => {
                    this.onChangeSearchItem(val, e);
                    window.setTimeout(() => {
                      this.onChangePage(1);
                    }, 0);
                  }}
                />
                <FormGroup
                  label={__('Items Per Page')}
                  type="select"
                  options={numOfPerPageOptions}
                  value={this.props.selfState.get('perPageNum')}
                  onChange={data => this.onChangeNumOfPerPage(data)}
                />
              </div>
              <div className="stats-group-cell">
                <Table
                  className="table"
                  options={systemLogOptions}
                  list={this.props.selfState.get('tableList')}
                  page={this.props.selfState.get('logPage')}
                  onPageChange={data => this.onChangePage(data)}
                />
              </div>
            </div>
          ) : null
        }

      </div>
    );
  }
}

SystemLogs.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.systemlogs,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    settingActions,
    selfActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SystemLogs);

export const systemlogs = reducer;
