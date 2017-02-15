import React, { PropTypes } from 'react';
import Icon from 'shared/components/Icon';
import { Map, List } from 'immutable';
import { immutableUtils } from 'shared/utils';
import { numberKeys } from 'shared/config/axcRadio';
import { getActionable } from 'shared/axc';
import DevicePanel from '../Panels/Device';

const propTypes = {
  isShow: PropTypes.bool,
  onToggle: PropTypes.func,
  collapsePropertys: PropTypes.func,
  changePropertysItem: PropTypes.func,
  removeFromPropertyPanel: PropTypes.func,
  updatePropertyPanelData: PropTypes.func,
  fetchPropertyPanelData: PropTypes.func,
  changePropertyPanelRadioIndex: PropTypes.func,
  reportValidError: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  save: PropTypes.func,
  validateAll: PropTypes.func,
  groupid: PropTypes.any,
  refreshAll: PropTypes.func,
  route: PropTypes.object,

  data: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
  properties: PropTypes.instanceOf(Map),
};

const defaultProps = {
  isShow: false,
};

class PropertyPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onChangePropertysTab = this.onChangePropertysTab.bind(this);
    this.onSave = this.onSave.bind(this);
    this.actionable = getActionable(this.props, 'group');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.path !== this.props.route.path) {
      if (this.props.route.path.indexOf('/group') === -1) {
        this.props.onToggle(false);
      }
    }
  }
  onChangePropertysTab(e, name) {
    e.preventDefault();
    this.props.changePropertysItem({
      activeTab: name,
    });
  }

  // 模块数据保存
  onSave() {
    const { properties } = this.props;
    const activeIndex = properties.get('activeIndex');
    const activePanelState = properties.getIn([
      'list', activeIndex,
    ]);
    const activePanelconfigIndex = activePanelState.get('configurationActivePanelIndex');
    const $$activeListData = activePanelState.get('curData');
    const $$configData = activePanelState.getIn([
      'configuration', activePanelconfigIndex,
    ]);
    const query = activePanelState.get('query').toJS();
    const curModule = $$configData.get('module');
    let formUrl = 'goform/group/ap/radio';
    let $$subData = $$configData.get('data');

    if (curModule === 'radio') {
      formUrl = 'goform/group/ap/radio';
      $$subData = immutableUtils.getChanged(
        $$subData,
        $$activeListData.getIn(['radio']),
      ).merge({
        groupid: $$activeListData.get('groupid'),
        mac: $$activeListData.get('mac'),
        radioID: $$activeListData.getIn(['radio', 'radioID']),
      });

      $$subData = immutableUtils.toNumberWithKeys($$subData, List(numberKeys));
    } else if (curModule === 'info') {
      formUrl = 'goform/group/ap/base';
      $$subData = $$subData.clear().merge({
        oldname: $$activeListData.getIn(['info', 'devicename']),
        newname: $$subData.getIn(['devicename']),
      });
    }

    this.props.save(formUrl, $$subData.toJS())
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          this.props.fetchPropertyPanelData(query);
          this.props.refreshAll();
        }
      });
  }

  render() {
    const { isShow, data, app, reportValidError, resetVaildateMsg, groupid } = this.props;
    const { activeIndex } = data.toJS();
    let propertyPanelClassName = 'o-property-panel';
    let actionAable = this.actionable;

    if (isShow) {
      propertyPanelClassName = `${propertyPanelClassName} active`;
    }

    if (data.get('list').size < 1) {
      return null;
    }
    if (groupid === -100) {
      actionAable = false;
    }

    return (
      <asider className={propertyPanelClassName}>
        <div
          className="o-property-panel__toggle-button"
          onClick={this.props.onToggle}
        >
          <Icon
            title={_('Show Property Panel')}
            name="angle-double-left"
            size="2x"
          />
        </div>
        <div className="o-property-panel__inner">
          <header className="m-action-bar o-property-panel__header">
            <div className="m-action-bar__left">{_('PROPERTIES')}</div>

            <div className="m-action-bar__right">
              <div className="action-icon-group">
                <Icon
                  title={_('Remove All')}
                  name="trash"
                  onClick={() => this.props.removeFromPropertyPanel(-1)}
                />
                <Icon
                  title={_('Collapse All')}
                  name="navicon"
                  onClick={() => this.props.collapsePropertys(-1)}
                />
                <Icon
                  title={_('Hidde Property Panel')}
                  name="angle-double-right"
                  onClick={this.props.onToggle}
                />
              </div>
            </div>
          </header>
          <div className="o-property-panel__container">
            {
              data.get('list').map((item, index) => (
                <DevicePanel
                  key={`properties_${index}`}
                  app={this.props.app}
                  item={item}
                  deviceIndex={index}
                  isCollapsed={index !== activeIndex}

                  // Actions Props
                  onCollapse={
                    () => this.props.collapsePropertys(index)
                  }
                  onChangeData={this.props.updatePropertyPanelData}
                  onChangeTab={this.onChangePropertysTab}
                  onChangeItem={this.props.changePropertysItem}
                  onChangeRadioIndex={this.props.changePropertyPanelRadioIndex}
                  onRemove={
                    () => this.props.removeFromPropertyPanel(index)
                  }
                  onSave={(formId) => {
                    this.props.validateAll(formId)
                      .then(
                        ($$msg) => {
                          if ($$msg.isEmpty()) {
                            this.onSave();
                          }
                        },
                      );
                  }}
                  actionable={actionAable}

                  // Validate Props
                  invalidMsg={app.get('invalid')}
                  validateAt={app.get('validateAt')}
                  resetVaildateMsg={resetVaildateMsg}
                  onValidError={reportValidError}
                />
              ))
            }
          </div>
        </div>
      </asider>
    );
  }
}

PropertyPanel.propTypes = propTypes;
PropertyPanel.defaultProps = defaultProps;

export default PropertyPanel;
