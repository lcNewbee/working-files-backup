import React, { Component } from 'react'; import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { NavLink as Link } from 'react-router-dom';
import Icon from '../Icon';
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

  onSelectTab() {

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
                    onClick={(e) => this.onSelectTab(path, e)}
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
