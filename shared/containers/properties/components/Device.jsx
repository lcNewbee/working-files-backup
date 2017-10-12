import React from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import Icon from 'shared/components/Icon';
import { apStatus } from 'shared/config/axcAp';
import SaveButton from 'shared/components/Button/SaveButton';

import DeviceOverview from './DeviceOverview';
import DeviceGeneral from './DeviceGeneral';
import DeviceRadioAdvance from './DeviceRadioAdvance';
import DeviceRadioBase from './DeviceRadioBase';
import DeviceRadioQos from './DeviceRadioQos';


const MY_MSG = {
  saveText: __('Apply'),
  savingText: __('Applying'),
  savedText: __('Applied'),
  unsavedText: __('Unapplied'),
};

const panelsComponentMap = {
  overview: DeviceOverview,
  general: DeviceGeneral,
  radioAdvance: DeviceRadioAdvance,
  radioBase: DeviceRadioBase,
  radioQos: DeviceRadioQos,
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
};

function DevicesProperties(props) {
  const {
    item, isCollapsed, app,
    onCollapse, onChangeTab, onChangeItem, onRemove, actionable,
  } = props;
  const activeTab = item.get('activeTab');
  const activeTabPanels = item.get(activeTab);
  const activePanelKey = `${activeTab}ActivePanelIndex`;
  const versionCode = app.get('versionCode');
  const against = item.getIn(['data', 'info', 'status']) === 'against';
  let apStatuVal = fromJS(apStatus).find(
    $$item => $$item.get('value') === item.getIn(['data', 'info', 'status']),
  );
  let curSavedText = MY_MSG.savedText;
  let thisActionable = actionable;

  if (against) {
    thisActionable = false;
  }

  if (apStatuVal) {
    apStatuVal = apStatuVal.get('label');
  }

  let avatarIconClass = 'Icon Icon-ap-offline';
  let statuIconClass = 'o-properties-header__status';
  let statuTagClass = 'a-tag a-tag--danger';

  if (apStatuVal === __('Offline')) {
    statuIconClass = `${statuIconClass} offline`;
    statuTagClass = 'a-tag a-tag--danger';
  } else if (apStatuVal === __('Online')) {
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
            {
              against ? (
                <SaveButton
                  id="against"
                  type="button"
                  size="min"
                  icon="close"
                  style={{
                    marginLeft: '6px',
                  }}
                  loading={app.get('saving')}
                  text={__('Cancel Counter')}
                  savingText={__('Applying')}
                  savedText={__('Applied')}
                  onClick={
                    () => {
                      setTimeout(
                        () => props.onSave({
                          module: 'info',
                          subData: {
                            against: 0,
                          },
                        }),
                        20,
                      );
                    }
                  }
                />
              ) : null
            }
          </div>
        </div>
        <div className="o-properties-header__actions">
          <Icon
            name="remove"
            onClick={onRemove}
          />
        </div>
      </div>
      {
        !isCollapsed ? (
          <div className="o-properties__body">
            <div className="o-tab o-tab--compassed">
              <ul className="o-tab__nav">
                <li>
                  <a
                    className={activeTab === 'details' ? 'active' : ''}
                    onClick={e => onChangeTab(e, 'details')}
                  >
                    {__('Details')}
                  </a>
                </li>
                <li>
                  <a
                    className={activeTab === 'configuration' ? 'active' : ''}
                    onClick={
                      e => onChangeTab(e, 'configuration')
                    }
                  >
                    {__('Configuration')}
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
                      let $$curStore = panel;

                      if (panelKey === 'general') {
                        $$curStore = $$curStore.setIn(['data', 'first5g'],
                          panel.getIn(['data', 'first5g']) !== undefined ?
                            panel.getIn(['data', 'first5g']) : item.getIn(['curData', 'radio', 'first5g']),
                        );
                        if (against) {
                          $$curStore = $$curStore.setIn(['data', 'against'], 1);
                        }

                        if (item.getIn(['data', 'radios']) && item.getIn(['data', 'radios']).size > 1) {
                          $$curStore = $$curStore.setIn(['data', 'has5g'], true);
                        }
                      }

                      // 小于 2.5 版本， 功能未实现暂时隐藏
                      if (versionCode < 20500) {
                        if (panelKey === 'radioQos') {
                          return null;
                        }
                      }

                      return (
                        <div
                          key={`${panelKey}`}
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
                            <span>{__(panel.get('text'))}</span>
                          </div>
                          {
                            MyComponent ? (
                              <div className="o-panel__body">
                                <MyComponent
                                  {...props}
                                  actionable={thisActionable}
                                  store={$$curStore}
                                  saveText={MY_MSG.saveText}
                                  savingText={MY_MSG.savingText}
                                  savedText={curSavedText}
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
        ) : null
      }

    </div>
  );
}

DevicesProperties.propTypes = propTypes;
DevicesProperties.defaultProps = defaultProps;

export default DevicesProperties;
