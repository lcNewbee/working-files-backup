import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import immutable, { List, Map } from 'immutable';
import ListInfo from 'shared/components/Template/ListInfo';
import FormContainer from 'shared/components/Organism/FormContainer';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  noTitle: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
  route: PropTypes.object,
  initScreen: PropTypes.func,
  fetchScreenData: PropTypes.func,
  leaveScreen: PropTypes.func,
  validateAll: PropTypes.func,

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
};
const defaultProps = {

};

export default class AppScreen extends React.Component {
  constructor(props) {
    const { listOptions } = props;
    const initOption = {
      id: props.route.id,
      formUrl: props.route.formUrl,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
    };

    super(props);

    this.tableOptions = immutableUtils.getTableOptions(listOptions);
    this.editFormOptions = immutableUtils.getFormOptions(listOptions);
    this.defaultEditData = immutableUtils.getDefaultData(listOptions);

    if (this.defaultEditData) {
      initOption.defaultEditData = this.defaultEditData;
    }

    if (this.defaultQueryData) {
      initOption.query = this.defaultQueryData;
    }

    if (props.defaultSettingsData) {
      initOption.defaultSettingsData = props.defaultSettingsData;
    }

    // 需要对 groupid特处理
    if (typeof props.groupid !== 'undefined') {
      initOption.query = utils.extend({}, initOption.query, {
        groupid: props.groupid,
      });
      initOption.defaultEditData = utils.extend({}, initOption.defaultEditData, {
        groupid: props.groupid,
      });
      initOption.defaultSettingsData = utils.extend({}, initOption.defaultSettingsData, {
        groupid: props.groupid,
      });
    }

    this.initOption = initOption;
    this.selectedList = [];
  }
  componentWillMount() {
    this.props.initScreen(this.initOption);

    if (this.props.fetchScreenData) {
      this.props.fetchScreenData();
    }
  }
  componentWillUpdate(nextProps) {
    const nextListOptions = nextProps.listOptions;
    if (!immutable.is(nextListOptions, this.props.listOptions)) {
      this.tableOptions = immutableUtils.getTableOptions(nextListOptions);
      this.editFormOptions = immutableUtils.getFormOptions(nextListOptions);
      this.defaultEditData = immutableUtils.getDefaultData(nextListOptions);
    }
  }
  componentWillUnmount() {
    if (this.props.leaveScreen) {
      this.props.leaveScreen();
    }
  }

  onSaveSettings() {
    if (this.props.validateAll) {
      this.props.validateAll()
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.props.saveScreenSettings();
          }
        });
    }
  }

  render() {
    const {
      tableOptions, editFormOptions, defaultEditData,
    } = this;
    const {
      store, title, noTitle, route, listOptions, customSettingForm,
      settingsFormOptions, updateScreenSettings, hasSettingsSaveButton,
      ...commonProps
    } = this.props;
    const app = this.props.app;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const myTitle = title || route.text;
    const $$curSettings = $$myScreenStore.get('curSettings');
    const saveUrl = route.saveUrl || route.formUrl;
    const fetchUrl = route.fetchUrl || route.formUrl;

    // 数据未初始化不渲染
    if (myScreenId === 'base') {
      return null;
    }

    return (
      <div className="t-app-screen">
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
              isSaving={app.get('saving')}
              hasSaveButton={hasSettingsSaveButton}
            />
          ) : null
        }
        {
          listOptions ? (
            <ListInfo
              {...commonProps}
              tableOptions={tableOptions}
              editFormOptions={editFormOptions}
              defaultEditData={defaultEditData}
              store={$$myScreenStore}
              fetchUrl={fetchUrl}
              saveUrl={saveUrl}
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
