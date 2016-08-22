import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  FormGroup,
} from '../Form';

import {
  SaveButton,
} from '../Button';

const propTypes = {
  onCollapse: PropTypes.func,
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onRemove: PropTypes.func,
  onSave: PropTypes.func,

  options: PropTypes.instanceOf('List'),
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {
};

class FormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onSave() {
    this.props.onSave('/goform/asd', {
      a: 1,
    })
    .then((json) => {
      console.log(json);
    });
  }
  onChangeData(data) {
    console.log(data);
  }
  render() {
    const { store, app } = this.props;

    return (
      <form action={saveUrl}>
        {
          options.map((item, index) => {
            const legendText = item.getIn([0, 'legend']);

            if (legendText) {
              return (
                <fieldset key={index}>
                  <legend>{legendText}</legend>
                  {
                    item.map((subItem) => {
                      const myProps = subItem.toJS();
                      const id = myProps.id;

                      delete myProps.fieldset;
                      delete myProps.legend;

                      return (
                        <FormGroup
                          {...myProps}
                          key={id}
                          value={editData.get(id)}
                          onChange={
                            (data) => {
                              const upDate = {};
                              upDate[id] = data.value;
                              this.props.updateEditListItem(upDate);
                            }
                          }
                        />
                      );
                    })
                  }
                </fieldset>
              );
            }

            return (
              item.map((subItem) => {
                const myProps = subItem.toJS();
                const id = myProps.id;

                return (
                  <FormGroup
                    {...myProps}
                    key={id}
                    value={editData.get(id)}
                    onChange={
                      (data) => {
                        const upDate = {};
                        upDate[id] = data.value;
                        this.props.updateEditListItem(upDate);
                      }
                    }
                  />
                );
              })
            );
          })
        }
      </form>
    );
  }
}
FormContainer.propTypes = propTypes;
FormContainer.defaultProps = defaultProps;

export default FormContainer;
