import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { List } from 'immutable';
import SaveButton from 'shared/components/Button/SaveButton';
import Icon from 'shared/components/Icon';
import {
  Modal, FormGroup,
} from 'shared/components';

function previewFile(file) {
  const retPromise = new Promise((resolve) => {
    let retUrl = '';
    let reader = null;

    // 如果支持 createObjectURL
    if (URL && URL.createObjectURL) {
      const img = new Image();
      retUrl = URL.createObjectURL(file);
      img.src = retUrl;

      img.onload = () => {
        resolve(retUrl);
        // URL.revokeObjectURL(retUrl);
      };

    // 如果支持 FileReader
    } else if (window.FileReader) {
      reader = new FileReader();
      reader.onload = (e) => {
        retUrl = e.target.result;
        resolve(retUrl);
      };
      reader.readAsDataURL(file);

    // 其他放回 Flase
    } else {
      resolve(retUrl);
    }
  });

  return retPromise;
}

const propTypes = {
  $$mapList: PropTypes.instanceOf(List),
  actionable: PropTypes.bool,

  // 操作函数
  onSelectMap: PropTypes.func,
  fetch: PropTypes.func,
  save: PropTypes.func,
  saveFile: PropTypes.func,
  reciveScreenData: PropTypes.func,

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
    ]);

    this.state = {
      backgroundImgUrl: '',
      isModalShow: false,
    };
  }
  componentDidMount() {
    this.fetchMapList();
  }

  onSaveMap() {
    const url = 'goform/group/map/list';
    const formElem = this.formElem;

    this.props.saveFile(url, formElem)
      .then(() => {
        this.setState({
          isModalShow: false,
        });
        this.fetchMapList();
      });
  }
  onAddMap() {
    this.setState({
      isModalShow: true,
    });
  }
  fetchMapList() {
    const url = 'goform/group/map/list';

    this.props.fetch(url, {
      groupid: this.props.groupid,
      buildId: this.props.buildId,
    }).then(
      (json) => {
        if (json && json.state && json.state.code === 2000) {
          this.props.reciveScreenData({
            maps: json.data,
          });
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
  render() {
    const { actionable, $$mapList, onSelectMap } = this.props;
    let mapRatio = '1024 * 760';

    if (this.state.width && this.state.length) {
      mapRatio = `1024 * ${parseInt((this.state.width * 1024) / this.state.length, 10)}`;
    }
    return (
      <div className="o-map-list">
        {
          $$mapList.map(($$map) => {
            const mapId = $$map.getIn(['id']);
            const mapName = $$map.getIn(['mapName']);
            const imgUrl = $$map.getIn(['backgroundImg']);

            if (mapId === -100) {
              return null;
            }

            return (
              <div className="cols col-3" key={mapId}>
                <div
                  className="m-thumbnail"
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
                    <h3>{mapName}</h3>
                  </div>
                </div>
              </div>
            );
          })
        }
        {
          actionable ? (
            <div
              className="cols col-3"
              onClick={this.onAddMap}
            >
              <div className="o-map-list__add">
                <Icon
                  name="plus"
                  size="3x"
                />
              </div>
            </div>
          ) : null
        }
        <Modal
          title={__('Add')}
          isShow={this.state.isModalShow}
          onClose={() => {
            this.setState({
              backgroundImgUrl: '',
              isModalShow: false,
              mapName: '',
              width: '',
              length: '',
            });
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
              name="action"
              value="add"
            />
            <input
              type="hidden"
              name="buildId"
              value={this.props.buildId}
            />

            <FormGroup
              label={__('Name')}
              value={this.state.mapName}
              name="mapImg"
              onChange={
                (data) => {
                  this.setState({
                    mapName: data.value,
                  });
                }
              }
              required
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
              required
            />
            <FormGroup
              label={__('Backgroud Image')}
              name="mapImg"
              type="file"
              onChange={(data, evt) => {
                const selectFile = evt.target.files[0];

                previewFile(selectFile).then(
                  (url) => {
                    if (url) {
                      this.setState({
                        backgroundImgUrl: url,
                      });
                    }
                  },
                );
              }}
              help={__('Image ratio: %s', mapRatio)}
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
