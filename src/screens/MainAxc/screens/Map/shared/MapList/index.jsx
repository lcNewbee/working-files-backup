import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { List, Map, fromJS } from 'immutable';
import classnames from 'classnames';
import {
  Modal, FormGroup, SaveButton, Icon, Button,
} from 'shared/components';

// @@product(axcMonitor):
let isMoniterAc = false;

// @@product(axcMonitor):
if (window.guiConfig.versionCode >= 30900 && window.guiConfig.versionCode < 30949) {
  isMoniterAc = true;
}


const propTypes = {
  $$mapList: PropTypes.instanceOf(List),
  actionable: PropTypes.bool,
  app: PropTypes.instanceOf(Map),

  // 操作函数
  onSelectMap: PropTypes.func,
  fetch: PropTypes.func,
  save: PropTypes.func,
  saveFile: PropTypes.func,
  receiveScreenData: PropTypes.func,
  createModal: PropTypes.func,
  validateAll: PropTypes.func,
  reportValidError: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  visible: PropTypes.bool,

  // 参数
  groupid: PropTypes.any,
  buildId: PropTypes.any,
};

const defaultProps = {};


export default class MapList extends React.PureComponent {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'deleteMapList',
      'fetchMapList',
      'onSaveMap',
      'onAddMap',
      'checkMapData',
      'editMapList',
      'closeModal',
      'toggleVisible',
    ]);

    this.state = {
      backgroundImgUrl: '',
      isModalShow: false,
      visible: props.visible || true,
    };
  }
  componentDidMount() {
    this.fetchMapList();
  }
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.visible !== 'undefined') {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  onSaveMap() {
    const url = 'goform/group/map/list';
    const formElem = this.formElem;
    this.props.validateAll()
      .then(
        (errMsg) => {
          // 数据验证结果
          if (errMsg.isEmpty() && !this.checkMapData()) {
            this.props.saveFile(url, formElem)
              .then(() => {
                this.closeModal();
                this.fetchMapList();
              });
          }
        },
      );
  }

  onAddMap() {
    this.setState({
      isModalShow: true,
      action: 'add',
    });
  }
  toggleVisible() {
    this.setState({
      visible: !this.state.visible,
    });
  }
  closeModal() {
    this.setState({
      backgroundImgUrl: '',
      isModalShow: false,
      id: '',
      mapImg: '',
      mapName: '',
      width: '',
      length: '',
    });
    this.props.resetVaildateMsg();
  }
  checkMapData() {
    const mapId = this.state.id;
    const mapName = this.state.mapName;
    const $$mapList = this.props.$$mapList;
    const hasSameNameText = __('Same %s item already exists', __('name'));
    let retMsg = '';

    if ($$mapList.filterNot($$item => $$item.get('id') === mapId).find($$item => $$item.get('mapName') === mapName)) {
      this.props.createModal({
        type: 'alert',
        text: hasSameNameText,
      });
      retMsg = hasSameNameText;
    }

    return retMsg;
  }
  fetchMapList() {
    const url = 'goform/group/map/list';

    this.props.fetch(url, {
      groupid: this.props.groupid,
      buildId: this.props.buildId,
    }).then(
      (json) => {
        if (json && json.state && json.state.code === 2000) {
          if (json && json.data) {
            this.props.receiveScreenData({
              maps: json.data,
            });
            this.props.onSelectMap(fromJS(json.data.list[0]))
          }
        }
      },
    );
  }
  deleteMapList(mapId) {
    const url = 'goform/group/map/list';

    this.props.save(url, {
      groupid: this.props.groupid,
      action: 'delete',
      selectedList: [mapId],
    }).then(
      (json) => {
        if (json && json.state && json.state.code === 2000) {
          this.fetchMapList();
        }
      },
    );
  }
  editMapList($$map) {
    this.setState($$map.merge({
      action: 'edit',
      isModalShow: true,
      mapImg: $$map.get('backgroundImg'),
      backgroundImgUrl: $$map.get('backgroundImg'),
    }).toJS());
  }
  render() {
    const { actionable, $$mapList, onSelectMap, app, activeId } = this.props;
    const { visible } = this.state;
    const invalidMsg = app.get('invalid');
    const validateProps = {
      validateAt: app.get('validateAt'),
      onValidError: this.props.reportValidError,
    };
    const containerClassname = classnames({
      'o-list o-map-list': true,
      'o-map-list--minimized': !visible,
    });
    const iconPromptClassname = classnames({
      'o-map-list__prompt': true,
      open: visible,
    });
    let mapRatio = '1024 * 760';

    if (this.state.width && this.state.length) {
      mapRatio = `1024 * ${parseInt((this.state.width * 1024) / this.state.length, 10)}`;
    }

    return (
      <div className={containerClassname}>
        <div
          className="o-list__header"
          onClick={() => {
            this.toggleVisible();
          }}
        >
          <Icon
            name="list"
            className="fl o-map-list__toggle"
          />
          {__('Floor Plans')}
          <Icon
            name={visible ? 'angle-double-down' : 'angle-double-up'}
            className={iconPromptClassname}
          />
        </div>
        <div className="o-map-list__content">
          {
            $$mapList.map(($$map) => {
              const mapId = $$map.getIn(['id']);
              const mapName = $$map.getIn(['mapName']);
              const imgUrl = $$map.getIn(['backgroundImg']);
              const mapItemClass = classnames('m-thumbnail', {
                active: mapId === activeId,
              });

              if (mapId === -100) {
                return null;
              }

              return (
                <div key={mapId}>
                  <div
                    className={mapItemClass}
                  >
                    {
                      actionable ? (
                        <Icon
                          name="times"
                          className="close"
                          onClick={
                            () => {
                              this.deleteMapList(mapId);
                            }
                          }
                        />
                      ) : null
                    }
                    {
                      actionable ? (
                        <Icon
                          name="edit"
                          className="edit"
                          onClick={
                            () => {
                              this.editMapList($$map);
                            }
                          }
                        />
                      ) : null
                    }

                    <div
                      className="m-thumbnail__content"
                      onClick={() => {
                        onSelectMap($$map);
                      }}
                    >
                      <img
                        src={imgUrl}
                        draggable="false"
                        alt={mapName}
                      />
                    </div>
                    <div
                      className="m-thumbnail__caption"
                      onClick={() => onSelectMap($$map)}
                    >
                      {mapName}
                    </div>
                  </div>
                </div>
              );
            })
          }
          {
            actionable ? (
              <div className="m-thumbnail m-thumbnail--add">
                <Button
                  icon="plus"
                  theme="primary"
                  className="a-btn--block"
                  text={__('Add Map')}
                  onClick={this.onAddMap}
                />
              </div>
            ) : null
          }
        </div>

        <Modal
          title={__('Add')}
          isShow={this.state.isModalShow}
          onClose={() => {
            this.closeModal();
          }}
          noFooter
          customBackdrop
        >
          <form
            action="goform/group/map/list"
            method="POST"
            encType="multipart/form-data"
            ref={(formElem) => {
              if (formElem) {
                this.formElem = formElem;
              }
            }}
          >
            <input
              type="hidden"
              name="groupid"
              value={this.props.groupid}
            />
            <input
              type="hidden"
              name="id"
              value={this.state.id}
            />
            <input
              type="hidden"
              name="action"
              value={this.state.action}
            />
            <input
              type="hidden"
              name="buildId"
              value={this.props.buildId}
            />

            <FormGroup
              label={__('Name')}
              value={this.state.mapName}
              name="mapName"
              onChange={
                (data) => {
                  this.setState({
                    mapName: data.value,
                  });
                }
              }
              required
              errMsg={invalidMsg.get('mapName')}
              {...validateProps}
            />
            <FormGroup
              label={__('Physical Length')}
              value={this.state.length}
              name="length"
              type="number"
              min="1"
              onChange={
                (data) => {
                  this.setState({
                    length: data.value,
                  });
                }
              }
              help={__('Meter')}
              {...validateProps}
              errMsg={invalidMsg.get('length')}
              required
            />
            <FormGroup
              label={__('Physical Width')}
              value={this.state.width}
              name="width"
              type="number"
              min="1"
              onChange={
                (data) => {
                  this.setState({
                    width: data.value,
                  });
                }
              }
              help={__('Meter')}
              {...validateProps}
              errMsg={invalidMsg.get('width')}
              required
            />
            {
              // @@product(axcMonitor): 该产品可配置监控区域
              isMoniterAc ? ([
                <FormGroup
                  label={__('Rows')}
                  key="rows"
                  value={this.state.rows}
                  name="rows"
                  type="number"
                  min="1"
                  defaultValue="4"
                  onChange={
                    (data) => {
                      this.setState({
                        rows: data.value,
                      });
                    }
                  }
                  {...validateProps}
                  errMsg={invalidMsg.get('rows')}
                  required
                />,
                <FormGroup
                  label={__('Column')}
                  value={this.state.column}
                  key="column"
                  name="column"
                  type="number"
                  min="1"
                  defaultValue="4"
                  onChange={
                    (data) => {
                      this.setState({
                        column: data.value,
                      });
                    }
                  }
                  {...validateProps}
                  errMsg={invalidMsg.get('column')}
                  required
                />,
              ]) : null
            }

            <FormGroup
              label={__('Backgroud Image')}
              value={this.state.mapImg}
              name="mapImg"
              type="file"
              onChange={(data, evt) => {
                const selectFile = evt.target.files[0];
                utils.dom.previewFile(selectFile).then(
                  (url) => {
                    this.setState({
                      mapImg: data.value,
                      backgroundImgUrl: url,
                    });
                  },
                );
              }}
              help={__('Image ratio: %s', mapRatio)}
              {...validateProps}
              errMsg={invalidMsg.get('mapImg')}
              required
            />
            <p
              style={{
                textAlign: 'center',
                marginBottom: '1em',
              }}
            >
              {
                this.state.backgroundImgUrl ? (
                  <img
                    src={this.state.backgroundImgUrl}
                    alt="img"
                    style={{
                      height: '160px',
                      backgroundColor: '#efefef',
                    }}
                    onLoad={
                      () => {
                        // 清除图片预览缓存
                        if (typeof URL.revokeObjectURL === 'function') {
                          URL.revokeObjectURL(this.state.backgroundImgUrl);
                        }
                      }
                    }
                  />
                ) : null
              }
            </p>
            <div className="form-group form-group--save">
              <div className="form-control">
                <SaveButton
                  type="button"
                  text={__('Apply')}
                  savingText={__('Applying')}
                  savedText={__('Applied')}
                  onClick={this.onSaveMap}
                />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

MapList.propTypes = propTypes;
MapList.defaultProps = defaultProps;
