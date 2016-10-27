import React, { PropTypes } from 'react';
import Icon from 'shared/components/Icon';
import { Map } from 'immutable';
import DevicePanel from '../Panels/Device';

const propTypes = {
  isShow: PropTypes.bool,
  onToggle: PropTypes.func,
  collapsePropertys: PropTypes.func,
  changePropertysItem: PropTypes.func,
  removeFromPropertyPanel: PropTypes.func,
  updatePropertyPanelData: PropTypes.func,
  fetchPropertyPanelData: PropTypes.func,
  reportValidError: PropTypes.func,
  save: PropTypes.func,

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
  }

  onChangePropertysTab(e, name) {
    e.preventDefault();
    this.props.changePropertysItem({
      activeTab: name,
    });
  }

  onSave() {
    const { properties } = this.props;
    const activeIndex = properties.get('activeIndex');
    const activePanelState = properties.getIn([
      'list', activeIndex,
    ]);
    const activePanelconfigIndex = activePanelState.get('configurationActivePanelIndex');
    const $$activeListData = activePanelState.get('data');
    const $$configData = activePanelState.getIn([
      'configuration', activePanelconfigIndex,
    ]);
    const query = activePanelState.get('query').toJS();
    let formUrl = 'goform/group/ap/radio';
    let subData = $$configData.get('data').toJS();

    if ($$configData.get('module') === 'radio') {
      formUrl = 'goform/group/ap/radio';
      subData = $$activeListData.get('radio')
          .merge(subData).toJS();
    }

    this.props.save(formUrl, subData)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          this.props.fetchPropertyPanelData(query);
        }
      });
  }

  render() {
    const { isShow, data, app, reportValidError } = this.props;
    const { activeIndex } = data.toJS();

    let propertyPanelClassName = 'o-property-panel';

    if (isShow) {
      propertyPanelClassName = `${propertyPanelClassName} active`;
    }

    if (data.get('list').size < 1) {
      return null;
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
                  isCollapsed={index !== activeIndex}

                  // Actions Props
                  onCollapse={
                    () => this.props.collapsePropertys(index)
                  }
                  onChangeData={this.props.updatePropertyPanelData}
                  onChangeTab={this.onChangePropertysTab}
                  onChangeItem={this.props.changePropertysItem}
                  onRemove={
                    () => this.props.removeFromPropertyPanel(index)
                  }
                  onSave={this.onSave}

                  // Validate Props
                  invalidMsg={app.get('invalid')}
                  validateAt={app.get('validateAt')}
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
