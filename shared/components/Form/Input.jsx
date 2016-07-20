import React, { PropTypes } from 'react';
import utils from '../../utils';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  type: 'text',
};

function Input(props) {
  const inputProps = utils.extend({}, props);

  delete inputProps.seeAble;
  delete inputProps.Component;
  delete inputProps.loading;
  delete inputProps.validator;
  delete inputProps.check;
  delete inputProps.checkClear;
  delete inputProps.errMsg;
  delete inputProps.validateAt;
  delete inputProps.onValidError;
  delete inputProps.options;

  return (
    <input
      {...inputProps}
    />
  );
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
