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

  createModal: PropTypes.func,

  // 数据操作相关函数
  updateScreenSettings: PropTypes.func,
  onBeforeSave: PropTypes.func,
  saveScreenSettings: PropTypes.func,
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
      'doSaveSettings',
    ]);
  }
  componentWillUnmount() {
    this.props.resetVaildateMsg();
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
            this.doSaveSettings(saveOption);
          },
        );
    } else {
      if (onBeforeSaveResult) {
        saveOption.msg = onBeforeSaveResult;
      }

      this.doSaveSettings(saveOption);
    }
  }

  onChangeSettingsData(data) {
    this.props.updateScreenSettings(data);
  }

  doSaveSettings(option) {
    if (option && option.msg) {
      this.props.createModal({
        id: 'saveSettings',
        role: 'alert',
        text: option.msg,
      });
    } else if (this.props.validateAll) {
      this.props.validateAll()
          .then((errMsg) => {
            if (errMsg.isEmpty()) {
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
          });
    }
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

