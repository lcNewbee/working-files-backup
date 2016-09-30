import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormContainer from 'shared/components/Organism/FormContainer';

const propTypes = {
  title: PropTypes.string,
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,

  children: PropTypes.node,

  defaultQueryData: PropTypes.object,
  defaultSettingsData: PropTypes.object,
  formOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),

  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  onSave: PropTypes.func,
  changeSettingsQuery: PropTypes.func,
  updateItemSettings: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  leaveSettingsScreen: PropTypes.func,

  // 数据验证相关函数
  reportValidError: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  validateAll: PropTypes.func,

  noTitle: PropTypes.bool,
  hasSaveButton: PropTypes.bool,
};
const defaultProps = {
  hasSaveButton: true,
};

// 原生的 react 页面
class AppSettings extends React.Component {
  constructor(props) {
    const initOption = {
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
    };
    super(props);

    if (props.defaultQueryData) {
      initOption.query = props.defaultQueryData;
    }
    if (props.defaultSettingsData) {
      initOption.defaultData = props.defaultSettingsData;
    }

    props.initSettings(initOption);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.binds('handleChangeQuery', 'onPageChange', 'onSave', 'onCloseEditModal',
        'onChangeSearchText', 'onChangeType', 'onChangeTableSize', 'removeSelectItems');
  }

  componentWillMount() {
    const { fetchSettings } = this.props;

    if (fetchSettings) {
      fetchSettings();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt') &&
        this.props.fetchSettings) {
      this.fetchSettings();
    }
  }

  componentWillUnmount() {
    if (this.props.leaveSettingsScreen) {
      this.props.leaveSettingsScreen();
    }
  }
  onSave() {
    if (this.props.validateAll) {
      this.props.validateAll()
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            if (this.props.onSave) {
              this.props.onSave();
            } else {
              this.props.saveSettings();
            }
          }
        });
    } else if (this.props.onSave) {
      this.props.onSave();
    } else {
      this.props.saveSettings();
    }
  }
  binds(...methods) {
    methods.forEach((method) => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });
  }

  handleChangeQuery(data, needRefresh) {
    if (this.props.changeSettingsQuery) {
      this.props.changeSettingsQuery(data);
    }

    if (needRefresh && this.props.fetchSettings) {
      this.props.fetchSettings();
    }
  }

  render() {
    const {
      store, route, noTitle, app, title, formOptions,
      updateItemSettings, reportValidError, hasSaveButton,
    } = this.props;
    const mySettingId = store.get('curSettingId');
    const curData = this.props.store.getIn(['curData']).toJS();
    const query = store.getIn([mySettingId, 'query']);
    const saveUrl = route.saveUrl || route.formUrl;
    const fetchUrl = route.fetchUrl || route.formUrl;

    // 数据未初始化不渲染
    if (mySettingId === 'base') {
      return null;
    }

    return (
      <div className="t-settings">
        {
          noTitle ? null : (
            <h2 className="t-settings__title">{title || route.text}</h2>
          )
        }
        <FormContainer
          action={this.saveUrl}
          method="POST"
          data={curData}
          options={formOptions}
          isSaving={app.get('saving')}
          hasSaveButton={hasSaveButton}

          // Action function
          onSave={this.onSave}
          onChangeData={updateItemSettings}

          // Validate Props
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          onValidError={reportValidError}
        />
        {
          this.props.children
        }
      </div>
    );
  }
}

AppSettings.propTypes = propTypes;
AppSettings.defaultProps = defaultProps;

export default AppSettings;

