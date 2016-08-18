import React, { PropTypes } from 'react';
import Icon from 'shared/components/Icon';
import { Map } from 'immutable';
import DevicesProperties from './DevicesProperties';

const propTypes = {
  isShow: PropTypes.bool,
  onToggle: PropTypes.func,
  collapsePropertys: PropTypes.func,
  changePropertysTab: PropTypes.func,
  changePropertysItem: PropTypes.func,
  removeFromPropertyPanel: PropTypes.func,
  updatePropertyPanelData: PropTypes.func,
  save: PropTypes.func,

  data: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};

const defaultProps = {
  isShow: false,
};

class PropertyPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onChangePropertysTab = this.onChangePropertysTab.bind(this);
  }

  onChangePropertysTab(e, name) {
    e.preventDefault();
    this.props.changePropertysItem({
      activeTab: name,
    });
  }

  render() {
    const { isShow, data } = this.props;
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
                <DevicesProperties
                  key={`properties_${index}`}
                  app={this.props.app}
                  item={item}
                  isCollapsed={index !== activeIndex}
                  onCollapse={
                    () => this.props.collapsePropertys(index)
                  }
                  onChangeData={this.props.updatePropertyPanelData}
                  onChangeTab={this.onChangePropertysTab}
                  onChangeItem={this.props.changePropertysItem}
                  onRemove={
                    () => this.props.removeFromPropertyPanel(index)
                  }
                  onSave={this.props.save}
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
