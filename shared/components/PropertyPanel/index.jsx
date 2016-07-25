import React, { PropTypes } from 'react';
// import { fromJS } from 'immutable';
import Icon from 'shared/components/Icon';

import 'shared/scss/02_molecule/_m-property-panel.scss';

const propTypes = {
  isShow: PropTypes.bool,
};

const defaultProps = {
  isShow: false,
};

class AsiderBar extends React.Component {
  constructor(props) {
    super(props);

    this.onToggleShow = this.onToggleShow.bind(this);
  }

  onToggleShow() {

  }

  render() {
    const { isShow } = this.props;

    let propertyPanelClassName = 'm-property-panel';

    if (isShow) {
      propertyPanelClassName += ' active';
    }

    return (
      <asider className={propertyPanelClassName}>
        <div className="m-property-panel__toggle-button">
          <Icon
            title={_('Remove All')}
            name="angle-double-left"
            size="2x"
          />
        </div>
        <div className="m-property-panel__inner">
          <header className="action-bar">
            <div className="action-bar__left">PROPERTIES</div>
            <div className="action-bar__right">
              <div className="action-icon-group">
                <Icon
                  title={_('Remove All')}
                  name="trash"
                />
                <Icon
                  title={_('Remove All')}
                  name="navicon"
                />
                <Icon
                  title={_('Remove All')}
                  name="angle-double-right"
                />
              </div>
            </div>
          </header>
          <div className="m-properties-container">
            <div className="m-properties-container__item">

            </div>
          </div>
        </div>
      </asider>
    );
  }
}

AsiderBar.propTypes = propTypes;
AsiderBar.defaultProps = defaultProps;

export default AsiderBar;
