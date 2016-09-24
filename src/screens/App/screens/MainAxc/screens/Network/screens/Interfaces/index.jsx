import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import {
  ListInfo,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

function getPortList() {
  return utils.fetch('goform/network/port')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.name,
            label: item.name,
          })
        ),
      }
    )
  );
}

const screenOptions = fromJS([
  {
    id: 'name',
    text: _('Port Name'),
    formProps: {
      type: 'select',
      required: true,
      loadOptions: getPortList,
      isAsync: true,
    },
  }, {
    id: 'ip',
    text: _('IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask',
    text: _('Mask'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'mask',
      }),
    },
  },
]);
const tableOptions = immutableUtils.getTableOptions(screenOptions);
const editFormOptions = immutableUtils.getFormOptions(screenOptions);
const defaultEditData = immutableUtils.getDefaultData(screenOptions);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log(json);
        }
      });
  }

  render() {
    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        editFormOptions={editFormOptions}
        defaultEditData={defaultEditData}
        actionable
        selectable
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
