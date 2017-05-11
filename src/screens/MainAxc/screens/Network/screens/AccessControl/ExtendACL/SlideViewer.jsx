import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'utils';
import { fromJS, List } from 'immutable';
import { Button, Icon } from 'shared/components';

import './slideviewer.scss';

const propTypes = {
  slidedirection: PropTypes.string,
  slidelist: PropTypes.instanceOf(List),
  slidekey: PropTypes.string,
  onSlideBtnClick: PropTypes.func,
  contentwidth: PropTypes.string,
};

const defaultProps = {
  slidedirection: 'horizontal',
  slidelist: fromJS([]),
  slidekey: '',
  contentwidth: '200',
};

class SlideViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderleft: '0',
    };
    utils.binds(this, [
      'onSlideBtnClick',
    ]);
  }

  onSlideBtnClick(item) {
    if (this.props.onSlideBtnClick) {
      this.props.onSlideBtnClick(item);
    }
  }

  render() {
    return (
      <div className="slideview-wrap row">
        <div className="cols col-1">
          <Icon
            name="caret-left"
            size="4x"
            style={{ color: '#0083cd' }}
            onClick={() => {
              const slideViewWrapWidth = this.slideViewWrap.offsetWidth;
              const slideItemWdith = +this.props.contentwidth + 20;
              const integrityNum = Math.floor(slideViewWrapWidth / slideItemWdith);
              let left = +this.state.sliderleft + (integrityNum * slideItemWdith);
              if (left > 0) {
                left = 0;
              }
              this.setState({
                sliderleft: `${left}`,
              });
            }}
          />
        </div>
        <div
          className="slider-wrap cols col-10"
          ref={(node) => {
            this.slideViewWrap = node;
          }}
        >
          <div className="slider" >
            <nobr
              style={{
                left: `${this.state.sliderleft}px`,
                transition: 'left 1.5s',
              }}
              ref={(node) => {
                this.slideWrap = node;
              }}
            >
              {
                this.props.slidelist.map((item) => {
                  const text = item.get(this.props.slidekey);
                  return (
                    <Button
                      className="slide-content"
                      size="lg"
                      theme="primary"
                      text={text}
                      style={{
                        margin: '10px',
                        width: `${this.props.contentwidth}px`,
                      }}
                      onClick={() => {
                        this.onSlideBtnClick(item);
                      }}
                    />
                  );
                })
              }
            </nobr>
          </div>
        </div>
        <div className="cols col-1" style={{ textAlign: 'right' }}>
          <Icon
            name="caret-right"
            size="4x"
            style={{ color: '#0083cd' }}
            onClick={() => {
              const slideViewWrapWidth = this.slideViewWrap.offsetWidth;
              const slideItemWdith = +this.props.contentwidth + 20;
              const integrityNum = Math.floor(slideViewWrapWidth / slideItemWdith);
              const left = +this.state.sliderleft - (integrityNum * slideItemWdith);
              if (Math.abs(left) < this.slideWrap.offsetWidth) {
                this.setState({
                  sliderleft: `${left}`,
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

SlideViewer.propTypes = propTypes;
SlideViewer.defaultProps = defaultProps;

export default SlideViewer;
