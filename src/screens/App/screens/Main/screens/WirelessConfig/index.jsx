import React from 'react';
import { connect } from 'react-redux';
import {fromJS, Map} from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';
import Button from 'shared/components/Button';
import Select from 'shared/components/Select'
import {Search, FormGroup, Checkbox,FormInput} from 'shared/components/Form';
import Switchs from 'shared/components/Switchs';
import {Table} from 'shared/components/Table';

const WirelessModes = [
                    {value:"Station",label:'Station'},
                    {value:"AP",label:'AP'},
                    {value:"AP_Repeater",label:'AP_Repeater'}
                    ];
 export const WirelessConfig = React.createClass({
     render(){
         return (
             <div className="wirelessConf">
                <div className="wirelessRadio">
                    <span>{_("Wireless Mode")}</span>
                    <form>
                        <label htmlFor="station"><input id="station" type="radio" value="station" defaultChecked/>{_("Station")}</label>
                        <label htmlFor="ap"><input id="ap" type="radio" value="ap" />{_("AP")}</label>
                        <label htmlFor="ap-repeater"><input id="ap-repeater" type="radio" value="ap-repeater" />{_("AP_Repeater")}</label>
                    </form>
                </div>
                <div className="ssidName">
                    <span id='ssid'>SSID</span>
                    <FormInput
                        type='text'
                        label='ssid'
                        value='AxilSpot'
                    />

                </div>

            </div>
         )
     }
 });

function mapStateToProps(state){
    var myState = state.wirelessconfig;

    return {
        fetching:myState.get('fetching'),
        query:myState.get('query'),
    };
}

export const Screen = connect(
    mapStateToProps,
    actions
)(WirelessConfig);

export const wirelessconfig = reducer;
