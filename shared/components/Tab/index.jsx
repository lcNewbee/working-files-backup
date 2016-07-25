import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Nav from '../Nav';
import './_index.scss';

const propTypes = {
  menus: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.any,
};

const defaultProps = {
  menus: [],
};

class TabMenus extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div className="tab">
        <Nav
          className="tab-nav"
          menus={this.props.menus}
          onChange={this.onNavChange}
        />
        <div className="tab-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

TabMenus.propTypes = propTypes;
TabMenus.defaultProps = defaultProps;

export default TabMenus;
