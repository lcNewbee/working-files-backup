import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { Icon, FormInput, EchartReact, Select } from 'shared/components';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

import './index.scss';

const propTypes = {};
const defaultProps = {};

export default class MainDashboard extends Component {
  constructor(props) {
    super(props);
    this.renderTopCards = this.renderTopCards.bind(this);
  }

  renderTopCards() {
    // const curScreenId = this.props.store.get('curScreenId');
    // const query = this.props.store.getIn([curScreenId, 'query']);

    return (
      <div className="m-dsb-cards-row row">
        {/* <div className="cols col-3 top-card-wrap">
          <div className="rw-card-top">
            <div className="fl rw-card-top__img">
              <Icon
                name="user-o"
              />
            </div>
            <div className="fl">
              wens
            </div>
          </div>
        </div> */}

        <div className="top-card-wrap cols col-3">
          <div className="top-card cols col-12">
            <div className="top-card-left cols col-5">
              <div className="card-left-img">
                <Icon
                  name="user-o"
                />
              </div>
            </div>
            <div className="top-card-right cols col-7">
              <div className="card-right-title">
                visitor today
              </div>
              <div className="card-right-data clearfix">
                <div className="right-data-num fl">
                  2323
                </div>
                <div className="right-data-unit fl">
                  people
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-card-wrap cols col-3">
          <div className="top-card cols col-12">
            <div className="top-card-left cols col-5">
              <div className="card-left-img">
                <Icon
                  name="user-o"
                />
              </div>
            </div>
            <div className="top-card-right cols col-7">
              <div className="card-right-title">
                visitor today
              </div>
              <div className="card-right-data clearfix">
                <div className="right-data-num fl">
                  2323
                </div>
                <div className="right-data-unit fl">
                  people
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-card-wrap cols col-3">
          <div className="top-card cols col-12">
            <div className="top-card-left cols col-5">
              <div className="card-left-img">
                <Icon
                  name="user-o"
                />
              </div>
            </div>
            <div className="top-card-right cols col-7">
              <div className="card-right-title">
                visitor today
              </div>
              <div className="card-right-data clearfix">
                <div className="right-data-num fl">
                  2323
                </div>
                <div className="right-data-unit fl">
                  people
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-card-wrap cols col-3">
          <div className="top-card cols col-12">
            <div className="top-card-left cols col-5">
              <div className="card-left-img">
                <Icon
                  name="user-o"
                />
              </div>
            </div>
            <div className="top-card-right cols col-7">
              <div className="card-right-title">
                visitor today
              </div>
              <div className="card-right-data clearfix">
                <div className="right-data-num fl">
                  2323
                </div>
                <div className="right-data-unit fl">
                  people
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {

    // const query = this.props.store.getIn([curScreenId, 'query']);
    return (
      <AppScreen
        {...this.props}
        className="rw-main-dashboard"
      >
        <div className="m-dsb-wrap">
          {/* 顶部卡片 */
            this.renderTopCards()
          }


          {/* Map View head */}
          <div className="m-dsb-head-bar row">
            <div className="head-bar-left cols col-11">
              <div className="bar-left-left cols col-3">
                Map View
              </div>
              <div className="bar-left-middle cols col-5">
                <div className="middle-map-view cols col-3">
                  <div className="cols col-3">AP</div>
                  <div className="cols col-3 col-offset-1">21</div>
                  <div className="cols col-3 col-offset-1">0</div>
                </div>
                <div className="middle-map-view cols col-3 col-offset-1">
                  <div className="cols col-3">2.4G</div>
                  <div className="cols col-3 col-offset-1">2221</div>
                  <div className="cols col-3 col-offset-1">0</div>
                </div>
                <div className="middle-map-view cols col-3 col-offset-1">
                  <div className="cols col-3">5G</div>
                  <div className="cols col-3 col-offset-1">21</div>
                  <div className="cols col-3 col-offset-1">0</div>
                </div>
              </div>
              <div className="bar-left-right cols col-4">
                <FormInput
                  type="select"
                  className="fr"
                />
              </div>
            </div>
            <div className="head-bar-right cols col-1">
              <Icon
                name="chevron-down"
                className="cols col-3 col-offset-2"
              />
              <Icon
                name="times"
                className="cols col-3 col-offset-2"
              />
            </div>
          </div>

          {/* Map View body */}
          <div className="m-dsb-map-view">

          </div>

          {/* Wireless Trend */}
          <div className="m-dsb-head-bar row">
            <div className="head-bar-left cols col-11">
              <div className="bar-left-left cols col-3">
                Wireless Trend
              </div>
              <div className="bar-left-middle cols col-5">
              </div>
              <div className="bar-left-right cols col-4">
                <FormInput
                  type="select"
                  style={{ width: '120px' }}
                />
                <FormInput
                  type="select"
                  style={{ width: '120px' }}
                />
                <FormInput
                  type="select"
                  style={{ width: '120px' }}
                />


              </div>
            </div>
            <div className="head-bar-right cols col-1">
              <Icon
                name="chevron-down"
                className="cols col-3 col-offset-2"
              />
              <Icon
                name="times"
                className="cols col-3 col-offset-2"
              />
            </div>
          </div>

          {/* <div className="t-overview__section">
            <div className="element t-overview__section-header">
              <h3>
                <span
                  style={{
                    marginRight: '16px',
                  }}
                >
                  {__('The Past Hours')}
                </span>
                <Select
                  options={[
                    { value: 1, label: __('1 Hour') },
                    { value: 10, label: __('10 Hours') },
                    { value: 24, label: __('24 Hours') },
                    { value: 48, label: __('48 Hours') },
                  ]}
                  value={query.get('timeRange')}
                  onChange={(data) => {
                    this.props.changeScreenQuery({ timeRange: data.value });
                    this.props.fetchScreenData();
                  }}
                  clearable={false}
                />
                <span
                  style={{
                    marginRight: '16px',
                    marginLeft: '30px',
                  }}
                >
                  {__('Graphic Type')}
                </span>
                <Select
                  options={[
                    { value: 'down', label: __('Download') },
                    { value: 'up', label: __('Upload') },
                  ]}
                  value={this.state.graphicType}
                  onChange={(data) => { this.setState({ graphicType: data.value }); }}
                  clearable={false}
                />
                <span
                  style={{
                    marginRight: '16px',
                    marginLeft: '30px',
                  }}
                >
                  {__('Port Name')}
                </span>
                <Select
                  options={generatePortNameOption(interfaceList)}
                  value={query.get('portName')}
                  onChange={(data) => {
                    this.props.changeScreenQuery({ portName: data.value });
                    this.props.fetchScreenData();
                  }}
                  clearable={false}
                />
              </h3>
            </div>
            <div className="element">
              <EchartReact
                option={this.generateEchartOption()}
                className="o-box__canvas ntw-dsb-throughput-echart"
              />
            </div>
          </div> */}


          {/* Wired  Status */}
          <div className="m-dsb-head-bar row">
            <div className="head-bar-left cols col-11">
              <div className="bar-left-left cols col-3">
                Wired  Status
              </div>
              <div className="bar-left-middle cols col-5">
              </div>
              <div className="bar-left-right cols col-4">
              </div>
            </div>
            <div className="head-bar-right cols col-1">
              <Icon
                name="chevron-down"
                className="cols col-3 col-offset-2"
              />
              <Icon
                name="times"
                className="cols col-3 col-offset-2"
              />
            </div>
          </div>

          {/* SSIDs */}
          <div className="m-dsb-head-bar row">
            <div className="head-bar-left cols col-11">
              <div className="bar-left-left cols col-3">
                SSIDs
              </div>
              <div className="bar-left-middle cols col-5">
              </div>
              <div className="bar-left-right cols col-4">
              </div>
            </div>
            <div className="head-bar-right cols col-1">
              <Icon
                name="chevron-down"
                className="cols col-3 col-offset-2"
              />
              <Icon
                name="times"
                className="cols col-3 col-offset-2"
              />
            </div>
          </div>

          {/* SSIDs */}
          <div className="m-dsb-head-bar row">
            <div className="head-bar-left cols col-11">
              <div className="bar-left-left cols col-3">
                SSIDs
              </div>
              <div className="bar-left-middle cols col-5">
              </div>
              <div className="bar-left-right cols col-4">
              </div>
            </div>
            <div className="head-bar-right cols col-1">
              <Icon
                name="chevron-down"
                className="cols col-3 col-offset-2"
              />
              <Icon
                name="times"
                className="cols col-3 col-offset-2"
              />
            </div>
          </div>

          {/* Alarms */}
          <div className="m-dsb-head-bar row">
            <div className="head-bar-left cols col-11">
              <div className="bar-left-left cols col-3">
                Alarms
              </div>
              <div className="bar-left-middle cols col-5">
              </div>
              <div className="bar-left-right cols col-4">
              </div>
            </div>
            <div className="head-bar-right cols col-1">
              <Icon
                name="chevron-down"
                className="cols col-3 col-offset-2"
              />
              <Icon
                name="times"
                className="cols col-3 col-offset-2"
              />
            </div>
          </div>

        </div>
      </AppScreen>
    );
  }
}

MainDashboard.propTypes = propTypes;
MainDashboard.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainDashboard);

