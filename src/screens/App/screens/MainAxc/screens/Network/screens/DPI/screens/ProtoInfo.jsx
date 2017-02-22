import React, { PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';
import Select from 'shared/components/Select';
import Table from 'shared/components/Table';
import { FormGroup, FormInput } from 'shared/components/Form';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

const flowRateFilter = utils.filter('flowRate');
const propTypes = fromJS({
  route: PropTypes.object,
  initScreen: PropTypes.func,
});
const msg = {
  days: _('Days'),
};
const timeTypeSwitchs = fromJS([
  {
    value: '-1',
    label: _('Current'),
  },
  {
    value: '0',
    label: _('Today'),
  },
  {
    value: '1',
    label: _('Yesterday'),
  },
  {
    value: '7',
    label: `7 ${msg.days}`,
  },
  {
    value: '15',
    label: `15 ${msg.days}`,
  },
  {
    value: '30',
    label: `30 ${msg.days}`,
  },
]);

const listOptions = fromJS([
  {
    id: 'attr_name',
    text: _('Application'),
  }, {
    id: 'userNum',
    text: _('User Number'),
  }, {
    id: 'curRate',
    text: _('Current Rate'),
    transform(val) {
      return `${flowRateFilter.transform(val)}/s`;
    },
  }, {
    id: 'trafficPercent',
    text: _('Proportion'),
  },
]);

const viewOptions = fromJS([
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '150', value: '150' },
]);


export default class ProtoInfo extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'initOptions',
      'onChangeTimeType',
      'onChangePage',
      'onChangeView',
    ]);
  }

  componentWillMount() {
    this.initOptions(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const curScreenId = nextProps.store.get('curScreenId');

    if (this.props.store.getIn([curScreenId, 'data']) !== nextProps.store.getIn([curScreenId, 'data'])) {
      this.initOptions(nextProps);
    }
  }

  onChangeTimeType(data) {
    this.props.changeScreenQuery({ timeType: data.value });
    this.props.fetchScreenData();
  }

  onChangeView(data) {
    this.props.changeScreenQuery({ size: data.value });
    this.props.fetchScreenData();
  }

  onChangePage(data) {
    this.props.changeScreenQuery({ page: data });
    this.props.fetchScreenData();
  }

  initOptions(props) {
    const { store } = props;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);

    this.serverData = serverData;
    // this.flowOption = getFlowOption(serverData, store.getIn([curScreenId, 'query', 'timeType']));
  }

  render() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');

    return (
      <div>
        <AppScreen
          {...this.props}
          // listOptions={listOptions}
          initOption={{
            isFetchInfinite: true,
            fetchIntervalTime: 5000,
          }}
          // listTitle={_('Statistics Within 30 Seconds')}
        >
          <div className="t-overview">
            <div className="element t-overview__section-header">
              <h3>
                <span
                  style={{
                    marginRight: '10px',
                  }}
                >
                  {_('Time')}
                </span>
                <Select
                  options={timeTypeSwitchs.toJS()}
                  value={store.getIn([curScreenId, 'query', 'timeType'])}
                  onChange={this.onChangeTimeType}
                  clearable={false}
                />
                <FormGroup
                  type="select"
                  className="fr"
                  label={_('View')}
                  options={viewOptions.toJS()}
                  value={store.getIn([curScreenId, 'query', 'size'])}
                  onChange={this.onChangeView}
                />
              </h3>
            </div>
            <div className="t-overview__section">
              <Table
                className="table"
                options={listOptions}
                list={store.getIn([curScreenId, 'data', 'list'])}
                page={store.getIn([curScreenId, 'data', 'page'])}
                onPageChange={this.onChangePage}
              />
            </div>
          </div>
        </AppScreen>
      </div>
    );
  }
}

ProtoInfo.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtoInfo);
