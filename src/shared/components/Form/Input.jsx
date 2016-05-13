import React from 'react';
import Icon from '../Icon';

export const Input = React.createClass({
  getType: function () {
    return this.props.type || 'text';
  },

  getValue: function () {
    let ret = this.props.value;
    return ret;
  },

  //
  handleChange: function (e) {
    if (typeof this.props.updater === 'function') {
      this.props.updater(e);
    }
  },

  render: function () {
    let {className, id, name} = this.props;
    
    if(className) {
      className = 'text ' + className;
    } else {
      className = 'text';
    }
    id = id || name;
    
    return <input {...this.props}
      id={id}
      type={this.getType()}
      value={this.getValue()}
      className={className}
      onChange={this.handleChange}
    />;
  }
});

export const Search = React.createClass({

  onChange(e) {
    if (typeof this.props.updater === 'function') {
      this.props.updater(e);
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

export const FormGruop = React.createClass({

  renderValidator() {

  },

  render() {

    return <div className="form-group">
      {
        this.props.label ?
          <label htmlFor={this.props.name}>{this.props.label}</label> :
          null
      }
      <div className="form-control">
        <Input {...this.props} />
        {
          this.props.help ? <span className="help">{this.props.help}</span> :
          null
        }
      </div>
    </div>
  }
});

