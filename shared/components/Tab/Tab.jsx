import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { NavLink as Link } from 'react-router-dom';

import PureComponent from '../Base/PureComponent';
import Icon from '../Icon';
import './Tab.scss';

const propTypes = {
  menus: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onChange: PropTypes.func,
  children: PropTypes.node,
};

const defaultProps = {
  menus: [],
};

class Tabs extends PureComponent {
  constructor(props) {
    super(props);
    this.onSelectTab = this.onSelectTab.bind(this);
  }
  onSelectTab(path, index) {
    if (this.props.onChange) {
      this.props.onChange(path, index);
    }
  }
  render() {
    const { menus } = this.props;
    return (
      <div className="o-tab" role="tab">
        <ul className="o-tab__nav">
          {
            fromJS(menus).map((item, i) => {
              const { icon, path, text } = item.toJS();

              return (
                <li key={i}>
                  <Link
                    to={path}
                    activeClassName="active"
                    onClick={() => this.onSelectTab(path, i)}
                  >
                    {
                      icon ? <Icon name={icon} /> : null
                    }
                    {text}
                  </Link>
                </li>
              );
            })
          }
        </ul>

        <div className="o-tab__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
