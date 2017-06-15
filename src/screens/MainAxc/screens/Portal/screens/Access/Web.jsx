import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import { getActionable } from 'shared/axc';
import SaveButton from 'shared/components/Button/SaveButton';

import './web.scss';
/* eslint-disable quote-props */
const idToPageMap = {
  '1': '',
  '2': '/1',
  '3': '/2',
  '4': '/3',
  '5': '/4',
  '6': '/5',
  '7': '/6',
};
const idTownloadIdMap = {
  '1': '',
  '2': '1',
  '3': '2',
  '4': '3',
  '5': '4',
  '6': '5',
  '7': '6',
};
// const queryFormOptions = fromJS([
//   {
//     id: 'adv',
//     type: 'select',
//     label: __('Ads Page'),
//     options: [
//       {
//         value: '1',
//         label: 'OpenPortal',
//       },
//     ],
//     saveOnChange: true,
//   },
// ]);
const $$authOptions = fromJS([
  {
    value: '-100',
    label: __('ALL'),
  },
  {
    value: '0',
    label: __('One Key Authentication'),
  },
  {
    value: '1',
    label: __('Accessed User Authentication'),
  },
  // {
  //   value: '2',
  //   label: __('Radius Authentication'),
  // },
  // {
  //   value: '3',
  //   label: __('App Authentication'),
  // },
  {
    value: '4',
    label: __('SMS Authentication'),
  },
  {
    value: '5',
    label: __('Wechat Authentication'),
  },
  // {
  //   value: '6',
  //   label: __('Public Platform Authentication'),
  // },
  // {
  //   value: '7',
  //   label: __('Visitor Authentication'),
  // },
  {
    value: '9',
    label: __('Facebook Authentication'),
  },
]);
/* eslint-disable quote-props */
const idToAuthMap = {
  '3': '0',
  '4': '1',
  '5': '4',
  '6': '5',
  '7': '9',
};

const listOptions = fromJS([
  {
    id: 'id',
    text: __('ID'),
    width: '120px',
    noTable: true,
    formProps: {
      type: 'hidden',
      required: true,
    },
  }, {
    id: 'name',
    text: __('Name'),
    width: '120px',
    formProps: {
      type: 'text',
      maxLength: '129',
      required: true,
      notEditable: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
    render: val => __(val),
  },
  {
    id: 'description',
    text: __('Description'),
    width: '120px',
    formProps: {
      type: 'textarea',
      maxLength: '257',
      notEditable: true,
      validator: validator({
        rules: 'utf8Len:[0, 256]',
      }),
      rows: '3',
    },
    render: val => __(val),
  },
  {
    id: 'authentication',
    label: __('Supported Authentication'),
    options: $$authOptions,
    width: '120px',
    multi: false,
    formProps: {
      type: 'select',
      notEditable: true,
      multi: false,
      linkId: 'auths',
      initValue($$data) {
        let ret = $$data.get('authentication');

        if (!ret) {
          ret = idToAuthMap[$$data.get('id')] || '-100';
        }
        return ret;
      },
    },
    render: (val, $$data) => {
      const valArr = val ? val.split(',') : [idToAuthMap[$$data.get('id')] || ''];
      let ret = '';

      ret = valArr.map(
        (itemVal) => {
          let valRet = $$authOptions.find(
            $$myMap => $$myMap.get('value') === itemVal,
          );

          if (valRet) {
            valRet = valRet.get('label');
          }

          return valRet;
        },
      ).join(', ');

      return ret || '';
    },
  },
  {
    id: 'auths',
    formProps: {
      type: 'hidden',
    },
  },
  {
    id: 'url',
    label: __('Redirect URL'),
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'utf8Len:[0, 255]',
      }),
      visible: $$data => $$data.get('id') > 2,
    },
    render: (val, $$data) => {
      const id = $$data.get('id');
      let ret = val;

      // 所有认证 与 默认 项没有自己的重定向 URL
      if (id === '2' || id === '1') {
        ret = '-';
      }

      return ret;
    },
  },
  {
    id: 'sessiontime',
    label: __('Limit Connect Duration'),
    defaultValue: '0',
    formProps: {
      help: __('minutes(0 means no limitation)'),
      type: 'number',
      min: '0',
      max: '99999',
      validator: validator({
        rules: 'num:[0,99999]',
      }),
      visible: $$data => $$data.get('id') > 2 && $$data.get('id') !== '4',
    },
    render: (val, $$data) => {
      let ret = val;
      const id = $$data.get('id');

      if (val === '0' || val === 0) {
        ret = __('Limitless');
      } else if (val !== '-') {
        ret = `${ret} ${__('Minutes')}`;
      }

      if (id === '4' || id === '1' || id === '2') {
        ret = '-';
      }

      return ret;
    },
  },
  {
    id: 'adv',
    text: __('Ads Page'),
    width: '120px',
    noForm: true,
    noTable: true,
    options: [
      {
        value: '1',
        label: 'OpenPortal',
      },
    ],
    defaultValue: '1',
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'countShow',
    text: __('Show Times'),
    defaultValue: '150',
    noForm: true,
    noTable: true,
    formProps: {
      type: 'number',
      min: '0',
      max: '999999999',
      validator: validator({
        rules: 'num:[0,999999999]',
      }),
    },
  }, {
    id: 'countAuth',
    text: __('Click Times'),
    defaultValue: '100',
    noTable: true,
    noForm: true,
    type: 'number',
    formProps: {
      min: '0',
      max: '999999999',
      validator: validator({
        rules: 'num:[0,999999999]',
      }),
    },
  },
  {
    id: 'file',
    text: __('Template Zip File'),
    noTable: true,
    defaultValue: '',
    formProps: {
      type: 'file',
      //required: true,
    },
  }, {
    id: '__actions__',
    text: __('Actions'),
    noForm: true,
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
      'getAdsPage',
      'onBackup',
      'initListOptions',
    ]);
    this.actionable = getActionable(props);
    this.state = {
      advSelectPlaceholder: __('Loading'),
      advIsloading: true,
      advOptions: [],
    };
  }

  componentWillMount() {
    this.getAdsPage();
  }
  onBackup($$data) {
    if (this.actionable) {
      if (idTownloadIdMap[$$data.get('id')]) {
        window.location.href = `goform/portal/access/download/?id=${idTownloadIdMap[$$data.get('id')]}`;
      } else {
        window.location.href = 'goform/portal/access/download/';
      }
    }
  }
  getAdsPage() {
    this.props.fetch('goform/portal/access/web/webPage', {
      page: 1,
      size: 500,
    })
      .then((json) => {
        let options = [];

        if (json && json.data && json.data.list) {
          options = json.data.list.map(
            item => ({
              value: item.id,
              label: item.name,
            }),
          );
        }

        this.setState({
          advSelectPlaceholder: undefined,
          advIsloading: false,
          advOptions: options,
        });
      },
    );
  }
  initListOptions() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const $$curListItem = $$myScreenStore.getIn(['curListItem']);
    this.curListOptions = listOptions.setIn([-1, 'render'], (val, $$data) => (
      <span>
        <a
          className="tablelink"
          href={`http://${window.location.hostname}:8080${idToPageMap[$$data.get('id')]}/auth.jsp`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {__('Authentication')}
        </a>
        <a className="tablelink" href={`http://${window.location.hostname}:8080${idToPageMap[$$data.get('id')]}/ok.jsp?preview=1`} rel="noopener noreferrer" target="_blank">{__('Success')}</a>
        <a className="tablelink" href={`http://${window.location.hostname}:8080${idToPageMap[$$data.get('id')]}/out.jsp`} rel="noopener noreferrer" target="_blank">{__('Exit')}</a>
        <a
          className="tablelink"
          href={`http://${window.location.hostname}:8080${idToPageMap[$$data.get('id')]}/wx.jsp`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {__('Wechat')}
        </a>
        <SaveButton
          type="button"
          icon="download"
          text={__('')}
          theme="default"
          onClick={
            () => (this.onBackup($$data))
          }
          disabled={!this.actionable}
        />
      </span>
    ));

    if (actionType === 'edit' && $$curListItem.get('id') === '1') {
      this.curListOptions = this.curListOptions.map(
        ($$item) => {
          const id = $$item.get('id');
          let $$ret = $$item;

          if (id === 'authentication') {
            $$ret = $$ret.setIn(['formProps', 'notEditable'], false)
              .setIn(['multi'], true)
              .setIn(['formProps', 'multi'], true)
              .deleteIn(['options', 0]);
          }

          return $$ret;
        },
      );
    }

    return this.curListOptions;
  }
  render() {
    this.initListOptions();
    return (
      <AppScreen
        {...this.props}
        listOptions={this.curListOptions}
        editFormOption={{
          hasFile: true,
        }}
        noTitle
        actionable
        // searchable
        searchProps={{
          placeholder: `${__('Name')}`,
        }}
        deleteable={false}
        addable={false}
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
