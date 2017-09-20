import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';


// custom
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'stamac',
    label: __('Client'),
    width: 200,
  }, {
    id: 'starttime',
    label: __('Occurrence Time'),
  }, {
    id: 'endtime',
    label: __('Departure Time'),
  }, {
    id: 'rssi',
    label: __('RSSI'),
  },
]);
const queryFormOptions = fromJS([
  {
    id: 'apmac',
    label: __('Location'),
    type: 'select',
    inputStyle: {
      minWidth: '160px',
    },
    searchable: true,
    saveOnChange: true,
    options: [],
  },
]);
const formOptions = fromJS([
  {
    id: 'enable',
    label: __('Enable'),
    type: 'checkbox',
    required: true,
  }, {
    id: 'reporttime',
    label: __('Data Report Time'),
    type: 'number',
    help: __('Seconds'),
    min: 0,
    defaultValue: 60,
    max: 65535,
    required: true,
  },
]);

const propTypes = {
  fetch: PropTypes.func,
  groupid: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isGetApList: false,
    };

    utils.binds(this, [
      'getApList',
    ]);
  }

  componentWillMount() {
    this.getApList(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.groupid !== this.props.groupid) {
      this.getApList(nextProps);
    }
  }

  getApList(props) {
    this.setState({
      isGetApList: true,
    });
    this.props.fetch('goform/group/aps', {
      page: 1,
      size: 5000,
      groupid: props.groupid,
    }).then(
      (json) => {
        if (json && json.data && json.data.list) {
          this.queryFormOptions = queryFormOptions.setIn([0, 'options'],
            json.data.list.map(
              item => ({
                label: item.devicename || item.mac,
                value: item.mac,
              }),
            ),
          );
        }
        this.setState({
          isGetApList: false,
        });
      },
    );
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        title={__('Settings')}
        listOptions={listOptions}
        listTitle={__('Clients Statistics')}
        settingsFormOptions={formOptions}
        queryFormOptions={this.queryFormOptions}
        paginationType="auto"
        noTitle={false}
        loading={this.state.isGetApList}
        hasSettingsSaveButton
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);

