import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import urls from 'shared/config/urls';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'shared/utils/lib/validator';
import { FormGroup } from 'shared/components/Form';
import Select from 'shared/components/Select';
import { Button, SaveButton } from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as myActions from './actions';
import myReducer from './reducer';
import './index.scss';

const MSG = {
  Seconds: _('Seconds'),
  minutes: _('Minutes'),
  hour: _('Hour'),
  hours: _('Hours'),
  days: _('Days'),
  userDef: _('User Defined'),
  imageDes: _('Select 1-3 slide pictures of dimension 640px*640px'),
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

export const Portal = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      imageStatus1: 'default',
      imageStatus2: 'default',
      imageStatus3: 'default',
    };
  },

  componentWillMount() {
    this.props.fetchPortalSettings();
  },

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchPortalSettings();
    }
  },

  componentWillUnmount() {
    this.props.resetVaildateMsg();
  },

  onUpdateSettings(name) {
    return function (data) {
      const settings = {};

      settings[name] = data.value;
      this.props.changePortalSettings(settings);
    }.bind(this);
  },

  onSave() {
    this.props.validateAll((invalid) => {
      if (invalid.isEmpty()) {
        this.props.setPortal();
      }
    });
  },

  onChangeImage(i) {
    return function (e) {
      let data = {};
      let filePath = e.target.value;
      let extension = utils.getExtension(filePath);

      if (!filePath) {
        this.props.createModal({
          id: 'admin',
          role: 'alert',
          text: _('Please select a upload image'),
        });
        return;
      }

      if ('png,gif,jpg,bmp'.indexOf(extension) === -1) {
        this.props.createModal({
          id: 'admin',
          role: 'alert',
          text: _('Please select a upload image'),
        });

        e.target.value = '';
        this.restImageStatus(i);
        return;
      }

      data['imageStatus' + i] = 'selected';
      this.setState(utils.extend({}, this.state, data));
    }.bind(this);
  },

  restImageStatus(i) {
    let input = document.getElementById('filename' + i);
    let data = {};

    data['imageStatus' + i] = 'default';
    this.setState(utils.extend({}, this.state, data));
    input.value = '';
  },

  imageUploading(i) {
    let data = {};

    data['imageStatus' + i] = 'loading';
    this.setState(utils.extend({}, this.state, data));
  },

  onUploadImage(i) {
    const that = this;

    return function () {
      let input = document.getElementById('filename' + i);
      let formElem = document.getElementById('imageForm' + i);
      let data, extension;

      if (!input.value) {
        that.props.createModal({
          id: 'admin',
          role: 'alert',
          text: _('Please select a upload image'),
        });
        return;
      }

      extension = utils.getExtension(input.value);

      if (that.state['imageStatus' + i] !== 'selected') {
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
        .then(function (rq) {
          that.restImageStatus(i);
          that.props.fetchPortalSettings();
        });
      } else {
        that.imageUploading(i);
        formElem.submit();
        that.restImageStatus(i);
        that.props.fetchPortalSettings();
      }
    };
  },

  getCurrData(name, defaultVal) {
    const myDefault = defaultVal || '';

    return this.props.store.getIn(['data', 'curr', name]) || myDefault;
  },

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

    return (

      <div>
        <h3>{_('Portal Settings')}</h3>
        <FormGroup
          label={_('Portal Name')}
          name="portalname"
          value={getCurrData('portalname')}
          onChange={this.onUpdateSettings('portalname')}
          required
          {...portalname}
        />
        <FormGroup
          label={_('Auth Redirect URL')}
          name="url"
          value={getCurrData('url')}
          onChange={this.onUpdateSettings('url')}
          {...url}
        />
        <FormGroup
          label={_('Portal Title')}
          name="title"
          value={getCurrData('title')}
          onChange={this.onUpdateSettings('title')}
          required
          {...title}
        />

        <FormGroup
          label={_('Expiration')}
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
          label={_('Images Slide Interval')}
          type="select"
          options={refreshtimeOtions}
          name="refreshtime"
          value={getCurrData('refreshtime')}
          onChange={this.onUpdateSettings('refreshtime')}
          {...refreshtime}
        />

        <div className="images-list">
          <p className="form-group">{MSG.imageDes}</p>
          {
            images ? images.map(function (item) {
              return <img src={item.get('url')} key={item.get('count')} />;
            }) : null
          }
        </div>

        <iframe id="imagesIf" name="imagesIf" className="none"></iframe>
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
                  text={_('Upload Image') + ' 1'}
                  icon="upload"
                  loading={this.state.imageStatus1 === 'loading'}
                  role={this.state.imageStatus1 === 'selected' ? 'info' : undefined}
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
                  text={_('Upload Image') + ' 2'}
                  icon="upload"
                  style={uploadStyles}
                  loading={this.state.imageStatus2 === 'loading'}
                  role={this.state.imageStatus2 === 'selected' ? 'info' : undefined}
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
                  text={_('Upload Image') + ' 3'}
                  icon="upload"
                  style={uploadStyles}
                  loading={this.state.imageStatus3 === 'loading'}
                  role={this.state.imageStatus3 === 'selected' ? 'info' : undefined}
                  onClick={this.onUploadImage(3)}
                />
              )
            }

          </div>
        </form>

        <div className="form-group form-group-save">
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
    );
  },
});

Portal.propTypes = propTypes;

// React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  let myState = state.portal;

  return {
    store: state.portal,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    myActions
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Portal);

export const reducer = myReducer;
