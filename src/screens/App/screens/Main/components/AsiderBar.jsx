import React, {PropTypes} from 'react';
import {fromJS} from 'immutable';
import Icon from 'shared/components/Icon';

const propTypes = {

};

const defaultProps = {
};

class AsiderBar extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {

    return (
      <asider className="main-property-panel">
        <header className="app-action-bar">
          <div className="app-action-bar-left">PROPERTIES</div>
          <div className="app-action-bar-right">
            <div className="app-action-icon-group">
              <Icon
                title={_('Remove All')}
                name='trash'
              />
              <Icon
                title={_('Remove All')}
                name='navicon'
              />
              <Icon
                title={_('Remove All')}
                name='angle-double-right'
              />
            </div>
          </div>
        </header>
        <div className="main-properties-container">
          <div className="main-properties-container-item">
          </div>
        </div>
      </asider>
    );
  }
}

AsiderBar.propTypes = propTypes;
AsiderBar.defaultProps = defaultProps;

export default AsiderBar;
