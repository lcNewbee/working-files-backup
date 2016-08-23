import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormGroup, SaveButton,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }
  componentWillMount() {
    const props = this.props;
    const groupId = props.groupId || -1;

    props.initSettings({
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      query: {
        groupId,
      },
      defaultData: {
        enable: '1',
      },
    });

    props.fetchSettings();
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }
  onSave() {
    this.props.saveSettings();
  }

  render() {
    const { route, updateItemSettings } = this.props;
    const curData = this.props.store.getIn(['curData']).toJS();
    const dtStyle = {
      width: '20%'
    }
    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }

    return (
      <form className="o-form o-form--block">
        <h3 className="o-form__title">{route.text}</h3>
        <div className="row">
          <div className="cols col-6">
            <FormGroup
              type="textarea"
              label={_('Device License')}
            />
            <div className="m-description-list">
              <dl className="m-description-list-row">
                <dt style={dtStyle}>{_('序列号状态')}</dt>
                <dd>已授权</dd>
              </dl>
              <dl className="m-description-list-row">
                <dt style={dtStyle}>{_('AP数')}</dt>
                <dd>1000</dd>
              </dl>
              <dl className="m-description-list-row">
                <dt style={dtStyle}>{_('DPI')}</dt>
                <dd>sss</dd>
              </dl>
              <dl className="m-description-list-row">
                <dt style={dtStyle}>{_('报表')}</dt>
                <dd>sss</dd>
              </dl>
            </div>
          </div>
          <div className="cols col-6">
            <FormGroup
              type="textarea"
              label={_('Softe Upgrade License')}
            />
            <div className="m-description-list">
              <dl className="m-description-list-row">
                <dt style={dtStyle}>{_('序列号状态')}</dt>
                <dd>已授权</dd>
              </dl>
              <dl className="m-description-list-row">
                <dt style={dtStyle}>{_('过期时间')}</dt>
                <dd>2018-02-23</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="form-group form-group--save">
          <div className="form-control">
            <SaveButton
              type="button"
              loading={this.props.app.get('saving')}
              onClick={this.onSave}
            />
          </div>
        </div>
      </form>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupId: state.mainAxc.getIn(['group', 'selected', 'id']),
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
