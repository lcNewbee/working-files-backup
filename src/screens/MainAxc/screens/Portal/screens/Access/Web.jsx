import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import { Icon, FormGroup, FormInput } from 'shared/components';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import { getActionable } from 'shared/axc';

import Preview from '../../components/Preview';

import './web.scss';

function generateClassName(id) {
  let clsName = '';
  switch (id) {
    case '0': clsName = 'dot-circle-o'; break;
    case '1': clsName = 'user'; break;
    case '4': clsName = 'envelope'; break;
    case '5': clsName = 'weixin'; break;
    case '9': clsName = 'facebook-official'; break;
    default:
  }
  return clsName;
}

function onBeforeSync($$actionQuery, $$curListItem) {
  const selectedLoginType = $$curListItem.get('auths');
  if (!selectedLoginType) return __('Please select at least one Login Type!');
  return '';
}
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
  // {
  //   value: '-100',
  //   label: __('ALL'),
  // },
  {
    value: '0',
    label: __('One Key Login'),
  },
  {
    value: '1',
    label: __('Accessed User Login'),
  },
  // {
  //   value: '2',
  //   label: __('Radius Login'),
  // },
  // {
  //   value: '3',
  //   label: __('App Login'),
  // },
  {
    value: '4',
    label: __('SMS Login'),
  },
  {
    value: '5',
    label: __('Wechat Login'),
  },
  // {
  //   value: '6',
  //   label: __('Public Platform Login'),
  // },
  // {
  //   value: '7',
  //   label: __('Visitor Login'),
  // },
  {
    value: '9',
    label: __('Facebook Login'),
  },
]);

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
  },
  {
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
    id: 'title',
    noTable: true,
    formProps: {
      type: 'text',
      label: __('Title'),
      required: true,
      validator: validator({
        rules: 'utf8Len:[0, 255]',
      }),
    },
  },
  {
    id: 'subTitle',
    noTable: true,
    formProps: {
      type: 'text',
      label: __('Sub Title'),
      required: true,
      validator: validator({
        rules: 'utf8Len:[0, 255]',
      }),
    },
  },
  {
    id: 'logo',
    noTable: true,
    formProps: {
      type: 'file',
      label: __('Logo'),
      required: true,
    },
  },
  {
    id: 'backgroundImg',
    noTable: true,
    formProps: {
      type: 'file',
      label: __('Background Image'),
      required: true,
    },
  },
  {
    id: 'copyright',
    noTable: true,
    formProps: {
      type: 'text',
      label: __('Copyright'),
    },
  },
  {
    id: 'copyrightUrl',
    noTable: true,
    formProps: {
      type: 'text',
      label: __('Copyright Link'),
    },
  },
  {
    id: 'auths',
    noTable: true,
    formProps: {
      type: 'hidden',
      initValue($$data) {
        const ret = $$data.get('authentication') || '';
        return ret;
      },
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
    },
    render: (val) => {
      // const id = $$data.get('id');
      let ret = val;

      if (!ret) ret = '-';
      return ret;
    },
  },
  {
    id: 'sessiontime',
    label: __('Limit Connect Duration'),
    formProps: {
      help: __('minutes(0 means no limitation)'),
      required: true,
      defaultValue: '0',
      type: 'number',
      min: '0',
      max: '99999',
      validator: validator({
        rules: 'num:[0,99999]',
      }),
      // visible: $$data => $$data.get('id') > 2 && $$data.get('id') !== '4',
    },
    render: (val) => {
      let ret = val;
      // const id = $$data.get('id');

      if (val === '0' || val === 0) {
        ret = __('Limitless');
      } else if (val !== '-') {
        ret = `${ret} ${__('Minutes')}`;
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
  },
  {
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
  },
  {
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
    id: 'description',
    text: __('Description'),
    width: '120px',
    formProps: {
      type: 'textarea',
      maxLength: '257',
      // notEditable: true,
      validator: validator({
        rules: 'utf8Len:[0, 256]',
      }),
      rows: '3',
    },
    render: (val) => {
      if (!val || typeof val === 'undefined') return '';
      const len = val.length;
      if (len > 43) {
        const desc = val.substring(0, 40);
        return <span title={val}>{`${desc}...`}</span>;
      }
      return <span>{val}</span>;
    },
  },
  // {
  //   id: 'file',
  //   text: __('Template Zip File'),
  //   noTable: true,
  //   defaultValue: '',
  //   formProps: {
  //     type: 'file',
  //     // required: true,
  //   },
  // },
  {
    id: 'authentication',
    label: __('Supported Login Types'),
    options: $$authOptions,
    width: '150px',
    multi: false,
    formProps: {
      type: 'select',
      // notEditable: true,
      required: true,
      multi: true,
      linkId: 'auths',
      initValue($$data) {
        let ret = $$data.get('authentication');

        if (!ret) {
          ret = ' ';
        }
        return ret;
      },
      render: (propsObj, listData) => {
        const valArr = listData.get('authentication') ? listData.get('authentication').split(',') : [];
        const validValArr = fromJS(valArr).filter(v => $$authOptions.find(item => item.get('value') === v));

        const changeIconStatus = (item) => {
          let newArr = validValArr;
          if (newArr.includes(item.get('value'))) {
            newArr = newArr.filter(v => item.get('value') !== v).toJS();
          } else {
            newArr = newArr.push(item.get('value')).toJS();
          }
          const newVal = newArr.join(',');
          propsObj.onChange({ value: newVal });
        };
        return (
          <div className="form-group">
            <label htmlFor="logintypes">{__(propsObj.label)}</label>
            <div id="logintypes" className="cols col-8 col-offset-2">
              {
                $$authOptions.map((item) => {
                  let clsName = '';
                  if (validValArr.includes(item.get('value'))) clsName = 'active';
                  return (
                    <div
                      className="cols col-2"
                      style={{ textAlign: 'center' }}
                      key={item.get('label')}
                      onClick={() => { changeIconStatus(item); }}
                    >
                      <Icon
                        name={`${generateClassName(item.get('value'))}`}
                        title={item.get('label')}
                        className={`web-login-icon-form ${generateClassName(item.get('value'))} ${clsName}`}
                      />
                      <div>
                        <input
                          type="radio"
                          checked={clsName === 'active'}
                        />
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        );
      },
    },
    render: (val) => {
      const valArr = val ? val.split(',') : [];
      const validValArr = fromJS(valArr).filter(v => $$authOptions.find(item => item.get('value') === v));
      return (
        <ul>
          {
            $$authOptions.map((item) => {
              let clsName = '';
              if (validValArr.includes(item.get('value'))) clsName = 'active';
              return (
                <Icon
                  name={`${generateClassName(item.get('value'))}`}
                  title={item.get('label')}
                  className={`web-login-icon ${generateClassName(item.get('value'))} ${clsName}`}
                  key={item.get('label')}
                />
              );
            }).toJS()
          }
        </ul>
      );
    },
  },
  {
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
      // 'onBackup',
      'onBeforeSync',
      'initListOptions',
    ]);
    this.actionable = getActionable(props);
    this.state = {
      advSelectPlaceholder: __('Loading'),
      advIsloading: true,
      advOptions: [],
      testType: 'out',
    };
  }

  componentWillMount() {
    this.getAdsPage();
  }
  // onBackup($$data) {
  //   if (this.actionable) {
  //     if (idTownloadIdMap[$$data.get('id')]) {
  //       window.location.href = `goform/portal/access/download/?id=${idTownloadIdMap[$$data.get('id')]}`;
  //     } else {
  //       window.location.href = 'goform/portal/access/download/';
  //     }
  //   }
  // }
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
          {__('Login')}
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
        {/* <SaveButton
          type="button"
          icon="download"
          text={__('')}
          theme="default"
          onClick={
            () => (this.onBackup($$data))
          }
          disabled={!this.actionable}
        />*/}
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
        modalSize="max"
        onBeforeSync={onBeforeSync}
        editFormOption={{
          hasFile: true,
        }}

        // searchable
        searchProps={{
          placeholder: `${__('Name')}`,
        }}
        deleteable={(item, index) => !(index === '0' || index === 0)}
        selectable={(item, index) => !(index === '0' || index === 0)}
        addable
        noTitle
        actionable
        noPagination
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
