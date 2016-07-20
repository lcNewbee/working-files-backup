import React, { PropTypes } from 'react';
import Icon from '../Icon';
import utils from '../../utils';

const propTypes = {
  className: PropTypes.string,
  searchOnChange: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
};

const defaultProps = {
  Component: 'span',
  searchOnChange: true,
};

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onChange(e) {
    const val = e.target.value;

    if (this.props.onChange) {
      this.props.onChange(val, e);
    }

    if (this.props.searchOnChange) {
      if (this.props.onSearch) {
        this.props.onSearch(e);
      }
    }
  }

  onKeyUp(e) {
    const which = e.which;

    if (which === 13) {
      if (this.props.onSearch) {
        this.props.onSearch(e);
      }
    }
  }

  render() {
    const inputProps = utils.extend({}, this.props);

    delete inputProps.onSearch;
    delete inputProps.Component;
    delete inputProps.searchOnChange;

    return (
      <div className="input-search fl">
        <Icon className="icon-search" name="search" />
        <input
          {...inputProps}
          type="text"
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
        />
      </div>
    );
  }
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
