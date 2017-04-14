import React from 'react'; import PropTypes from 'prop-types';
import { FormGroup } from 'shared/components';


export default class MacInput extends React.Component {
  render() {
    return (
      <div>
        <FormGroup
          type="mac"
        />
      </div>
    );
  }
}
