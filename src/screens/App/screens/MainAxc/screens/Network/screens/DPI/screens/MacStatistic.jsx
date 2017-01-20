import React, { PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

const flowRateFilter = utils.filter('flowRate');
const propTypes = fromJS({
  route: PropTypes.object,
  initScreen: PropTypes.func,
});

const listOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC'),
  }, {
    id: 'ip',
    text: _('IP'),
  }, {
    id: 'flow_num',
    text: _('Flow Num'),
  }, {
    id: 'upbytes',
    text: _('Upload Bytes'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return flowRateFilter.transform(val / 1024);
    },
  }, {
    id: 'downbytes',
    text: _('Download Bytes'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return flowRateFilter.transform(val / 1024);
    },
  }, {
    id: 'uppackets',
    text: _('Upload Packets'),
  }, {
    id: 'downpackets',
    text: _('Download Packets'),
  },
]);


export default class MacStatistic extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <AppScreen
          {...this.props}
          listOptions={listOptions}
          initOption={{
            isFetchInfinite: true,
            fetchIntervalTime: 5000,
          }}
        />
      </div>
    );
  }
}

MacStatistic.propTypes = propTypes;

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
)(MacStatistic);
