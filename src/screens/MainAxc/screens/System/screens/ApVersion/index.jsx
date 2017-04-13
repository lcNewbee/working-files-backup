import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'model',
    text: __('AP Model'),
    width: '120px',
    formProps: {
      type: 'select',
      required: true,
      notEditable: true,
    },
  }, {
    id: 'softVersion',
    text: __('Firmware Version'),
    defaultValue: '',
    formProps: {
      type: 'text',
      maxLength: '31',
      required: true,
      notEditable: true,
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'fileName',
    text: __('Firmware File'),
    defaultValue: '',
    formProps: {
      type: 'file',
      required: true,
      validator: validator({}),
    },
  }, {
    id: 'uploadPath',
    text: __('Firmware File'),
    defaultValue: '',
    noTable: true,
    formProps: {
      type: 'hidden',
    },
  }, {
    id: 'active',
    text: __('Active Status'),
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
  save: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
};
const defaultProps = {};
export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'getApModelList',
      'onBeforeAction',
      'onBeforeSave',
    ]);
    this.state = {
      updateModel: false,
    };
    this.myEditFormOptions = listOptions.mergeIn(
      [0, 'formProps'], {
        isLoading: true,
        placeholder: __('Loading'),
        options: [],
      },
    );
  }
  componentWillMount() {
    this.getApModelList();
  }
  onBeforeSave($$actionQuery, $$curListItem) {
    const actionType = $$actionQuery.getIn(['action']);
    let ret;

    if (actionType === 'add') {
      ret = this.props.save('goform/system/ap/version', $$actionQuery.merge($$curListItem).toJS())
        .then((json) => {
          const state = json && json.state;
          let newRet;
          if (state.code === 4000) {
            newRet = __("There's no active version of the model,it should be activated!");
          }

          return newRet;
        });
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
          updateModel: !this.state.updateModel,
        });
        this.myEditFormOptions = listOptions.mergeIn(
          [0, 'formProps'], {
            isLoading: false,
            placeholder: undefined,
            options,
          },
        );
      },
    );
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={this.myEditFormOptions}
        editFormOption={{
          hasFile: true,
        }}
        actionable
        selectable
        noTitle
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
