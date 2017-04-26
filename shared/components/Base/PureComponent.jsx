// 为了兼容 React 没有 PureComponent组件的版本
import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

class BasePureComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
}

const PureComponent = React.PureComponent || BasePureComponent;

export default PureComponent;
