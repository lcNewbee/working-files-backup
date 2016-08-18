import React from 'react';

export default class PureComponent extends React.Component {
  binds(...methods) {
    methods.forEach((method) => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });
  }
}
