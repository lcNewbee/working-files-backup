import React, { PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

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
  }, {
    id: 'downbytes',
    text: _('Download Bytes'),
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
    this.props.initScreen({
      id: this.props.route.id,
      formUrl: this.props.route.formUrl,
      path: this.props.route.path,
      isFetchInfinite: true,
      fetchIntervalTime: 5000,
    });
  }

  componentWillMount() {
    this.props.fetchScreenData();
  }

  render() {
    return (
      <div>
        <AppScreen
          {...this.props}
          listOptions={listOptions}
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
