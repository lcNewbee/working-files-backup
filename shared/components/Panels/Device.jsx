import React, { PropTypes } from 'react';
import { Map, fromJS } from 'immutable';
import Icon from 'shared/components/Icon';
import { apStatus } from 'shared/config/axcAp';

import DeviceOverview from './DeviceOverview';
import DeviceGeneral from './DeviceGeneral';
import DeviceRadioAdvance from './DeviceRadioAdvance';
import DeviceRadioBase from './DeviceRadioBase';

const panelsComponentMap = {
  overview: DeviceOverview,
  general: DeviceGeneral,
  radioAdvance: DeviceRadioAdvance,
  radioBase: DeviceRadioBase,
};
const propTypes = {
  onCollapse: PropTypes.func,
  onChangeTab: PropTypes.func,
  onChangeItem: PropTypes.func,
  onRemove: PropTypes.func,

  isCollapsed: PropTypes.bool,
  item: PropTypes.instanceOf(Map),
};

const defaultProps = {
  menus: [],
};

function DevicesProperties(props) {
  const {
    item, isCollapsed,
    onCollapse, onChangeTab, onChangeItem, onRemove,
  } = props;
  const activeTab = item.get('activeTab');
  const activeTabPanels = item.get(activeTab);
  const activePanelKey = `${activeTab}ActivePanelIndex`;
  let apStatuVal = fromJS(apStatus).find(
    $$item => $$item.get('value') === item.getIn(['data', 'info', 'status']),
  );

  if (apStatuVal) {
    apStatuVal = apStatuVal.get('label');
  }

  let avatarIconClass = 'Icon Icon-ap-offline';
  let statuIconClass = 'o-properties-header__status';
  let statuTagClass = 'a-tag a-tag--danger';

  if (apStatuVal === _('Offline')) {
    statuIconClass = `${statuIconClass} offline`;
    statuTagClass = 'a-tag a-tag--danger';
  } else if (apStatuVal === _('Online')) {
    statuIconClass = `${statuIconClass} online`;
    avatarIconClass = 'Icon Icon-ap-online';
    statuTagClass = 'a-tag a-tag--success';
  } else {
    statuIconClass = `${statuIconClass}`;
    statuTagClass = 'a-tag a-tag--warning';
  }

  return (
    <div
      className={`o-properties ${isCollapsed ? 'is-collapsed' : ''}`}
    >
      <div className="o-properties-header">
        <div className="o-properties-header__collspse-toggle">
          <Icon
            name={isCollapsed ? 'angle-right' : 'angle-down'}
            onClick={onCollapse}
          />
        </div>
        <div className="o-properties-header__avatar">
          <span className={avatarIconClass} />
        </div>
        <Icon
          name="circle"
          className={statuIconClass}
        />
        <div className="o-properties-header__title">
          <span>
            {
              item.getIn(['data', 'info', 'devicename']) ||
              item.getIn(['data', 'info', 'mac'])
            }
          </span>
          <div className="o-properties-header__title-more">
            <span className={statuTagClass}>{apStatuVal}</span>
          </div>
        </div>
        <div className="o-properties-header__actions">
          <Icon
            name="remove"
            onClick={onRemove}
          />
        </div>
      </div>
      <div className="o-properties__body">
        <div className="o-tab o-tab--compassed">
          <ul className="o-tab__nav">
            <li>
              <a
                className={activeTab === 'details' ? 'active' : ''}
                onClick={e => onChangeTab(e, 'details')}
              >
                {_('Details')}
              </a>
            </li>
            <li>
              <a
                className={activeTab === 'configuration' ? 'active' : ''}
                onClick={
                  e => onChangeTab(e, 'configuration')
                }
              >
                {_('Configuration')}
              </a>
            </li>
          </ul>
          <div className="o-properties-content">
            <div className="o-panel-group">
              {
                activeTabPanels.map((panel, panelIndex) => {
                  const panelKey = panel.get('panelKey');
                  const isActive = item.get(activePanelKey) === panelIndex;
                  const MyComponent = panelsComponentMap[panelKey];

                  return (
                    <div
                      key={panelKey}
                      className={`o-panel ${isActive ? '' : 'is-panel-hide'}`}
                    >
                      <div
                        className="o-panel__header"
                        onClick={
                          () => {
                            let activePanelIndex = panelIndex;
                            const data = {};

                            if (isActive) {
                              activePanelIndex = -1;
                            }

                            data[activePanelKey] = activePanelIndex;

                            onChangeItem(data);
                          }
                        }
                      >
                        <Icon
                          name={isActive ? 'angle-down' : 'angle-right'}
                        />
                        <span>{_(panel.get('text'))}</span>
                      </div>
                      {
                        MyComponent ? (
                          <div className="o-panel__body">
                            <MyComponent
                              {...props}
                              store={panel}
                            />
                          </div>
                        ) : null
                      }
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DevicesProperties.propTypes = propTypes;
DevicesProperties.defaultProps = defaultProps;

export default DevicesProperties;
