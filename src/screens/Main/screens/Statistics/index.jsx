import React from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';
import Button from 'shared/components/Button/Button';
import { Search, FormGroup, Checkbox } from 'shared/components/Form';
import Switchs from 'shared/components/Switchs';
import Table from 'shared/components/Table';

const msg = {
  TITIE: _('Reports'),
  EXPORTING: _('Exporting The Reports'),
  EMAILREPORT: _('Email The Reports'),
  DELETEREPORT: _('Delete The Reports'),
};

const typeArr = [
  {
    value: '0',
    label: _('1 day'),
  }, {
    value: '1',
    label: _('1 week'),
  }, {
    value: '2',
    label: _('1 month'),
  },
];

// 原生的 react 页面
export const Statistics = React.createClass({

  mixins: [PureRenderMixin],

  componentWillMount() {
    this.props.fetchReportInfo();
  },

  // 函数定义
  onTimeSwitch(data) {
    this.props.changeTimeRangeInfo(data.value);
  },

  onGenerateReport() {
    this.props.createReport();// 通过connect传递成为statistics的属性,定义在action中
  },

  onDownloadReport(num) {
    this.props.downloadReport(num);
  },

  // 点击邮件按钮的操作
  onEmailReport(num) {
    this.props.emailReport(num);
  },

  // 点击删除按钮的操作
  onDeleteReport(num) {
    this.props.deleteReport(num);
  },

  render() {
    const reportsTableOptions = fromJS([
      {
        id: 'id',
        text: _('No.'),
      }, {
          id: 'createAt',
          text: _('Create Time'),
        }, {
        id: 'startdate',
        text: _('Report start time'),
      }, {
        id: 'enddate',
        text: _('Report end time'),
      }, {
        id: 'operate',
        text: _('Action'),
        transform: function (val, item) {
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
        }.bind(this),
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
            text={_('Generate Report')}
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
  },
});

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

