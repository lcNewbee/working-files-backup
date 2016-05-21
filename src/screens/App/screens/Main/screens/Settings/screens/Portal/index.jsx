import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {fromJS, Map, List} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'utils/lib/validator';
import * as validateActions from 'actions/valid';
import * as myActions from './actions';
import myReducer from './reducer';
import './index.scss';
import {FormGruop} from 'components/Form/Input';
import Select from 'components/Select';
import Button from 'components/Button';

const msg = {
  'upSpeed': _('Up Speed'),
  'downSpeed': _('Down Speed'),
  'selectGroup': _('Select Group')
};

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
  
  onChangeUpSpeed() {
    
  },
  
  onChangeDownSpeed() {
    
  },
  
  onUpdate(name) {
    return function(e) {
      const elem = e.target;
      let data = {};
      
      if(elem.type !== 'checkbox') {
        data[name] = e.target.value;
      } else {
        
        if(elem.checked) {
          data[name] = '1';
        } else {
          data[name] = '0';
        }
      }
      
      this.props.changePortalSettings(data);
    }.bind(this)
  },
  
  onSave() {
    this.props.setPortal();
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
  
  render() {
    const groupOptions = this.props.data
      .get('list').map(function(item, i) {
        return {
          value: item.get('groupname'),
          label: item.get('groupname')
        }
      }).toJS();
    const currData =  this.props.data.get('curr') || Map({});
   
    return (
      
      <div>
        <h3>{_('Portal Settings')}</h3>
        <FormGruop
          label={_('Portal Name')}
          name="portalname"
          value={currData.get('portalname')}
          updater={this.onUpdate('portalname')}
        />
        <FormGruop
          label={_('Auth Rederict URL')}
          name="url"
          value={currData.get('url')}
          updater={this.onUpdate('url')}
        />
        <FormGruop
          label={_('Title')}
          name="title"
          value={currData.get('title')}
          updater={this.onUpdate('title')}
        />
        <FormGruop
          label={_('Timeout')}
          help={_('Seconds')}
          name="timeout"
          value={currData.get('timeout')}
        />
        
        <FormGruop
          label={_('Images Slider Time')}
          help={_('Seconds')}
          name="refreshtime"
          value={currData.get('refreshtime')}
        />
        
        <div className="images-list">
          <p className="form-group">{_('msg_select_img')}</p>
          {
            currData.get('image') ? currData.get('image').map(function(item){
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
    fetching: myState.get('fetching'),
    data: myState.get('data')
  };
}

export const Screen = connect(
  mapStateToProps,
  myActions
)(Portal);

export const reducer = myReducer;
