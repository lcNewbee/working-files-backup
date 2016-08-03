import React, {PropTypes} from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import {fromJS, Map} from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';
import Button from 'shared/components/Button';
import {Search, FormGroup, Checkbox} from 'shared/components/Form';
import Switchs from 'shared/components/Switchs';
import {Table} from 'shared/components/Table';

const msg = {
    REMOTEAPINFO_TITLE:_('Remote AP Info'),
    REMOTESTAINFO_TITLE:_('Remote Station Info'),
    INTERFERENCE_TITLE:_('Interface'),
    LOGINFO_TITLE:_('Log Info')

}

export const Networkmonitor = React.createClass({

    render(){
        const remoteApInfoOptions = fromJS([
            {
                id:"devicename",
                text:_("Device Name ")
            },{
                id:"devicemodel",
                text:_('Device Model')
            },{
                id:"softwareversion",
                text:_('Software Version')
            }
        ]);

        const remoteStaInfoOptions = fromJS([
            {
                id:"mac",
                text:"MAC"
            },{
                id:"devicename",
                text:_("Device Name ")
            },{
                id:"txstrength",
                text:_("TX Singal Strength")
            },{
                id:"rxstrength",
                text:_("RX Singal Strength")
            },{
                id:"noise",
                text:_("Background Noise")
            }
        ]);

        const interfaceInfoOptions = fromJS([
            {
                id:"interface",
                text:_("Interface")
            },{
                id:"mac",
                text:"MAC"
            },{
                id:"mtu",
                text:"MTU"
            },{
                id:"ip",
                text:"IP"
            },{
                id:"txflow",
                text:_("TX Flow")
            },{
                id:"txerror",
                text:_("TX Error")
            },{
                id:"rxflow",
                text:_("RX Flow")
            },{
                id:"rxerror",
                text:_("RX Error")
            }
        ]);

        return (
            <div>
                <div className="remoteApInfo">
                    <h2>{msg.REMOTEAPINFO_TITLE}</h2>
                    <Table
                        className="table"
                        options={remoteApInfoOptions}
                        list={this.props.remoteApInfo}
                    />
                </div>
                <div className="remoteStaInfo">
                    <h2>{msg.REMOTESTAINFO_TITLE}</h2>
                    <Table
                        className="table"
                        options={remoteStaInfoOptions}
                        list={this.props.remoteStaInfo}
                    />
                </div>
                <div className="interface">
                    <h2>{msg.INTERFERENCE_TITLE}</h2>
                    <Table
                        className="table"
                        options={interfaceInfoOptions}
                        list={this.props.interfaceInfo}
                    />
                </div>
                <div className="logInfo">
                    <h2>{msg.LOGINFO_TITLE}</h2>
                </div>
            </div>
        )
    }
});

function mapStateToProps(state){
    var myState = state.networkmonitor;

    return {
        fetching:myState.get('fetching'),
        query:myState.get('query'),
        remoteApInfo:myState.get('remoteApInfo'),
        remoteStaInfo:myState.get('remoteStaInfo'),
        interfaceInfo:myState.get('interfaceInfo'),
        logInfo:myState.get('logInfo')
    }
}

export const Screen = connect(
    mapStateToProps,
    actions
)(Networkmonitor);

export const networkmonitor = reducer;
