import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { Icon } from 'shared/components';

import './_index.scss';

const propTypes = {
  noResize: PropTypes.bool,
  reinitialize: PropTypes.bool,
  onReady: PropTypes.func,
  onZoomChange: PropTypes.func,
  onChange: PropTypes.func,
  backgroundImgUrl: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};
const defaultProps = {
  onReady: utils.noop,
  onZoomChange: utils.noop,
  onChange: utils.noop,
  backgroundImgUrl: '',
};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onMapMouseUp',
      'onMapMouseDown',
      'onMapMouseMove',
      'renderHeatMap',
      'handleZoomChange',
      'initialize',
    ]);

    this.state = {
      zoom: 100,
      backgroundImgUrl: props.backgroundImgUrl,
      mapOffsetX: 0,
      mapOffsetY: 0,
    };
  }
  componentDidMount() {
    this.initialize(this.state.backgroundImgUrl, true);

    // 全局添加 mouseup 事件
    // 防止鼠标在 map元素外起来，内容还在拖动问题
    document.addEventListener('mouseup', () => {
      this.mapMouseDown = false;
    });
  }
  componentWillReceiveProps(nextProps) {
    // 同步 state 与 props 的backgroundImgUrl
    if (nextProps.backgroundImgUrl !== this.state.backgroundImgUrl) {
      this.setState({
        backgroundImgUrl: nextProps.backgroundImgUrl,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.reinitialize || prevState.backgroundImgUrl !== this.state.backgroundImgUrl) {
      this.initialize(this.state.backgroundImgUrl);
    }

    if (prevState.zoom !== this.state.zoom) {
      this.props.onZoomChange({
        zoom: this.state.zoom,
        width: (this.state.naturalWidth * this.state.zoom) / 100,
        height: (this.state.naturalHeight * this.state.zoom) / 100,
      });
    }
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

  /**
   * 初始化 zoom 等于 100 时图片的长宽
   *
   * @param {string} url 背景图片的URL
   * @param {bool} init 是否为初始化
   * @memberof View
   */
  initialize(url, init) {
    let ret = null;

    // 如果背景图片 URL 发生改变
    if (url && this.imageUrl !== url) {
      ret = utils.dom.getImgNaturalSize(url)
        .then((response) => {
          let newWidth = this.state.naturalWidth;
          let newRatio = this.state.naturalRatio;

          if (this.mapElem) {
            newWidth = this.mapElem.offsetWidth;

            if (response.width && response.height) {
              newRatio = response.height / response.width;
            } else {
              newRatio = this.mapElem.offsetHeight / this.mapElem.offsetWidth;
            }

            newRatio = Number(newRatio).toFixed(6);

            const newHeight = newWidth * newRatio;

            // 只有在需要改变时，才修改 state值
            if (
              newRatio !== this.state.naturalRatio ||
              newWidth !== this.state.naturalWidth ||
              newHeight !== this.state.naturalHeight
            ) {
              this.setState({
                naturalWidth: newWidth,
                naturalHeight: newHeight,
                naturalRatio: newRatio,
              });

              if (init) {
                this.props.onReady({
                  ratio: newRatio,
                  width: newWidth,
                  height: newHeight,
                  contentElem: this.mapContent,
                  zoom: this.state.zoom,
                });
              } else {
                this.props.onChange({
                  ratio: newRatio,
                  width: newWidth,
                  height: newHeight,
                  contentElem: this.mapContent,
                  zoom: this.state.zoom,
                });
              }
            }
          }
        });

      this.imageUrl = url;

    // 如果背景图片URL没变
    } else {
      const { naturalRatio, naturalWidth } = this.state;

      if (this.mapElem.offsetWidth !== naturalWidth) {
        this.setState({
          naturalWidth: this.mapElem.offsetWidth,
          naturalHeight: this.mapElem.offsetWidth * naturalRatio,
        });

        this.props.onChange({
          ratio: naturalRatio,
          width: this.mapElem.offsetWidth,
          height: this.mapElem.offsetWidth * naturalRatio,
          contentElem: this.mapContent,
          zoom: this.state.zoom,
        });
      }
    }

    return ret;
  }

  handleZoomChange(zoom) {
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
            width: `${Math.floor(this.state.naturalWidth * zoomRatio)}px`,
            height: `${Math.floor(this.state.naturalHeight * zoomRatio)}px`,
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
