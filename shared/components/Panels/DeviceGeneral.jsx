import React, { PropTypes } from 'react';
import { Map, fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'shared/validator';
import FormContainer from '../Organism/FormContainer';
import SaveButton from '../Button/SaveButton';

const formOptions = fromJS([
  {
    id: 'devicename',
    label: __('Nickname'),
    form: 'deviceGeneral',
    maxLength: '31',
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
    required: true,
  },
  {
    id: 'first5g',
    form: 'deviceGeneral',
    type: 'checkbox',
    value: 1,
    defaultValue: 1,
    dataType: 'number',
    text: __('Band Steering'),
    visible($$data) {
      return $$data.get('has5g');
    },
  },
]);

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
      this.props.onSave();
    }
  }
  render() {
    const {
      store, app, actionable, ...restProps
    } = this.props;
    const formData = store.get('data');
    return (
      <FormContainer
        {...restProps}
        method="POST"
        data={formData}
        className="o-form o-form--compassed"
        options={formOptions}
        isSaving={app.get('saving')}
        onSave={this.onSave}
        actionable={actionable}
        hasSaveButton={actionable}
        saveText={__('Apply')}
        savingText={__('Applying')}
        savedText={__('Applied')}
      />
    );
  }
}
Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;

export default Panel;
