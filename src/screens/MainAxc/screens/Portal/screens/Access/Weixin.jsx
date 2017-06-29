import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import { FormContainer } from 'shared/components';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const uptimeFilter = utils.filter('connectTime');

const listOptions = fromJS([
  {
    id: 'basip',
    text: __('Bas IP'),
    defaultValue: '',
    width: '120px',
    noTable: true,
    formProps: {
      type: 'hidden',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  },
  {
    id: 'ssid',
    text: __('SSID'),
    width: '120px',
    options: [],
    formProps: {
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]|remarkTxt:["\'\\\\"]',
      }),
    },
  }, {
    id: 'shopId',
    text: __('Shop ID'),
    formProps: {
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 129]',
      }),
    },
  }, {
    id: 'appId',
    text: __('App ID'),
    formProps: {
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'domain',
    text: __('Domain'),
    noTable: true,
    formProps: {
      noAdd: true,
      notEditable: true,
      type: 'hidden',
      maxLength: '129',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'outTime',
    text: __('Out Time'),
    help: __('Second'),
    noTable: true,
    formProps: {
      notEditable: true,
      help: __('Second'),
      noAdd: true,
      min: '0',
      max: '99999999',
      type: 'hidden',
      validator: validator({
        rules: 'num:[0,999999999]',
      }),
      required: true,
    },
    render(val) {
      return uptimeFilter.transform(val);
    },
  }, {
    id: 'secretKey',
    text: __('Secret Key'),
    noTable: true,
    formProps: {
      type: 'password',
      required: true,
      maxLength: '129',
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'qrcode',
    text: __('QR Code'),
    formProps: {
      type: 'file',
      name: 'qrcode',
      accept: '.jpg, .png, .gif',
    },
  },
  {
    id: 'id',
    text: __('ID'),
    formProps: {
      type: 'hidden',
    },
  },
]);
const $$formOptions = utils.immutableUtils.getFormOptions(listOptions);
const defaultData = utils.immutableUtils.getDefaultData(listOptions);

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
  editListItemByIndex: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  reportValidError: PropTypes.func,
  validateAll: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(prevProps) {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const thisData = store.getIn([curScreenId, 'data']);
    const prevData = prevProps.store.getIn([curScreenId, 'data']);

    if (thisData !== prevData) {
      this.props.editListItemByIndex(0);
    }
  }
  render() {
    const { store, app } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$formData = store.getIn([curScreenId, 'curListItem']);
    const $$myFormOptions = $$formOptions.push(fromJS({
      id: 'action',
      type: 'hidden',
      value: store.getIn([curScreenId, 'actionQuery', 'action']),
    }));

    return (
      <AppScreen
        {...this.props}
        noTitle
        initOption={{
          defaultEditData: defaultData,
        }}
        deleteable={
          ($$item, index) => (index !== 0)
        }
        actionable
        selectable
        searchable
        searchProps={{
          placeholder: `${__('Bas IP')}/SSID`,
        }}
      >
        <FormContainer
          id="weixinForm"
          action="goform/portal/access/weixin"
          method="POST"
          component="form"
          options={$$myFormOptions}
          data={$$formData}
          onChangeData={($$data) => {
            this.props.updateCurEditListItem($$data);
          }}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          onValidError={this.props.reportValidError}
          isSaving={app.get('saving')}
          onSave={() => {
            this.props.validateAll()
              .then(($$msg) => {
                if ($$msg.isEmpty()) {
                  this.props.saveFile('goform/portal/access/weixin', document.getElementById('weixinForm'));
                }
              });
          }}
          hasSaveButton
          hasFile
        />
      </AppScreen>
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
