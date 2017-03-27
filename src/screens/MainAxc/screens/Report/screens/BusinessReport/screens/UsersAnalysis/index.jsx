import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { fromJS } from 'immutable';
import {
  Button, Table, Switchs,
  FormInput,
} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import * as actions from './actions';
import myReducer from './reducer';

const tableOptions = fromJS([
  {
    id: 'time',
    text: __('Time'),
  }, {
    id: 'cumulativeVisits',
    text: __('Cumulative visits'),
  }, {
    id: 'firstVisits',
    text: __('First visits'),
  }, {
    id: 'newlyRegistered',
    text: __('Newly Registered'),
  }, {
    id: 'passBy',
    text: __('Pass By'),
  }, {
    id: 'accessSubscriber',
    text: __('Access Subscriber'),
  }, {
    id: 'nonFirstVisit',
    text: __('Non - First Visit'),
  }, {
    id: 'accessRatio',
    text: __('Visit Ratio'),
  }, {
    id: 'reVisitingRatio',
    text: __('Re-visiting Ratio'),
  }, {
    id: 'averageDetentionTime',
    text: __('Average Dwell Time'),
  },
]);

export default class View extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, ['getCpuOption']);
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
                {__('Date Range')}
              </label>
              <FormInput
                type="date-range"
                id="dateRange"
                dateFormat="YYYY-MM-DD"
                todayButton={__('Today')}
              />
            </div>
            <div className="cols col-6">
              <Button
                theme="primary"
                icon="download"
                text={`${__('Download Report')}(PDF)`}
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
