import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'utils';
import { fromJS, List } from 'immutable';
import { Button, Icon } from 'shared/components';


const propTypes = {
  slidedirection: PropTypes.string,
  slidelist: PropTypes.instanceOf(List),
  slidekey: PropTypes.string,
  onSlideBtnClick: PropTypes.func,
};

const defaultProps = {
  slidedirection: 'horizontal',
  slidelist: fromJS([]),
  slidekey: '',
};

class SlideViewer extends Component {
  constructor(props) {
    super(props);

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
    const wrapwidth = this.props.slidedirection === 'horizontal' ? '100%' : 'auto';
    const wrapheight = this.props.slidedirection === 'vertical' ? '100%' : 'auto';
    return (
      <div
        className="wrap row"
        style={{
          width: wrapwidth,
          height: wrapheight,
          padding: '20px',
          border: '1px solid #ccc',
        }}
      >
        <div className="cols col-1">
          <Icon
            name="caret-left"
            size="3x"
            style={{ color: '#0083cd' }}
          />
        </div>
        <div
          className="slider-wrap cols col-10"
          style={{
            overflow: 'hidden',
            backgroundColor: '#999',
          }}
        >
          <div
            className="slider"
          >
            <nobr
              style={{
                position: 'relative',
                left: '-200px',
              }}
            >
              {
                this.props.slidelist.map((item) => {
                  const text = item.get(this.props.slidekey);
                  return (
                    <Button
                      size="lg"
                      theme="primary"
                      text={text}
                      style={{ margin: '10px' }}
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
          />
        </div>
      </div>
    );
  }
}

SlideViewer.propTypes = propTypes;
SlideViewer.defaultProps = defaultProps;

export default SlideViewer;
