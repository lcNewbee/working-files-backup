import React from 'react';
import PropTypes from 'prop-types';
import immutable, { List, Map } from 'immutable';
import utils, { immutableUtils } from 'shared/utils';
import { getActionable } from 'shared/axc';
import { ProcessContainer } from 'shared/components';
import AppScreenList from './AppScreenList';
import AppScreenSettings from './AppScreenSettings';

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

const propTypes = {
  app: PropTypes.instanceOf(Map).isRequired,
  store: PropTypes.instanceOf(Map).isRequired,
  noTitle: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
  refreshInterval: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  actionable: PropTypes.bool,
  route: PropTypes.object,
  initOption: PropTypes.object,
  initScreen: PropTypes.func,
  fetchScreenData: PropTypes.func,
  leaveScreen: PropTypes.func,
  changeScreenActionQuery: PropTypes.func.isRequired,
  changeScreenQuery: PropTypes.func.isRequired,
  updateScreen: PropTypes.func,
  loading: PropTypes.bool,
  noLoading: PropTypes.bool,
  initNoFetch: PropTypes.bool,

  // List 相关属性list
  listOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List),
    PropTypes.array,
  ]),
  listId: PropTypes.string,
  groupid: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  // Settings 相关属性
  settingsFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List),
    PropTypes.array,
  ]),
  customSettingForm: PropTypes.bool,
};
const defaultProps = {
  onAfterSync: utils.noop,
  noTitle: true,
  groupid: 'not',

  // AppScreenList Option

  // Settings Form
  updateScreenSettings: utils.noop,
  saveScreenSettings: utils.noop,
  hasSettingsSaveButton: false,
  customSettingForm: false,
  settingOnlyChanged: false,
};

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
      this.defaultSettings = immutableUtils.getDefaultData(settingsFormOptions);
      this.settingsNumberKeys = immutableUtils.getNumberKeys(settingsFormOptions);
    }
    if (this.defaultSettings) {
      initOption.defaultSettings = utils.extend(
        this.defaultSettings,
        initOption.defaultSettings,
      );
    }

    // init list defaultData
    if (listOptions) {
      this.defaultListItem = immutableUtils.getDefaultData(listOptions);
    }

    if (this.defaultListItem) {
      initOption.defaultListItem = utils.extend(
        this.defaultListItem,
        initOption.defaultListItem,
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
    if (typeof props.loading !== 'undefined') {
      this.state.loading = props.loading;
    }
  }
  componentWillMount() {
    this.props.initScreen(this.initOption);
    this.actionable = getActionable(this.props);
  }
  componentDidMount() {
    if (!this.props.initNoFetch) {
      this.fetchAppScreenData();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$curScreenLoading = store.getIn([myScreenId, 'loading']);
    const $$nextScreenLoading = store.getIn([myScreenId, 'loading']);
    const nextLoading = nextProps.loading;

    if (nextLoading !== this.state.loading) {
      this.setState({
        loading: nextLoading,
      });
    } else if ($$curScreenLoading !== $$nextScreenLoading) {
      // 更新加载状态
      if ($$curScreenLoading !== $$nextScreenLoading) {
        this.setState({
          loading: getLoadingStatus(nextProps),
        });
      }
    }

    if (nextProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.fetchAppScreenData();
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
      this.defaultSettings = utils.extend(
        {},
        immutableUtils.getDefaultData(nextSettingOptions),
        nextProps.initOption ? nextProps.initOption.defaultSettings : {},
      );

      this.props.updateScreen({
        defaultSettings: this.defaultSettings,
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
  fetchAppScreenData() {
    const loaded = () => {
      clearTimeout(this.loadingTimeout);

      if (!this.props.loading) {
        this.setState({
          loading: false,
        });
      }
    };

    if (this.props.fetchScreenData) {
      this.setState({
        loading: true,
      });

      this.props.fetchScreenData().then(loaded);

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
      tableOptions, editFormOptions, defaultListItem,
    } = this;
    const {
      store, title, noTitle, route, listOptions, customSettingForm, className,
      settingsFormOptions, listId,
      actionable, noLoading,
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
      <ProcessContainer
        className={screenClassName}
        loading={!noLoading && this.state.loading}
        delay={600}
        forceLoadingTime={1200}
        style={{
          height: '100%',
        }}
      >
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
              defaultListItem={defaultListItem}
              id={listId}
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
      </ProcessContainer>
    );
  }
}

AppScreen.propTypes = propTypes;
AppScreen.defaultProps = defaultProps;
