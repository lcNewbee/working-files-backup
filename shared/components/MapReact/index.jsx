import React, { Component, PropTypes } from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const propTypes = {
  apiKey: PropTypes.string,
  libraries: PropTypes.string,
  children: PropTypes.node,
};

const defaultProps = {
  menus: [],
  isTree: false,
  role: 'menu',
};

class MapReact extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      isMapLoaded: false,
    };
  }

  componentWillMount() {
    const { apiKey, libraries } = this.props;
    let scriptUrl = 'https://maps.googleapis.com/maps/api/js?';

    if (apiKey) {
      scriptUrl = `${scriptUrl}key=${apiKey}`;
    }

    if (libraries) {
      scriptUrl = `${scriptUrl}&libraries=${libraries}`;
    }

    utils.loadScript(scriptUrl,
      (error) => {
        if (!error) {
          this.setState({
            isMapLoaded: true,
          });
        }
      },
    6000);
  }

  render() {
    return (
      <div>
        { this.isMapLoaded ? this.props.children : null }
      </div>
    );
  }
}

MapReact.propTypes = propTypes;
MapReact.defaultProps = defaultProps;

export default MapReact;

