import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormContainer from 'shared/components/Organism/FormContainer';

const propTypes = {
  title: PropTypes.string,
  app: PropTypes.instanceOf(Map).isRequired,
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
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.binds('handleChangeQuery', 'onPageChange', 'onSave', 'onCloseEditModal',
        'onChangeSearchText', 'onChangeType', 'onChangeTableSize', 'removeSelectItems');
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

  render() {
    const {
      app, screenId, curSettings, settingsFormOptions, updateScreenSettings,
      hasSettingsSaveButton, actionable,
    } = this.props;

    return (
      <div className="t-settings">
        <FormContainer
          options={settingsFormOptions}
          data={curSettings}
          onChangeData={updateScreenSettings}
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

