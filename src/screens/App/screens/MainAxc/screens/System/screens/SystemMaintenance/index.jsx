import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import FormGroup from 'shared/components/Form/FormGroup';
import SaveButton from 'shared/components/Button/SaveButton';
import FileUpload from 'shared/components/FileUpload';
import ProgressBar from 'shared/components/ProgressBar';
import Progress from 'shared/components/Progress';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const languageOptions = List(b28n.getOptions().supportLang).map((item) => (
  {
    value: item,
    label: b28n.langMap[item] || 'English',
  }
)).toJS();

function onChangeLang(data) {
  if (b28n.getLang() !== data.value) {
    b28n.setLang(data.value);
    window.location.reload();
  }
}

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  saveFile: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    utils.binds(this, [
      'onReboot',
      'onBackup',
      'onRestore',
    ]);

    this.state = {
      isRebooting: false,
      isRestoring: false,
    };
  }

  onReboot() {
    this.props.save('/goform/system/reboot')
      .then((json) => {
        if (json.state && json.state.code === 2000 ) {

        }
      });
  }

  onBackup() {
    this.props.save('/goform/system/backup');
  }
  onRestore() {
    this.props.save('/goform/system/restore');
  }

  render() {
    const { route } = this.props;
    const restoreUrl = '/goform/system/restore';

    return (
      <AppScreen
        {...this.props}
        noTitle
      >
        <div className="o-form">
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{route.text}</legend>
            <FormGroup label={_('Reboot Device')}>
              <SaveButton
                type="button"
                icon="refresh"
                text={_('Reboot Now')}
                onClick={this.onReboot}
              />
            </FormGroup>
            <FormGroup label={_('Backup Configuration')}>
              <SaveButton
                type="button"
                icon="download"
                text={_('')}
                onClick={this.onBackup}
              />
            </FormGroup>
          </fieldset>
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Restore Configuration')}</legend>
            <FormGroup
              label={_('Restore From File')}
            >
              <FileUpload
                url={restoreUrl}
                name="backupFile"
                buttonText={_('Restore Now')}
              />
            </FormGroup>
            <FormGroup label={_('Restore To Factory')}>
              <SaveButton
                type="button"
                icon="undo"
                text=""
                onClick={this.onRestore}
              />
            </FormGroup>
          </fieldset>

          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Language')}</legend>
            <FormGroup
              type="select"
              options={languageOptions}
              value={b28n.getLang()}
              onChange={onChangeLang}
            />
          </fieldset>
        </div>
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupId: state.product.getIn(['group', 'selected', 'id']),
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
