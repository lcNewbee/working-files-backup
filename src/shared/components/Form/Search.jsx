import React, {PropTypes} from 'react';
import Icon from '../Icon';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  Component: 'span',
};

export const Search = React.createClass({
  onChange(e) {
    const val = e.target.value;
    
    if (typeof this.props.updater === 'function') {
      this.props.updater(val, e);
    }
    
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(val, e);
    }
  },

  onKeyUp(e) {
    let which = e.which;
    
    if(which === 13) {
      if (typeof this.props.onSearch === 'function') {
        this.props.onSearch(e);
      }
    }
  },

  render() {
    
    return (
      <div className="input-search fl">
        
        <Icon className="icon-search" name="search"/>
        <input {...this.props}
          type="text"
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
        />
      </div>
    );
  }
});

export default Search;