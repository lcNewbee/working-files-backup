import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';

const propTypes = {
  style: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
  }),
  rootDom: PropTypes.instanceOf(HTMLElement),
  children: PropTypes.node,
};
const defaultProps = {
  rootDom: document.body,
  style: {
    left: 0,
    top: 0,
    width: '100%',
  },
};

export default class RenderInDom extends Component {
  constructor(p) {
    super(p);
    this.renderLayer = this.renderLayer.bind(this);
  }
  componentDidMount() {
    const { style, rootDom } = this.props;

    this.popup = document.createElement('div');
    this.rootDom = rootDom;
    this.rootDom.appendChild(this.popup);

    // we can setAttribute of the div only in this way
    this.popup.style.position = 'absolute';
    this.popup.style.left = `${style.left}px`;
    this.popup.style.top = `${style.top}px`;
    this.popup.style.width = style.width;
    this.renderLayer();
  }
  componentDidUpdate() {
    this.renderLayer();
  }
  componentWillUnmount() {
    ReactDom.unmountComponentAtNode(this.popup);
    document.body.removeChild(this.popup);
  }

  renderLayer() {
    ReactDom.render(this.props.children, this.popup);
  }

  render() {
    return null;
  }
}

RenderInDom.propTypes = propTypes;
RenderInDom.defaultProps = defaultProps;
