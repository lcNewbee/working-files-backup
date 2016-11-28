import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'model',
    text: _('AP Model'),
    width: '120px',
    formProps: {
      type: 'select',
      required: true,
      notEditable: true,
    },
  }, {
    id: 'softVersion',
    text: _('Soft Version'),
    defaultValue: '',
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
      notEditable: true,
      validator: validator({}),
    },
  }, {
    id: 'versionFile',
    text: _('Version File'),
    noTable: true,
    defaultValue: '',
    formProps: {
      type: 'file',
      required: true,
      validator: validator({}),
    },
  }, {
    id: 'active',
    text: _('Active Status'),
    actionName: 'active',
    type: 'switch',
    width: '100px',
    formProps: {
      type: 'checkbox',
      value: 1,
    },
  },
]);
const propTypes = {
  store: PropTypes.instanceOf(Map),
  fetch: PropTypes.func,
};
const defaultProps = {};
export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'getApModelList',
      'onBeforeAction',
    ]);
    this.state = {
      modelSelectPlaceholder: _('Loading'),
      modelIsloading: true,
      modelOptions: [],
    };
  }
  componentWillMount() {
    this.getApModelList();
  }

  onBeforeAction($$actionQuery) {
    const store = this.props.store;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const actionType = $$actionQuery.getIn(['action']);
    let ret = '';
    if (actionType === 'active' && parseInt($$actionQuery.get('active'), 10) === 0) {
      ret = _('You should activate another version before deactivating this version');
    // 删除已激活版本
    } else if (actionType === 'delete' && parseInt($$actionQuery.get('active'), 10) === 1) {
      ret = _('You can not delete active version');
    }

    return ret;
  }
  getApModelList() {
    this.props.fetch('goform/system/ap/model', {
      page: 1,
      size: 500,
    })
      .then((json) => {
        let options = [];

        if (json && json.data && json.data.list) {
          options = json.data.list.map(
            item => ({
              value: item.name,
              label: item.name,
            }),
          );
        }

        this.setState({
          modelSelectPlaceholder: undefined,
          modelIsloading: false,
          modelOptions: options,
        });
      },
    );
  }
  render() {
    const { modelIsloading, modelOptions, modelSelectPlaceholder } = this.state;
    const myEditFormOptions = listOptions.mergeIn(
      [0, 'formProps'], {
        isLoading: modelIsloading,
        options: modelOptions,
        placeholder: modelSelectPlaceholder,
      },
    );
    return (
      <AppScreen
        {...this.props}
        listOptions={myEditFormOptions}
        editFormOption={{
          hasFile: true,
        }}
        onBeforeAction={this.onBeforeAction}
        noTitle
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
    screenActions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
