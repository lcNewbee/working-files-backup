import React from 'react';
import { connect } from 'react-redux';
import { FormInput, FormGroup } from 'shared/components/Form';
import * as actions from './actions.js';
import reducer from './reducer.js';


export default class ACL extends React.Component {


  render() {
    return (
      <div>
        <FormGroup
          label={_('Filter')}
        >
          <FormInput
            name="filter"
            type="radio"
          />
          <span
            style={{ paddingRight: '15px',
                    paddingLeft: '5px',
                  }}
          >
            Allow only stations in list
          </span>
          <FormInput
            name="filter"
            type="radio"
          />
          <span
            style={{ paddingRight: '15px',
                    paddingLeft: '5px',
                  }}
          >
            Block all stations in list
          </span>
        </FormGroup>
        <FormGroup
          label={_('Station List')}
        >
          <FormInput
            type="text"
            value="123"
            style={{ width: '330px',
                     height: '300px',
                     border: '1px solid #000',
                  }}
          />
        </FormGroup>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const myState = state.acl;

  return {
    fecthing: myState.get('fetching'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(ACL);

export const acl = reducer;
