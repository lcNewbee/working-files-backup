import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'shared/utils/lib/validator';
import {
  FormGroup,
} from '../Form';

import {
  SaveButton,
} from '../Button';

const propTypes = {
  onValidError: PropTypes.func,
  onChangeData: PropTypes.func,
  onSave: PropTypes.func,
  validateAt: PropTypes.string,

  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
  invalidMsg: PropTypes.instanceOf(Map),
  actionable: PropTypes.bool,
};

const defaultProps = {
};
class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onSave() {
    if (this.props.onSave) {
      this.props.onSave('deviceGeneral');
    }
  }
  render() {
    const {
      store, app, actionable, invalidMsg, validateAt, onValidError,
    } = this.props;
    return (
      <div className="o-form o-form--compassed">
        <FormGroup
          type="text"
          label={_('Nickname')}
          name="devicename"
          form="deviceGeneral"
          maxLength="31"
          validator={
            validator({
              rules: 'utf8Len:[1,31]',
            })
          }

          value={store.getIn(['data', 'devicename'])}
          onChange={option => this.props.onChangeData({
            devicename: option.value,
          })}
          disabled={!actionable}

          // Validate Props
          errMsg={invalidMsg.get('devicename')}
          validateAt={validateAt}
          onValidError={onValidError}
          required
        />
        {
          actionable ? (
            <SaveButton
              size="sm"
              loading={app.get('saving')}
              onClick={this.onSave}
            />
          ) : null
        }
      </div>
    );
  }
}
Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;

export default Panel;
