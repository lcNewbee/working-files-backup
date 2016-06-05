import React, {PropTypes} from 'react';
import Icon from '../Icon';

const propTypes = {
  className: PropTypes.string,
  searchOnChange: PropTypes.bool
};

const defaultProps = {
  Component: 'span',
  searchOnChange: true
};

class Search extends React.Component {
  constructor(props) {
    super(props);
    
    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  };
  
  onChange(e) {
    const val = e.target.value;
    
    if (typeof this.props.updater === 'function') {
      this.props.updater(val, e);
    }
    
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(val, e);
    }
    
    if(this.props.searchOnChange) {
      
      if (typeof this.props.onSearch === 'function') {
        this.props.onSearch(e);
      }
    }
  };

  onKeyUp(e) {
    let which = e.which;
    
    if(which === 13) {
      if (typeof this.props.onSearch === 'function') {
        this.props.onSearch(e);
      }
    }
  };

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
  };
};

Search.propTypes = propTypes
Search.defaultProps = defaultProps;

export default Search;