import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import FormContainer from 'shared/components/Organism/FormContainer';
import utils from 'shared/utils';

const propTypes = {
  app: PropTypes.instanceOf(Map).isRequired,
  store: PropTypes.instanceOf(Map),

  settingsFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),

  changeScreenActionQuery: PropTypes.func,
  createModal: PropTypes.func,

  // 数据操作相关函数
  updateScreenSettings: PropTypes.func,
  saveScreenSettings: PropTypes.func,

  // 数据验证前调用的函数，
  // 可用于修改要保存数据
  onBeforeSave: PropTypes.func,

  // 向后台同步数据前后所调用的函数
  // 用于自定义数据验证入口
  onBeforeSync: PropTypes.func,
  onAfterSync: PropTypes.func,

  // 数据验证相关函数
  reportValidError: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  validateAll: PropTypes.func,

  settingOnlyChanged: PropTypes.bool,
  hasSettingsSaveButton: PropTypes.bool,
  actionable: PropTypes.bool,
};
const defaultProps = {
  hasSaveButton: true,
  updateScreenSettings: utils.emptyFunc,
  resetVaildateMsg: utils.emptyFunc,
  createModal: (option) => {
    if (option && option.text) {
      alert(`${option.id}: ${option.text}`);
    }
  },
};

// 原生的 react 页面
class AppSettings extends React.PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onSaveSettings',
      'onChangeSettingsData',
      'onBeforeSaveSettings',
      'onBeforeSync',
      'onSyncData',
    ]);
  }
  componentWillUnmount() {
    this.props.resetVaildateMsg();
  }
  onSyncData() {
    this.props.saveScreenSettings({
      numberKeys: this.settingsNumberKeys,
      onlyChanged: this.props.settingOnlyChanged,
    }).then(
      (json) => {
        this.props.onAfterSync(json, {
          action: 'setting',
        });
      },
    );
  }
  onBeforeSync(callback) {
    const { onBeforeSync, store } = this.props;
    const $$actionQuery = store.get('actionQuery');
    const $$curSettings = store.get('curSettings');
    const retOption = {};
    let onBeforeSyncResult = '';

    if (onBeforeSync) {
      onBeforeSyncResult = onBeforeSync($$actionQuery, $$curSettings);
    }

    if (utils.isPromise(onBeforeSyncResult)) {
      onBeforeSyncResult.then(
          (msg) => {
            retOption.msg = msg;
            callback(retOption);
          },
        );
    } else {
      if (onBeforeSyncResult) {
        retOption.msg = onBeforeSyncResult;
      }

      callback(retOption);
    }
  }
  onBeforeSaveSettings(option) {
    if (option && option.msg) {
      this.props.createModal({
        id: 'saveSettings',
        role: 'alert',
        text: option.msg,
      });
    } else if (this.props.validateAll) {
      this.props.changeScreenActionQuery({
        action: 'setting',
      });
      this.props.validateAll()
          .then((errMsg) => {
            if (errMsg.isEmpty()) {
              this.onBeforeSync((retOption) => {
                if (retOption.msg) {
                  this.props.createModal({
                    id: 'saveSettings',
                    role: 'alert',
                    text: retOption.msg,
                  });
                } else {
                  this.onSyncData();
                }
              });
            }
          });
    }
  }
  onSaveSettings(formElem, hasFile) {
    const { onBeforeSave, store } = this.props;
    const $$actionQuery = store.get('actionQuery');
    const $$curSettings = store.get('curSettings');
    const saveOption = {
      formElem,
      hasFile,
    };
    let onBeforeSaveResult = '';

    if (onBeforeSave) {
      onBeforeSaveResult = onBeforeSave($$actionQuery, $$curSettings);
    }

    if (utils.isPromise(onBeforeSaveResult)) {
      onBeforeSaveResult.then(
          (msg) => {
            saveOption.msg = msg;
            this.onBeforeSaveSettings(saveOption);
          },
        );
    } else {
      if (onBeforeSaveResult) {
        saveOption.msg = onBeforeSaveResult;
      }

      this.onBeforeSaveSettings(saveOption);
    }
  }

  onChangeSettingsData(data) {
    this.props.updateScreenSettings(data);
  }

  render() {
    const {
      app,
      store,
      settingsFormOptions,
      actionable,
      hasSettingsSaveButton,
    } = this.props;
    const $$curSettings = store.get('curSettings');

    return (
      <div className="t-settings">
        <FormContainer
          options={settingsFormOptions}
          data={$$curSettings}
          onChangeData={this.onChangeSettingsData}
          onSave={this.onSaveSettings}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          onValidError={this.props.reportValidError}
          isSaving={app.get('saving')}
          actionable={actionable}
          hasSaveButton={hasSettingsSaveButton}
        />
      </div>
    );
  }
}

AppSettings.propTypes = propTypes;
AppSettings.defaultProps = defaultProps;

export default AppSettings;

