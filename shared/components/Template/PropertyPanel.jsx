import React, { PropTypes } from 'react';

// import { fromJS } from 'immutable';
import Icon from 'shared/components/Icon';

const propTypes = {
  isShow: PropTypes.bool,
  onToggle: PropTypes.func,
};

const defaultProps = {
  isShow: false,
};

class PropertyPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onToggleShow = this.onToggleShow.bind(this);
  }

  onToggleShow() {

  }

  render() {
    const { isShow, data } = this.props;
    let propertyPanelClassName = 'o-property-panel';

    if (isShow) {
      propertyPanelClassName = `${propertyPanelClassName} active`;
    }

    return (
      <asider className={propertyPanelClassName}>
        <div
          className="o-property-panel__toggle-button"
          onClick={this.props.onToggle}
        >
          <Icon
            title={_('Remove All')}
            name="angle-double-left"
            size="2x"
          />
        </div>
        <div className="o-property-panel__inner">
          <header className="m-action-bar o-property-panel__header">
            <div className="m-action-bar__left">PROPERTIES</div>
            <div className="m-action-bar__right">
              <div className="action-icon-group">
                <Icon
                  title={_('Remove All')}
                  name="trash"
                />
                <Icon
                  title={_('Collapse All')}
                  name="navicon"
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
            <div className="o-properties-item">
              <div className="o-properties-header">
                <div className="o-properties-header__collspse-toggle">
                  <Icon
                    name="angle-right"
                  />
                </div>
                <div className="o-properties-header__avatar">
                  <Icon
                    name="bullseye"
                  />
                </div>
                <div className="o-properties-header__title">
                  44:213:3213:32131:
                </div>
                <div className="o-properties-header__actions">
                  <Icon
                    name="remove"
                  />
                </div>
              </div>
              <div className="o-properties-body">
                <div className="o-tab o-tab--compassed">
                  <ul className="o-tab__nav">
                    <li>
                      <a href="" className="active">Details</a>
                    </li>
                    <li>
                      <a href="">configuration</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </asider>
    );
  }
}

PropertyPanel.propTypes = propTypes;
PropertyPanel.defaultProps = defaultProps;

export default PropertyPanel;
