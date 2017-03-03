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
    text: _('Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  },
  {
    id: 'img',
    text: _('Adv Pitcture'),
    formProps: {
      type: 'file',
      required: true,
    },
  },
 {
    id: 'creatDate',
    text: _('Create Date'),
    defaultValue: '2018-2-28',
    formProps: {
      type: 'date',
      required: true,
    },
  }, {
    id: 'showDate',
    text: _('Show Date'),
    defaultValue: '2018-2-28',
    formProps: {
      type: 'date',
      required: true,
    },
  }, {
    id: 'endDate',
    text: _('End Date'),
    defaultValue: '2018-2-28',
    formProps: {
      type: 'date',
      required: true,
    },
  }, {
    id: 'state',
    text: _('Ads Release'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('No'),
      }, {
        value: '1',
        label: _('Yes'),
      },
    ],
  }, {
    id: 'showName',
    text: _('Show Name'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Hide'),
      }, {
        value: '1',
        label: _('Show'),
      },
    ],
  }, {
    id: 'showImage',
    text: _('Show Image'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Hide'),
      }, {
        value: '1',
        label: _('Show'),
      },
    ],
  }, {
    id: 'showInfo',
    text: _('Show Remarks'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Hide'),
      }, {
        value: '1',
        label: _('Show'),
      },
    ],
  }, {
    id: 'userName',
    text: _('User Name'),
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'showCount',
    text: _('Show Count'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'clickCount',
    text: _('Click Count'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'lockTime',
    text: _('Countdown'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'url',
    text: _('URL'),
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'pos',
    text: _('Sorting'),
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
