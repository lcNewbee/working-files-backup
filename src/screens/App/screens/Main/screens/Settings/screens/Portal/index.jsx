import React, {PropTypes} from 'react';
import utils from 'utils';
import { bindActionCreators } from 'redux';
import {fromJS, Map, List} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'utils/lib/validator';
import * as validateActions from 'actions/valid';
import * as myActions from './actions';
import myReducer from './reducer';
import './index.scss';
import {FormGroup} from 'components/Form';
import Select from 'components/Select';
import Button from 'components/Button';

const MSG = {
  Seconds: _('Seconds'),
  minutes: _('Minutes'),
  hours: _('Hours'),
  days: _('Days'),
  userDef: _('User Defined')
}

const validOptions = Map({
  portalname: validator({
    rules: 'len:[1, 64]'
  }),
  url: validator({
    rules: 'url'
  }),
  title: validator({
    rules: 'url'
  }),
  timeout: validator({
    rules: 'num:[0,9999999]'
  }),
  refreshtime: validator({
    rules: 'num:[0,50]'
  })
});

const propTypes = {
  reqeustFetchPortal: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List)
};

export const Portal = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
    this.props.fetchPortalSettings();
  },
   
  onUpdateSettings(name) {
    return function(data, e) {
      let settings = {};
      
      settings[name] = data.value;
      this.props.changePortalSettings(settings);
    }.bind(this)
  },
  
  onSave() {
    this.props.validateAll(function (invalid) {
      if (invalid.isEmpty()) {
        this.props.setPortal();
      }
    }.bind(this));
  },
  
  onUploadImage(i) {
    return function() {
      var input = document.getElementById('filename' + i);
      
      var data = new FormData();
      
      data.append('filename', input.files[0])
      data.append('count', i)

      fetch('/goform/setPortalImage', {
        method: 'POST',
        body: data
      })
      .then(function(rq) {
      })
    }
  },
  
  getCurrData(name, defaultVal) {
    return this.props.store.getIn(['data', 'curr', name]) || defaultVal;
  },
  
  render() {
    const { getCurrData } = this;
    const images = getCurrData('image');
    
    // validate const
    const {
      portalname, url, title, timeout, refreshtime 
    } = this.props.validateOption;
    const refreshtimeOtions = [
      {
        value: 2,
        label: '2 ' + MSG.Seconds
      }, {
        value: 3,
        label: '3 ' + MSG.Seconds
      }, {
        value: 5,
        label: '5 ' + MSG.Seconds,
        default: true
      }, {
        value: 10,
        label: '10 ' + MSG.Seconds
      }, {
        value: 20,
        label: '20 ' + MSG.Seconds
      }, 
    ];
    // minutes
    const expirationOptions = [
      {
        value: 3600,
        label: '1 ' + MSG.hours
      }, {
        value: 14400,
        label: '4 ' + MSG.hours
      }, {
        value: 28800,
        label: '8 ' + MSG.hours
      }, {
        value: 86400,
        label: '24 ' + MSG.hours
      }, {
        value: 172800,
        label: '2 ' + MSG.days
      }, {
        value: 4320,
        label: '3 ' +  MSG.days
      }, {
        value: 432000,
        label: '5 ' +  MSG.days
      }, {
        value: 604800,
        label: '7 ' +  MSG.days
      },
    ]
   
    return (
      <div>
        <h3>{_('Portal Settings')}</h3>
        <FormGroup
          label={_('Portal Name')}
          name="portalname"
          value={getCurrData('portalname')}
          onChange={this.onUpdateSettings('portalname')}
          required={true}
          {...portalname}
        />
        <FormGroup
          label={ _('Auth Rederict URL') }
          name="url"
          value={getCurrData('url')}
          onChange={this.onUpdateSettings('url')}
          {...url}
        />
        <FormGroup
          label={_('Title')}
          name="title"
          value={getCurrData('title')}
          onChange={this.onUpdateSettings('title')}
          required={true}
          {...title}
        />
        
        <FormGroup
          label={_('Expiration')}
          {...timeout}
        >
          <Select
            name="timeout"
            options={expirationOptions}
            value={getCurrData('timeout')}
            onChange={this.onUpdateSettings('timeout')}
            clearable={ false }
            searchable={ false }
          />
        </FormGroup>
        
        <FormGroup
          label={_('Images Slider Time')}
          type="select"
          options={refreshtimeOtions}
          name="refreshtime"
          value={getCurrData('refreshtime')}
          onChange={this.onUpdateSettings('refreshtime')}
        />
        
        <div className="images-list">
          <p className="form-group">{_('msg_select_img')}</p>
          {
            images ? images.map(function(item){
              return <img src={item.get('image')} key={item.get('count')} />
            }) : null
          }
        </div>
        
        <form
          className="form-group"
          action="/goform/setPortalImage"
          id="imageForm1"
          method="POST"
          encType="multipart/form-data"
        >
          <label htmlFor="filename">
            <Button
              type='button'
              text={_('Upload Image') + ' 1'}
              role="upload"
              onClick={this.onUploadImage(1)}
            />
          </label>
          <div className="form-control">
            <input type="hidden" name="count" value="1"/>
            <input type="file" className="text" id="filename1" name="filename" />
          </div>
        </form>
        
        <form
          className="form-group"
          action="/goform/setPortalImage"
          id="imageForm2"
          method="POST"
          encType="multipart/form-data"
        >
          <label htmlFor="filename">
            <Button
              type='button'
              text={_('Upload Image') + ' 2'}
              role="upload"
              onClick={this.onUploadImage(2)}
            />
          </label>
          <div className="form-control">
            <input type="hidden" name="count" value="2"/>
            <input type="file" className="text" id="filename2" name="filename" />
          </div>
        </form>
        
        <form
          className="form-group"
          action="/goform/setPortalImage"
          id="imageForm3"
          method="POST"
          encType="multipart/form-data"
        >
          <label htmlFor="filename">
            <Button
              type='button'
              text={_('Upload Image') + ' 3'}
              role="upload"
              onClick={this.onUploadImage(3)}
            />
          </label>
          <div className="form-control">
            <input type="hidden" name="count" value="3"/>
            <input type="file" className="text" id="filename3" name="filename" />
          </div>
        </form>
        
        <div className="form-group">
          <div className="form-control">
             <Button
              type='button'
              text={_('Save')}
              role="save"
              onClick={this.onSave}
            />
          </div>
        </div>
       
      </div>
    );
  }
});

Portal.propTypes = propTypes;

//React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  var myState = state.portal;

  return {
    store: state.portal,
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    validateActions,
    myActions
  ), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Portal);

export const reducer = myReducer;
