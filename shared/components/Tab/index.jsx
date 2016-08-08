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

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div className="o-tab">
        <Nav
          className="o-tab__nav"
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

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
