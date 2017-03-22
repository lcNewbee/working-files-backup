import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

function getStoresName() {
  return utils.fetch('goform/portal/advertisement/stores')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.name,
          }),
        ),
      }
    ),
  );
}
const listOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  },
  {
    id: 'img',
    text: __('Adv Pitcture'),
    formProps: {
      type: 'file',
      required: true,
    },
  },
 {
    id: 'creatDate',
    text: __('Create Date'),
    defaultValue: '2018-2-28',
    formProps: {
      type: 'date',
      required: true,
    },
  }, {
    id: 'showDate',
    text: __('Show Date'),
    defaultValue: '2018-2-28',
    formProps: {
      type: 'date',
      required: true,
    },
  }, {
    id: 'endDate',
    text: __('End Date'),
    defaultValue: '2018-2-28',
    formProps: {
      type: 'date',
      required: true,
    },
  }, {
    id: 'state',
    text: __('Ads Release'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('No'),
      }, {
        value: '1',
        label: __('Yes'),
      },
    ],
  }, {
    id: 'showName',
    text: __('Show Name'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Hide'),
      }, {
        value: '1',
        label: __('Show'),
      },
    ],
  }, {
    id: 'showImage',
    text: __('Show Image'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Hide'),
      }, {
        value: '1',
        label: __('Show'),
      },
    ],
  }, {
    id: 'showInfo',
    text: __('Show Remarks'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Hide'),
      }, {
        value: '1',
        label: __('Show'),
      },
    ],
  }, {
    id: 'userName',
    text: __('User Name'),
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'showCount',
    text: __('Show Count'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'clickCount',
    text: __('Click Count'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'lockTime',
    text: __('Countdown'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'url',
    text: __('URL'),
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'pos',
    text: __('Sorting'),
    formProps: {
      type: 'text',
      required: true,
    },
  },
]);

const propTypes = {};
const defaultProps = {};

export default class AdvStores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameOptions: fromJS([]),
    };
  }
  componentWillMount() {
    getStoresName()
      .then((data) => {
        this.setState({
          storesNameOptions: fromJS(data.options),
        });
      });
  }
  render() {
    const curListOptions = listOptions
      .setIn([9, 'options'], this.state.storesNameOptions);
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        editFormOption={{
          hasFile: true,
        }}
        actionable
        selectable
      />
    );
  }
}

AdvStores.propTypes = propTypes;
AdvStores.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
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
)(AdvStores);
