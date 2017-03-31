import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import './web.scss';

const queryFormOptions = fromJS([
  {
    id: 'adv',
    type: 'select',
    label: __('Ads Page'),
    options: [
      {
        value: '1',
        label: 'OpenPortal',
      },
    ],
    saveOnChange: true,
  },
]);

const listOptions = fromJS([
  {
    id: 'id',
    text: __('ID'),
    width: '120px',
    noTable: true,
    noForm: true,
    formProps: {
      type: 'text',
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
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'adv',
    text: __('Ads Page'),
    width: '120px',
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
    type: 'number',
    formProps: {
      min: '0',
      max: '999999999',
      validator: validator({
        rules: 'num:[0,999999999]',
      }),
    },
  }, {
    id: 'description',
    text: __('Description'),
    formProps: {
      type: 'textarea',
      maxLength: '257',
      validator: validator({
        rules: 'utf8Len:[0, 256]',
      }),
    },
  }, {
    id: 'file',
    text: __('Template Zip File'),
    noTable: true,
    defaultValue: '',
    formProps: {
      type: 'file',
      required: true,
    },
  }, {
    id: '__actions__',
    text: __('Actions'),
    noForm: true,
    transform(val, $$item) {
      return (
        <span>
          <a className="tablelink" href={`http://${window.location.hostname}:8080/${$$item.get('id')}/auth.jsp`} target="_blank">{__('Auth')}</a>
          <a className="tablelink" href={`http://${window.location.hostname}:8080/${$$item.get('id')}/ok.jsp`}  target="_blank">{__('Success')}</a>
          <a className="tablelink" href={`http://${window.location.hostname}:8080/${$$item.get('id')}/out.jsp`} target="_blank">{__('Exit')}</a>
          <a
            className="tablelink"
            href={`http://${window.location.hostname}:8080/${$$item.get('id')}/wx.jsp`}
            target="_blank"
          >
            {__('Wechat')}
          </a>
        </span>
      );
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
      'getAdsPage',
    ]);
    this.state = {
      advSelectPlaceholder: __('Loading'),
      advIsloading: true,
      advOptions: [],
    };
  }
  componentWillMount() {
    this.getAdsPage();
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
  render() {
    const { advOptions, advIsloading, advSelectPlaceholder } = this.state;
    const myEditFormOptions = listOptions.mergeIn(
      [2, 'formProps'], {
        isLoading: advIsloading,
        options: advOptions,
        placeholder: advSelectPlaceholder,
      },
    );
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        editFormOption={{
          hasFile: true,
        }}
        noTitle
        actionable
        selectable
        searchable
        searchProps={{
          placeholder: `${__('Name')}`,
        }}
        queryFormOptions={queryFormOptions}
        deleteable={
          ($$item, index) => (index !== 0)
        }
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
