import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { Icon } from 'shared/components';

import './_index.scss';

const propTypes = {
  noResize: PropTypes.bool,
  onReady: PropTypes.func,
  onZoomChange: PropTypes.func,
  backgroundImgUrl: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};
const defaultProps = {
  onReady: utils.noop,
  onZoomChange: utils.noop,
  backgroundImgUrl: 'images/backgroundImg.png',
};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onMapMouseUp',
      'onMapMouseDown',
      'onMapMouseMove',
      'renderHeatMap',
      'getImgNaturalSize',
      'handleZoomChange',
    ]);

    this.state = {
      zoom: 100,
      backgroundImgUrl: props.backgroundImgUrl,
      mapOffsetX: 0,
      mapOffsetY: 0,
    };
  }
  componentDidMount() {
    this.getImgNaturalSize(this.state.backgroundImgUrl);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.backgroundImgUrl !== this.state.backgroundImgUrl) {
      this.setState({
        backgroundImgUrl: nextProps.backgroundImgUrl,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.backgroundImgUrl !== this.state.backgroundImgUrl) {
      this.getImgNaturalSize(this.state.backgroundImgUrl);
    }
  }

  onMapMouseUp() {
    this.mapMouseDown = false;
  }
  onMapMouseDown(e) {
    this.mapMouseDown = true;
    this.mapClientX = e.clientX;
    this.mapClientY = e.clientY;
  }
  onMapMouseMove(e) {
    if (this.mapMouseDown) {
      this.setState({
        mapOffsetX: (this.state.mapOffsetX + e.clientX) - this.mapClientX,
        mapOffsetY: (this.state.mapOffsetY + e.clientY) - this.mapClientY,
      });
      this.mapClientX = e.clientX;
      this.mapClientY = e.clientY;
    }
  }

  getImgNaturalSize(url) {
    const image = new Image();

    image.onload = () => {
      if (image.width && this.mapContent) {
        // 高度与宽度对比
        const naturalRatio = image.height / image.width;
        const width = this.mapContent.offsetWidth;
        const height = width * naturalRatio;

        this.setState({
          naturalWidth: width,
          naturalHeight: height,
          naturalRatio,
        });

        this.props.onReady({
          width,
          height,
          contentElem: this.mapContent,
          zoom: this.state.zoom,
        });
      }
    };
    image.onerror = () => {};
    image.src = url;
  }

  handleZoomChange(zoom) {
    this.props.onZoomChange({
      zoom,
      width: (this.state.naturalWidth * zoom) / 100,
      height: (this.state.naturalHeight * zoom) / 100,
    });
    this.setState({
      zoom,
    });
  }
  render() {
    const { zoom, backgroundImgUrl } = this.state;
    const { noResize, style, className } = this.props;
    const zoomRatio = zoom / 100;
    let mapClassNames = 'rw-map';

    if (className) {
      mapClassNames = `${mapClassNames} ${className}`;
    }
    return (
      <div
        className={mapClassNames}
        ref={(elem) => { this.mapElem = elem; }}
        style={style}
      >
        {
          noResize ? null : (
            <div className="rw-map-zoom-bar">
              <Icon
                name="minus"
                className="rw-map-zoom-bar__minus"
                onClick={() => {
                  const nextZoom = (zoom - 10) < 0 ? 0 : (zoom - 10);

                  this.handleZoomChange(nextZoom);
                }}
              />
              <div className="rw-map-zoom-bar__thmp" >{zoom}%</div>
              <Icon
                name="plus"
                className="rw-map-zoom-bar__plus"
                onClick={() => {
                  const nextZoom = (zoom + 10) > 200 ? 200 : (zoom + 10);
                  this.handleZoomChange(nextZoom);
                }}
              />
            </div>
          )
        }

        <div
          className="rw-map-content"
          style={{
            left: this.state.mapOffsetX,
            top: this.state.mapOffsetY,
            width: `${this.state.naturalWidth * zoomRatio}px`,
            height: `${this.state.naturalHeight * zoomRatio}px`,
            backgroundColor: '#ccc',
            backgroundImage: `url(${backgroundImgUrl})`,
            backgroundRepeat: 'no-repeat',
          }}
          ref={(elem) => {
            if (elem) {
              this.mapContent = elem;
            }
          }}
          onMouseDown={this.onMapMouseDown}
          onMouseUp={this.onMapMouseUp}
          onMouseMove={this.onMapMouseMove}
        >
          { this.props.children }
        </div>
      </div>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;
