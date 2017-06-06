import React from 'react';
import PropTypes from 'prop-types';
import immutable, { List, Map } from 'immutable';
import utils, { immutableUtils } from 'shared/utils';
import { getActionable } from 'shared/axc';
import Icon from 'shared/components/Icon';
import AppScreenList from './AppScreenList';
import AppScreenSettings from './AppScreenSettings';

function emptyFunc() { }

const loadingStyle = {
  position: 'absolute',
  top: '40%',
  marginTop: '-12px',
  marginLeft: '-12px',
  left: '50%',
  fontSize: '24px',
  color: '#0093DD',
};

const propTypes = {
  app: PropTypes.instanceOf(Map).isRequired,
  store: PropTypes.instanceOf(Map).isRequired,
  noTitle: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
  refreshInterval: PropTypes.string,
  className: PropTypes.string,
  actionable: PropTypes.bool,
  route: PropTypes.object,
  initOption: PropTypes.object,
  initScreen: PropTypes.func,
  fetchScreenData: PropTypes.func,
  leaveScreen: PropTypes.func,
  changeScreenActionQuery: PropTypes.func.isRequired,
  changeScreenQuery: PropTypes.func.isRequired,

  // List 相关属性list
  listOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List),
    PropTypes.array,
  ]),
  groupid: PropTypes.any,

  // Settings 相关属性
  settingsFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List),
    PropTypes.array,
  ]),
  customSettingForm: PropTypes.bool,
};
const defaultProps = {
  onAfterSync: emptyFunc,
  noTitle: true,
  groupid: 'not',

  // AppScreenList Option

  // Settings Form
  updateScreenSettings: emptyFunc,
  saveScreenSettings: emptyFunc,
  hasSettingsSaveButton: false,
  customSettingForm: false,
  settingOnlyChanged: false,

  settingsFormOptions: List([]),
};
function getLoadingStatus(props) {
  const { loading } = props;
  const $$store = props.store;
  const myScreenId = $$store.get('curScreenId');
  const $$myScreenStore = $$store.get(myScreenId);
  const $$myScreenDataList = $$myScreenStore.get('list');
  const $$myScreenDataSettings = $$myScreenStore.get('settings');
  let ret = loading;

  if (typeof loading === 'undefined') {
    ret = true;
    if (($$myScreenDataList && !$$myScreenDataList.isEmpty()) && ($$myScreenDataSettings &&
        !$$myScreenDataSettings.isEmpty())) {
      ret = false;
    }
  }

  return ret;
}
export default class AppScreen extends React.Component {
  constructor(props) {
    const {
      settingsFormOptions, listOptions,
      groupid,
    } = props;
    const initOption = utils.extend({
      id: props.route.id,
      formUrl: props.route.formUrl,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
      ajaxMode: props.route.mode,
    }, props.initOption);

    super(props);
    utils.binds(this, [
      'refreshListOptions',
      'fetchAppScreenData',
    ]);

    // init listOptions
    this.refreshListOptions(props);

    // init Settings Form
    if (settingsFormOptions) {
      // 依据 settingsFormOptions 来获取默认值
      this.defaultSettingsData = immutableUtils.getDefaultData(settingsFormOptions);
      this.settingsNumberKeys = immutableUtils.getNumberKeys(settingsFormOptions);
    }
    if (this.defaultSettingsData) {
      initOption.defaultSettingsData = utils.extend(
        {},
        this.defaultSettingsData,
        initOption.defaultSettingsData,
      );
    }

    // init list defaultData
    if (listOptions) {
      this.defaultEditData = immutableUtils.getDefaultData(listOptions);
    }

    if (this.defaultEditData) {
      initOption.defaultEditData = utils.extend(
        {},
        this.defaultEditData,
        initOption.defaultEditData,
      );
    }

    // 需要对 groupid特处理
    if (typeof groupid !== 'undefined') {
      initOption.query = utils.extend({}, initOption.query, {
        groupid,
      });
      initOption.actionQuery = utils.extend({}, initOption.actionQuery, {
        groupid,
      });
    }

    this.initOption = initOption;
    this.selectedList = [];
    this.state = {};
  }
  componentWillMount() {
    this.props.initScreen(this.initOption);
    this.actionable = getActionable(this.props);
  }
  componentDidMount() {
    this.fetchAppScreenData();
  }
  componentWillReceiveProps(nextProps) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$curScreenLoading = store.getIn([myScreenId, 'loading']);
    const $$nextScreenLoading = store.get([myScreenId, 'loading']);

    // 更新加载状态
    if ($$curScreenLoading !== $$nextScreenLoading) {
      this.setState({
        loading: getLoadingStatus(nextProps),
      });
    }
    if (nextProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.fetchAppScreenData(true);
    }
  }

  componentWillUpdate(nextProps) {
    const nextListOptions = nextProps.listOptions;
    const nextSettingOptions = nextProps.settingsFormOptions;

    if (!immutable.is(nextListOptions, this.props.listOptions)) {
      this.refreshListOptions(nextProps);
    }

    if (nextProps.actionable !== this.props.actionable) {
      this.actionable = getActionable(nextProps);
    }

    // 更新 Settings 相关配置，需要根系 默认数据
    if (!immutable.is(nextSettingOptions, this.props.settingsFormOptions)) {
      this.defaultSettingsData = utils.extend(
        {},
        immutableUtils.getDefaultData(nextSettingOptions),
        nextProps.initOption ? nextProps.initOption.defaultSettingsData : {},
      );

      this.props.updateScreen({
        defaultSettingsData: this.defaultSettingsData,
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.groupid !== prevProps.groupid) {
      this.props.changeScreenActionQuery({
        groupid: this.props.groupid,
      });
      this.props.changeScreenQuery({
        groupid: this.props.groupid,
      });
      if (this.props.groupid !== '') {
        this.fetchAppScreenData();
      }
    }
  }
  componentWillUnmount() {
    clearInterval(this.refreshTimer);
    if (this.props.leaveScreen) {
      this.props.leaveScreen(this.props.route.id);
    }
  }
  fetchAppScreenData(immediately) {
    const loaded = () => {
      clearTimeout(this.loadingTimeout);
      this.setState({
        loading: false,
      });
    };

    if (this.props.fetchScreenData) {
      // 当获取数据超过 200 ms 还没返回，显示加载中
      if (immediately) {
        this.setState({
          loading: true,
        });
      } else {
        this.loadingTimeout = setTimeout(() => {
          this.setState({
            loading: true,
          });
        }, 200);
      }


      // 默认非组管理界面，直接获取数据
      if (this.props.groupid === 'not') {
        this.props.fetchScreenData().then(loaded);

        // 组管理界面，需要获取当前组id才能获取数据
      } else if (this.props.groupid !== '') {
        this.props.fetchScreenData().then(loaded);
      } else {
        this.props.fetchScreenData().then(loaded);
      }

      if (this.props.refreshInterval) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = setInterval(
          () => this.fetchAppScreenData(),
          this.props.refreshInterval,
        );
      }
    }
  }
  refreshListOptions(props) {
    const { route, listOptions } = props;
    let thisListOptions = listOptions;

    if (route.funcConfig && route.funcConfig.listNotIds) {
      thisListOptions = thisListOptions.filterNot(
        $$item => route.funcConfig.listNotIds.indexOf($$item.get('id')) !== -1,
      );
    }

    this.tableOptions = immutableUtils.getTableOptions(thisListOptions);
    this.editFormOptions = immutableUtils.getFormOptions(thisListOptions);
  }

  render() {
    const {
      tableOptions, editFormOptions, defaultEditData,
    } = this;
    const {
      store, title, noTitle, route, listOptions, customSettingForm, className,
      settingsFormOptions,
      actionable,
    } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const myTitle = title || route.text;
    const saveUrl = route.saveUrl || route.formUrl;
    const fetchUrl = route.fetchUrl || route.formUrl;
    const myActionable = this.actionable && actionable;
    let screenClassName = 't-app-screen';

    // 数据未初始化不渲染
    if (myScreenId === 'base') {
      return null;
    }

    if (className) {
      screenClassName = `${screenClassName} ${className}`;
    }
    return (
      <div className={screenClassName}>
        {
          noTitle ? null : (
            <h2 className="t-app-screen__title">{myTitle}</h2>
          )
        }
        {
          settingsFormOptions && !customSettingForm ? (
            <AppScreenSettings
              {...this.props}
              store={$$myScreenStore}
              actionable={myActionable}
              fetchUrl={fetchUrl}
              saveUrl={saveUrl}
            />
          ) : null
        }
        {
          listOptions ? (
            <AppScreenList
              {...this.props}
              tableOptions={tableOptions}
              editFormOptions={editFormOptions}
              defaultEditData={defaultEditData}
              store={$$myScreenStore}
              fetchUrl={fetchUrl}
              saveUrl={saveUrl}
              actionable={myActionable}
              loading={this.state.loading}
            />
          ) : null
        }

        {
          this.props.children
        }
        {
          this.state.loading ? (
            <div style={loadingStyle}>
              <Icon name="spinner" spin />
            </div>
          ) : null
        }
      </div>
    );
  }
}

AppScreen.propTypes = propTypes;
AppScreen.defaultProps = defaultProps;
