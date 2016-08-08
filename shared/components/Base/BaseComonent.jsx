import React from 'react';

export default class PureComponent extends React.Component {
  binds(...methods) {
    methods.forEach((method) => (this[method] = this[method].bind(this)));
  }
}
