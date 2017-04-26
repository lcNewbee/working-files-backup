import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import urls from 'shared/config/urls';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import validator from 'shared/validator';
import { FormGroup } from 'shared/components/Form';
import Select from 'shared/components/Select';
import { Button, SaveButton } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import PureComponent from 'shared/components/Base/PureComponent';
import * as myActions from './actions';
import myReducer from './reducer';
import './index.scss';

const MSG = {
  Seconds: __('Seconds'),
  minutes: __('Minutes'),
  hour: __('Hour'),
  hours: __('Hours'),
  days: __('Days'),
  userDef: __('User Defined'),
  imageDes: __('Select 1-3 slide pictures of dimension 640px*640px'),
};

const validOptions = fromJS({
  portalname: validator({
    rules: 'len:[1, 64]',
  }),
  url: validator({
    rules: 'url',
  }),
  title: validator({
    rules: 'url',
  }),
  timeout: validator({
    rules: 'required',
  }),
  refreshtime: validator({
    rules: 'required',
  }),
});

const propTypes = {
  reqeustFetchPortal: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List),
};

export class Portal extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onUpdateSettings',
      'onSave',
      'onChangeImage',
      'restImageStatus',
      'imageUploading',
      'onUploadImage',
      'getCurrData',
    ]);

    this.state = {
      imageStatus1: 'default',
      imageStatus2: 'default',
      imageStatus3: 'default',
      activeIndex: 0,
    };
  }

  componentWillMount() {
    this.props.fetchPortalSettings();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchPortalSettings();
    }
  }

  componentWillUnmount() {
    this.props.resetVaildateMsg();
  }

  onUpdateSettings(name) {
    return function (data) {
      const settings = {};

      settings[name] = data.value;
      this.props.changePortalSettings(settings);
    }.bind(this);
  }

  onSave() {
    this.props.validateAll()
      .then((invalid) => {
        if (invalid.isEmpty()) {
          this.props.setPortal();
        }
      });
  }

  onChangeImage(i) {
    return function (e) {
      let data = {};
      let filePath = e.target.value;
      let extension = utils.getExtension(filePath);

      if (!filePath) {
        this.props.createModal({
          id: 'admin',
          role: 'alert',
          text: __('Please select a upload image'),
        });
        return;
      }

      if ('png,gif,jpg,bmp'.indexOf(extension) === -1) {
        this.props.createModal({
          id: 'admin',
          role: 'alert',
          text: __('Please select a upload image'),
        });

        e.target.value = '';
        this.restImageStatus(i);
        return;
      }

      data['imageStatus' + i] = 'selected';
      this.setState(utils.extend({}, this.state, data));
    }.bind(this);
  }

  restImageStatus(i) {
    let input = document.getElementById('filename' + i);
    let data = {};

    data['imageStatus' + i] = 'default';
    this.setState(utils.extend({}, this.state, data));
    input.value = '';
  }

  imageUploading(i) {
    let data = {};

    data['imageStatus' + i] = 'loading';
    this.setState(utils.extend({}, this.state, data));
  }

  onUploadImage(i) {
    const that = this;

    return () => {
      const input = document.getElementById(`filename${i}`);
      const formElem = document.getElementById(`imageForm${i}`);
      let extension = '';
      let data;

      if (!input.value) {
        that.props.createModal({
          id: 'admin',
          role: 'alert',
          text: __('Please select a upload image'),
        });
        return;
      }

      extension = utils.getExtension(input.value);

      if (that.state[`imageStatus${i}`] !== 'selected') {
        return;
      }

      //
      if (typeof FormData === 'function') {
        data = new FormData();
        data.append('filename', input.files[0]);
        data.append('pid', that.getCurrData('pid'));
        data.append('count', i);
        data.append('suffix', extension);
        that.imageUploading(i);

        fetch(urls.uploadPortalImage, {
          method: 'POST',
          body: data,
        })
        .then(() => {
          that.restImageStatus(i);
          this.setState({
            activeIndex: i - 1,
          });
          that.props.fetchPortalSettings();
        });
      } else {
        that.imageUploading(i);
        formElem.submit();
        that.restImageStatus(i);
        this.setState({
          activeIndex: i - 1,
        });
        that.props.fetchPortalSettings();
      }
    };
  }

  getCurrData(name, defaultVal) {
    const myDefault = defaultVal || '';

    return this.props.store.getIn(['data', 'curr', name]) || myDefault;
  }

  render() {
    const { getCurrData } = this;
    const images = getCurrData('image');
    // validate const
    const {
      portalname, url, title, timeout, refreshtime,
    } = this.props.validateOption;
    const refreshtimeOtions = [
      {
        value: '2',
        label: '2 ' + MSG.Seconds,
      }, {
        value: '3',
        label: '3 ' + MSG.Seconds,
      }, {
        value: '5',
        label: '5 ' + MSG.Seconds,
        default: true,
      }, {
        value: '10',
        label: '10 ' + MSG.Seconds,
      }, {
        value: '20',
        label: '20 ' + MSG.Seconds,
      },
    ];
    // minutes
    const expirationOptions = [
      {
        value: '600',
        label: '10 ' + MSG.minutes,
      }, {
        value: '1200',
        label: '20 ' + MSG.minutes,
      }, {
        value: '1800',
        label: '30 ' + MSG.minutes,
      }, {
        value: '3600',
        label: '1 ' + MSG.hour,
      }, {
        value: '14400',
        label: '4 ' + MSG.hours,
      }, {
        value: '28800',
        label: '8 ' + MSG.hours,
      }, {
        value: '86400',
        label: '24 ' + MSG.hours,
      }, {
        value: '172800',
        label: '2 ' + MSG.days,
      }, {
        value: '259200',
        label: '3 ' + MSG.days,
      }, {
        value: '432000',
        label: '5 ' + MSG.days,
      }, {
        value: '604800',
        label: '7 ' + MSG.days,
      },
    ];
    const uploadStyles = {
      marginLeft: '8px',
    };
    const noControl = this.props.app.get('noControl');
    const activeIndex = this.state.activeIndex;
    const curImgUrl = this.props.store.getIn([
      'data', 'curr', 'image', activeIndex, 'url',
    ]);

    return (
      <div className="row">
        <h3>{__('Portal Settings')}</h3>
        <div className="cols col-7">
          <FormGroup
            label={__('Portal Name')}
            name="portalname"
            value={getCurrData('portalname')}
            onChange={this.onUpdateSettings('portalname')}
            required
            {...portalname}
          />
          <FormGroup
            label={__('Auth Redirect URL')}
            name="url"
            value={getCurrData('url')}
            onChange={this.onUpdateSettings('url')}
            {...url}
          />
          <FormGroup
            label={__('Portal Title')}
            name="title"
            value={getCurrData('title')}
            onChange={this.onUpdateSettings('title')}
            required
            {...title}
          />
          <FormGroup
            label={__('Expiration')}
            value={getCurrData('timeout')}
            {...timeout}
          >
            <Select
              name="timeout"
              options={expirationOptions}
              value={getCurrData('timeout')}
              onChange={this.onUpdateSettings('timeout')}
              clearable={false}
              searchable={false}
            />
          </FormGroup>

          <FormGroup
            label={__('Images Slide Interval')}
            type="select"
            options={refreshtimeOtions}
            name="refreshtime"
            value={getCurrData('refreshtime')}
            onChange={this.onUpdateSettings('refreshtime')}
            {...refreshtime}
          />
          <iframe id="imagesIf" name="imagesIf" className="none" />
          <p style={{ marginBottom: '4px' }}>{MSG.imageDes}</p>
          <form
            className="form-group"
            action={urls.uploadPortalImage}
            id="imageForm1"
            method="POST"
            target="imagesIf"
            encType="multipart/form-data"
          >
            <div className="form-control">
              <input type="hidden" name="count" value="1" />
              <input type="hidden" name="pid" value={getCurrData('pid')} />
              <input
                type="file"
                className="text"
                id="filename1"
                name="filename"
                onChange={this.onChangeImage('1')}
              />
              {
                noControl ? null : (
                  <Button
                    type="button"
                    text={__('Upload Image') + ' 1'}
                    icon="upload"
                    loading={this.state.imageStatus1 === 'loading'}
                    theme={this.state.imageStatus1 === 'selected' ? 'info' : undefined}
                    style={uploadStyles}
                    onClick={this.onUploadImage(1)}
                  />
                )
              }

            </div>
          </form>

          <form
            className="form-group"
            action={urls.uploadPortalImage}
            id="imageForm2"
            method="POST"
            target="imagesIf"
            encType="multipart/form-data"
          >
            <div className="form-control">
              <input type="hidden" name="count" value="2" />
              <input type="hidden" name="pid" value={getCurrData('pid')} />
              <input
                type="file"
                className="text"
                id="filename2"
                name="filename"
                onChange={this.onChangeImage('2')}
              />

              {
                noControl ? null : (
                  <Button
                    type="button"
                    text={__('Upload Image') + ' 2'}
                    icon="upload"
                    style={uploadStyles}
                    loading={this.state.imageStatus2 === 'loading'}
                    theme={this.state.imageStatus2 === 'selected' ? 'info' : undefined}
                    onClick={this.onUploadImage(2)}
                  />
                )
              }
            </div>
          </form>

          <form
            className="form-group"
            action={urls.uploadPortalImage}
            id="imageForm3"
            method="POST"
            target="imagesIf"
            encType="multipart/form-data"
          >
            <div className="form-control">
              <input type="hidden" name="count" value="3" />
              <input type="hidden" name="pid" value={getCurrData('pid')} />
              <input
                type="file"
                className="text"
                id="filename3"
                name="filename"
                onChange={this.onChangeImage('3')}
              />

              {
                noControl ? null : (
                  <Button
                    type="button"
                    text={__('Upload Image') + ' 3'}
                    icon="upload"
                    style={uploadStyles}
                    loading={this.state.imageStatus3 === 'loading'}
                    theme={this.state.imageStatus3 === 'selected' ? 'info' : undefined}
                    onClick={this.onUploadImage(3)}
                  />
                )
              }

            </div>
          </form>

          <div className="form-group form-group--save">
            <div className="form-control">
              {
                noControl ? null : (
                  <SaveButton
                    type="button"
                    loading={this.props.app.get('saving')}
                    onClick={this.onSave}
                  />
                )
              }
            </div>
          </div>
        </div>
        <div className="cols col-5">
          <div className="o-preview-iphone">
            <div className="o-preview-iphone__body">
              <div className="carousel">
                {
                  curImgUrl ? (
                    <img
                      src={curImgUrl}
                      alt={activeIndex}
                    />
                  ) : null
                }
                <ul className="carousel-indicators">
                  {
                    [1, 2, 3].map(
                      (val) => {
                        let myClassName = '';

                        if (val === activeIndex + 1) {
                          myClassName = 'active';
                        }

                        return (
                          <li
                            key={val}
                            className={myClassName}
                            onClick={() => this.setState({
                              activeIndex: val - 1,
                            })}
                          >
                            {val}
                          </li>
                        );
                      },
                    )
                  }
                </ul>
              </div>
              <h4 className="o-preview-iphone__body-title">{getCurrData('title')}</h4>
              <Button
                type="button"
                theme="primary"
                text={__('Click on Internet')}
                id="online"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Portal.propTypes = propTypes;

// React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  return {
    store: state.portal,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    myActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Portal);

export const reducer = myReducer;
