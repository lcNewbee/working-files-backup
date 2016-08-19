import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo, Modal, FormGroup,
} from 'shared/components';
import * as listActions from 'shared/actions/list';
import * as appActions from 'shared/actions/app';

const tableOptions = fromJS([
  {
    id: 'no',
    width: '50',
    text: _('No'),
  }, {
    id: 'addressPoolName',
    width: '200',
    text: _('Address Pool Name'),
  }, {
    id: 'startAddress',
    width: '160',
    text: _('Start IP'),
  }, {
    id: 'endAddress',
    text: _('End IP'),
  }, {
    id: 'description',
    text: _('Description'),
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
  closeListItemModal: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  componentWillMount() {
    this.tableOptions = tableOptions;
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log(json);
        }
      });
  }

  render() {
    const { route, store } = this.props;
    const editData = store.getIn([route.id, 'data', 'edit']) || Map({});

    return (
      <ListInfo
        {...this.props}
        tableOptions={this.tableOptions}
        controlAbled
        noTitle
      >
        <Modal
          isShow={!editData.isEmpty()}
          title={editData.get('myTitle')}
          onOk={() => this.onSave()}
          onClose={() => this.props.closeListItemModal(route.id)}
        >
          {
            tableOptions.map((item) => {
              let id = item.get('id');

              return (
                <FormGroup
                  type="text"
                  key={id}
                  label={item.get('text')}
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
        </Modal>
      </ListInfo>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    listActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
