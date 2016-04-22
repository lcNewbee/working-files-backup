import React from 'react';

export const Input = React.createClass({
  getType: function () {
    return this.props.type || 'text';
  },

  getValue: function () {
    var ret = this.props.value;
    return ret;
  },

  // 
  handleChange: function (e) {
    if (typeof this.props.updater === 'function') {
      this.props.updater(e);
    }
  },

  render: function () {
    return <input {...this.props}
      id={this.props.name}
      type={this.getType() }
      value={this.getValue() }
      onChange={this.handleChange}
    />;
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
          ''
      }
      <div className="form-control">
        <Input {...this.props} />
      </div>
    </div>
  }
});

