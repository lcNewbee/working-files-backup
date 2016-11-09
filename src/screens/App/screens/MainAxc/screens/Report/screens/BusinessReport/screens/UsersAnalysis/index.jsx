import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { fromJS } from 'immutable';
import {
  PureComponent, EchartReact, Button, Table, Switchs,
  FormInput,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from './actions';
import myReducer from './reducer';

const tableOptions = fromJS([
  {
    id: 'time',
    text: _('Time'),
  }, {
    id: 'cumulativeVisits',
    text: _('Cumulative visits'),
  }, {
    id: 'firstVisits',
    text: _('First visits'),
  }, {
    id: 'newlyRegistered',
    text: _('Newly Registered'),
  }, {
    id: 'passBy',
    text: _('Pass By'),
  }, {
    id: 'accessSubscriber',
    text: _('Access Subscriber'),
  }, {
    id: 'nonFirstVisit',
    text: _('Repeat Visit'),
  }, {
    id: 'accessRatio',
    text: _('Capture Rate'),
  }, {
    id: 'reVisitingRatio',
    text: _('Repeat Visit Rate'),
  }, {
    id: 'averageDetentionTime',
    text: _('Median visit length'),
  },
]);

export default class View extends PureComponent {
  constructor(props) {
    super(props);

    this.binds('getCpuOption');
  }
  render() {
    const { list } = this.props;
    const switchOptions = tableOptions.delete(0).map(item => ({
      label: item.get('text'),
      value: item.get('id'),
    })).toJS();

    return (
      <div>
        <div className="stats-group clearfix" >
          <div className="m-action-bar stats-group-cell">
            <div className="cols col-6">
              <label
                style={{ marginRight: '20px' }}
                htmlFor="dateRange"
              >
                {_('Date Range')}
              </label>
              <FormInput
                type="date-range"
                id="dateRange"
                dateFormat="YYYY-MM-DD"
                todayButton={_('Today')}
              />
            </div>
            <div className="cols col-6">
              <Button
                theme="primary"
                icon="download"
                text={`${_('Download Report')}(PDF)`}
              />
            </div>
          </div>
          <div className="stats-group-cell">
            <Table
              className="table"
              options={tableOptions}
              list={list || []}
            />
          </div>
          <div className="stats-group-cell">
            <Switchs
              options={switchOptions}
              value="1"
            />
          </div>
          <div className="cols col-6" >
            <div className="stats-group-cell" />
          </div>
          <div className="cols col-6" >
            <div className="stats-group-cell" />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.system,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);

export const reducer = myReducer;
