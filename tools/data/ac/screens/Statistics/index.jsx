import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';
import Button from 'shared/components/Button/Button';
import Switchs from 'shared/components/Switchs';
import Table from 'shared/components/Table';
import PureComponent from 'shared/components/Base/PureComponent';

import * as actions from './actions';
import reducer from './reducer';

const msg = {
  TITIE: __('Reports'),
  EXPORTING: __('Exporting The Reports'),
  EMAILREPORT: __('Email The Reports'),
  DELETEREPORT: __('Delete The Reports'),
};

const typeArr = [
  {
    value: '0',
    label: __('1 day'),
  }, {
    value: '1',
    label: __('1 week'),
  }, {
    value: '2',
    label: __('1 month'),
  },
];

// 原生的 react 页面
export class Statistics extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onTimeSwitch',
      'onGenerateReport',
      'onDownloadReport',
      'onEmailReport',
      'onDeleteReport',
    ]);
  }

  componentWillMount() {
    this.props.fetchReportInfo();
  }

  // 函数定义
  onTimeSwitch(data) {
    this.props.changeTimeRangeInfo(data.value);
  }

  onGenerateReport() {
    this.props.createReport();// 通过connect传递成为statistics的属性,定义在action中
  }

  onDownloadReport(num) {
    this.props.downloadReport(num);
  }

  // 点击邮件按钮的操作
  onEmailReport(num) {
    this.props.emailReport(num);
  }

  // 点击删除按钮的操作
  onDeleteReport(num) {
    this.props.deleteReport(num);
  }

  render() {
    const reportsTableOptions = fromJS([
      {
        id: 'id',
        text: __('No.'),
      }, {
        id: 'createAt',
        text: __('Create Time'),
      }, {
        id: 'startdate',
        text: __('Report start time'),
      }, {
        id: 'enddate',
        text: __('Report end time'),
      }, {
        id: 'operate',
        text: __('Action'),
        render: (val, item) => {
          let curId = item.get('id');

          return (
            <div>
              <Button
                icon="download"
                title={msg.EXPORTING}
                onClick={() => this.onDownloadReport(curId)}
              />
              <Button
                icon="envelope-o"
                title={msg.EMAILREPORT}
                onClick={() => this.onEmailReport(curId)}
              />
              <Button
                icon="close"
                title={msg.DELETEREPORT}
                onClick={() => this.onDeleteReport(curId)}
              />
            </div>
          );
        },
      },
    ]);

    return (
      <div className="page-reports">
        <h2>{msg.TITIE}</h2>
        <div className="m-action-bar">
          <Switchs
            options={typeArr}
            value={this.props.query.get('timeType')}
            onChange={this.onTimeSwitch}
          />
          <Button
            icon="plus"
            text={__('Generate Report')}
            onClick={this.onGenerateReport}
          />
        </div>
        <div>
           <Table
             className="table"
             options={reportsTableOptions}
             list={this.props.reports}
           />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) { // state是整个应用的state？如何知道？
  let myState = state.statistics;

  return {
    fetching: myState.get('fetching'),
    query: myState.get('query'),
    reports: myState.get('reports'),
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(Statistics);

export const statistics = reducer;// 作为整体state的一部分，为什么是const？
