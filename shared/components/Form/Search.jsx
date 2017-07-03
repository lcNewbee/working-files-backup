import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from '../Base/PureComponent';
import Icon from '../Icon';
import Input from './atom/Input';
import utils from '../../utils';

const propTypes = {
  style: PropTypes.object,
  searchOnChange: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
};

const defaultProps = {
  Component: 'span',
  searchOnChange: true,
  onSearch: utils.emptyFunc,
};

class Search extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onChange',
      'handleKeyUp',
      'handleClearClick',
      'handleInputChange',
    ]);

    this.state = {
      showClearIcon: false,
    };
  }

  onChange(val, e) {
    const showClearIcon = val && val.length >= 2;

    if (showClearIcon) {
      this.setState({
        showClearIcon: true,
      });
    } else {
      this.setState({
        showClearIcon: false,
      });
    }

    this.props.onChange(val, e);

    if (this.props.searchOnChange) {
      this.props.onSearch(e);
    }
  }
  handleInputChange(e) {
    const val = e.target.value;
    this.onChange(val, e);
  }

  handleClearClick(e) {
    this.onChange('', e);
  }

  handleKeyUp(e) {
    // which 属性指示按了哪个键或按钮。
    const which = e.which;
    // 键码13表示enter
    if (which === 13) {
      this.props.onSearch(e);
    }
  }

  render() {
    const inputProps = utils.extend({}, this.props);
    delete inputProps.onSearch;
    delete inputProps.Component;
    delete inputProps.searchOnChange;
    delete inputProps.style;

    return (
      <div className="m-search fl" style={this.props.style}>
        <Icon className="m-search__icon" name="search" />
        <Input
          {...inputProps}
          className="m-search__input"
          type="text"
          onChange={this.handleInputChange}
          onKeyUp={this.handleKeyUp}
        />
        {
          this.state.showClearIcon ? (
            <Icon className="m-search__clear" name="times-circle-o" onClick={this.handleClearClick} />
          ) : null
        }

      </div>
    );
  }
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
