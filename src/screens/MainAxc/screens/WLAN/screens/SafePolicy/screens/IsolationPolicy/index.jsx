import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { FormGroup } from 'shared/components/Form';
import SaveButton from 'shared/components/Button/SaveButton';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  updateScreenSettings: PropTypes.func,
  saveScreenSettings: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onChangeSettings',
      'onSave',
    ]);
    this.saveTimeOut = null;
  }
  onSave() {
    this.props.saveScreenSettings();
  }
  onChangeSettings(name, data) {
    this.props.updateScreenSettings({
      [name]: data.value,
    });
    clearTimeout(this.saveTimeOut);
    this.saveTimeOut = setTimeout(() => {
      this.onSave();
    }, 260);
  }

  render() {
    const { app } = this.props;
    const curScreenId = this.props.store.get('curScreenId');
    const curData = this.props.store.getIn([curScreenId, 'curSettings']).toJS();

    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }

    return (
      <AppScreen
        {...this.props}
        noTitle
      >
        <form className="o-form">
          <FormGroup
            value="1"
            type="checkbox"
            text={__('AP Isolation')}
            checked={curData.apEanble === '1'}
            onChange={
              item => this.onChangeSettings('apEanble', item)
            }
          />
          <FormGroup
            value="1"
            type="checkbox"
            text={__('SSID Isolation')}
            checked={curData.ssidEanble === '1'}
            onChange={
              item => this.onChangeSettings('ssidEanble', item)
            }
          />
        </form>
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
