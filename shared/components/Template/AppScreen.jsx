import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import immutable, { List, Map, fromJS } from 'immutable';
import ListInfo from 'shared/components/Template/ListInfo';
import { purviewOptions } from 'shared/config/axc';
import FormContainer from 'shared/components/Organism/FormContainer';

function emptyFunc() {}

const propTypes = {
  app: PropTypes.instanceOf(Map).isRequired,
  store: PropTypes.instanceOf(Map).isRequired,
  defaultEditData: PropTypes.object,
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
  validateAll: PropTypes.func,
  reportValidError: PropTypes.func,
  changeScreenActionQuery: PropTypes.func.isRequired,
  changeScreenQuery: PropTypes.func.isRequired,

  // List 相关属性
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
  updateScreenSettings: PropTypes.func,
  saveScreenSettings: PropTypes.func,
  defaultSettingsData: PropTypes.object,
  hasSettingsSaveButton: PropTypes.bool,
  customSettingForm: PropTypes.bool,

  onAfterSync: PropTypes.func,
};
const defaultProps = {
  onAfterSync: emptyFunc,

  // ListInfo Option
  groupid: '',
  listOptions: [],

  // Settings Form
  updateScreenSettings: emptyFunc,
  saveScreenSettings: emptyFunc,
  defaultSettingsData: {},
  hasSettingsSaveButton: false,
  customSettingForm: false,

  settingsFormOptions: [],
};

export default class AppScreen extends React.Component {
  constructor(props) {
    const {
      listOptions, defaultSettingsData, settingsFormOptions,
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

    // init listOptions
    this.tableOptions = immutableUtils.getTableOptions(listOptions);
    this.editFormOptions = immutableUtils.getFormOptions(listOptions);
    this.defaultEditData = props.defaultEditData || immutableUtils.getDefaultData(listOptions);

    // init Settings Form
    this.defaultSettingsData = defaultSettingsData ||
        immutableUtils.getDefaultData(settingsFormOptions);
    this.settingsNumberKeys = immutableUtils.getNumberKeys(settingsFormOptions);

    if (this.defaultEditData) {
      initOption.defaultEditData = this.defaultEditData;
    }

    if (this.defaultQueryData) {
      initOption.query = this.defaultQueryData;
    }

    if (this.defaultSettingsData) {
      initOption.defaultSettingsData = this.defaultSettingsData;
    }

    // 需要对 groupid特处理
    if (typeof groupid !== 'undefined') {
      initOption.query = utils.extend({}, initOption.query, {
        groupid,
      });
      initOption.actionQuery = utils.extend({}, initOption.actionQuery, {
        groupid,
      });
      initOption.defaultEditData = utils.extend({}, initOption.defaultEditData, {
        groupid,
      });
      initOption.defaultSettingsData = utils.extend({}, initOption.defaultSettingsData, {
        groupid,
      });
    }

    this.initOption = initOption;
    this.selectedList = [];

    utils.binds(this, [
      'onSaveSettings',
      'getActionable',
    ]);
  }
  componentWillMount() {
    this.props.initScreen(this.initOption);
  }
  componentDidMount() {
    if (this.props.fetchScreenData) {
      this.props.fetchScreenData();

      if (this.props.refreshInterval) {
        this.refreshTimer = setInterval(
          () => this.props.fetchScreenData(),
          this.props.refreshInterval,
        );
      }
    }
  }
  componentWillUpdate(nextProps) {
    const nextListOptions = nextProps.listOptions;
    const nextSettingOptions = nextProps.settingsFormOptions;

    if (!immutable.is(nextListOptions, this.props.listOptions)) {
      this.tableOptions = immutableUtils.getTableOptions(nextListOptions);
      this.editFormOptions = immutableUtils.getFormOptions(nextListOptions);
      this.defaultEditData = immutableUtils.getDefaultData(nextListOptions);
    }

    if (!immutable.is(nextSettingOptions, this.props.settingsFormOptions)) {
      this.defaultSettingsData = immutableUtils.getDefaultData(nextSettingOptions);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchScreenData();
    }

    if (this.props.groupid !== prevProps.groupid) {
      this.props.changeScreenActionQuery({
        groupid: this.props.groupid,
      });
      this.props.changeScreenQuery({
        groupid: this.props.groupid,
      });
      this.props.fetchScreenData();
    }
  }
  componentWillUnmount() {
    clearInterval(this.refreshTimer);
    if (this.props.leaveScreen) {
      this.props.leaveScreen();
    }
  }

  onSaveSettings() {
    if (this.props.validateAll) {
      this.props.validateAll()
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.props.saveScreenSettings({
              numberKeys: this.settingsNumberKeys,
            }).then(
              (json) => {
                this.props.onAfterSync(json, {
                  action: 'setting',
                });
              },
            );
          }
        });
    }
  }

  getActionable() {
    const purview = this.props.app.getIn(['login', 'purview']);
    const userType = this.props.app.getIn(['login', 'usertype']);
    const $$purviewList = fromJS(purview.split(','));
    const curModule = this.props.route.path.split('/')[2];
    let curModuleVal = fromJS(purviewOptions).find(
      $$item => $$item.get('module') === curModule,
    );
    let ret = false;

    // 当前模块
    if (curModuleVal) {
      curModuleVal = curModuleVal.get('value') || '';
    }

    // admin 或者 分支权限 all的管理员
    if (purview === 'all' || userType === 0) {
      ret = true;

    // 只读管理员
    } else if (userType === 2) {
      ret = false;

    // 分支管理员
    } else {
      $$purviewList.forEach(
        (val, i) => {
          let moduleRet = i;

          if (curModuleVal === val) {
            moduleRet = false;
            ret = true;
          }

          return moduleRet;
        },
      );
    }

    return ret;
  }

  render() {
    const {
      tableOptions, editFormOptions, defaultEditData,
    } = this;
    const {
      store, title, noTitle, route, listOptions, customSettingForm, className,
      settingsFormOptions, updateScreenSettings, hasSettingsSaveButton, actionable,
    } = this.props;
    const app = this.props.app;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const myTitle = title || route.text;
    const $$curSettings = $$myScreenStore.get('curSettings');
    const saveUrl = route.saveUrl || route.formUrl;
    const fetchUrl = route.fetchUrl || route.formUrl;
    const myActionable = this.getActionable() && actionable;
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
            <FormContainer
              options={settingsFormOptions}
              data={$$curSettings}
              onChangeData={updateScreenSettings}
              onSave={this.onSaveSettings}
              invalidMsg={app.get('invalid')}
              validateAt={app.get('validateAt')}
              onValidError={this.props.reportValidError}
              isSaving={app.get('saving')}
              hasSaveButton={this.getActionable() && hasSettingsSaveButton}
            />
          ) : null
        }
        {
          listOptions ? (
            <ListInfo
              {...this.props}
              tableOptions={tableOptions}
              editFormOptions={editFormOptions}
              defaultEditData={defaultEditData}
              store={$$myScreenStore}
              fetchUrl={fetchUrl}
              saveUrl={saveUrl}
              actionable={myActionable}
            />
          ) : null
        }

        {
          this.props.children
        }

      </div>
    );
  }
}

AppScreen.propTypes = propTypes;
AppScreen.defaultProps = defaultProps;
