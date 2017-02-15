import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import './web.scss';


const listOptions = fromJS([
  {
    id: 'id',
    text: _('ID'),
    width: '120px',
    noTable: true,
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'name',
    text: _('Name'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'adv',
    text: _('Ads Page'),
    width: '120px',
    options: [],
    defaultValue: '1',
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'countShow',
    text: _('Show Times'),
    defaultValue: '',
    formProps: {
      type: 'number',
    },
  }, {
    id: 'countAuth',
    text: _('Click Times'),
    defaultValue: '',
    formProps: {
      type: 'text',
    },
  }, {
    id: 'description',
    text: _('Description'),
    defaultValue: '',
    formProps: {
      type: 'text',
    },
  }, {
    id: 'file',
    text: _('Template Zip File'),
    noTable: true,
    defaultValue: '',
    formProps: {
      type: 'file',
      required: true,
    },
  }, {
    id: '__actions__',
    text: _('Actions'),
    transform(val, $$item) {
      return (
        <span>
          <a className="tablelink" href="/1/auth.jsp" target="_blank">认证页</a>
          <a className="tablelink" href="/1/ok.jsp"  target="_blank">成功页</a>
          <a className="tablelink" href="/1/out.jsp" target="_blank">退出页</a>
          <a className="tablelink" href="/1/wx.jsp" target="_blank">微信页</a>
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
      advSelectPlaceholder: _('Loading'),
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
        listOptions={myEditFormOptions}
        editFormOption={{
          hasFile: true,
        }}
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
