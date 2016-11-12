import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from '../Icon';
import Input from './atom/Input';
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

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
      <div className="m-search fl">
        <Icon className="m-search__icon" name="search" />
        <Input
          {...inputProps}
          className="m-search__input"
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
