import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'utils';
import { fromJS, List } from 'immutable';
import { Icon, Modal, FormContainer } from 'shared/components';

import './exchange.scss';

const propTypes = {
  listOptions: PropTypes.instanceOf(List),

  // leftaddbutton: PropTypes.bool,
  leftboxtitle: PropTypes.string,
  leftboxlist: PropTypes.instanceOf(List),

  rightboxtitle: PropTypes.string,
  rightaddbutton: PropTypes.bool,
  rightboxlist: PropTypes.instanceOf(List),

  onEditModalOk: PropTypes.func,
  onAddModalOk: PropTypes.func,
  onDeleteBtnClick: PropTypes.func,
  onRightListDoubleClick: PropTypes.func,
  onLeftListDoubleClick: PropTypes.func,
};

const defaultProps = {

};

class Exchange extends Component {
  constructor(props) {
    super(props);
    this.listOnMove = fromJS([]);
    this.dragPosition = '';
    this.dropPosition = '';
    this.state = {
      showEditModal: false,
      listItemOnEdit: fromJS({}),
    };
    utils.binds(this, [
      'onEditModalOk', 'onAddModalOk',
    ]);
  }

  onAddModalOk() {
    const listItemOnEdit = this.state.listItemOnEdit;
    if (this.props.onAddModalOk) {
      this.props.onAddModalOk(listItemOnEdit);
    }
    this.setState({
      showEditModal: false,
      listItemOnEdit: fromJS({}),
    });
  }

  onEditModalOk() {
    const listItemOnEdit = this.state.listItemOnEdit;
    if (this.props.onEditModalOk) {
      this.props.onEditModalOk(listItemOnEdit);
    }
    this.setState({
      showEditModal: false,
      listItemOnEdit: fromJS({}),
    });
  }

  render() {
    return (
      <div className="exchange-wrap container-grid">
        <div className="row">

          <div className="box-left cols col-5">
            {
              this.props.leftboxtitle ? (
                <div className="box-head box-head-left row">
                  <h3 className="cols col-11">{this.props.leftboxtitle}</h3>
                </div>
              ) : null
            }
            <div className="box-body">
              <ul>
                {
                  this.props.leftboxlist ? (
                    this.props.leftboxlist.map((list) => {
                      const listshowinbox = this.props.listOptions.filter(item => item.get('showInBox'));
                      return (
                        <li
                          className="list-item"
                          onDoubleClick={() => { this.props.onLeftListDoubleClick(list); }}
                          draggable
                          onDrag={() => {
                            this.listOnMove = list;
                            this.dragPosition = 'left';
                          }}
                          onDragOver={(e) => { e.preventDefault(); }}
                          onDrop={() => {
                            this.dropPosition = 'left';
                            if (this.dragPosition !== this.dropPosition) {
                              console.log('position', this.dragPosition, this.dropPosition);
                              this.props.onRightListDoubleClick(list);
                            }
                          }}
                        >
                          {
                            listshowinbox.map((item) => {
                              const id = item.get('id');
                              return (
                                <span className="list-span">{list.get(id)}</span>
                              );
                            })
                          }
                        </li>
                      );
                    })
                  ) : null
                }
              </ul>
            </div>
            <div className="box-footer" />
          </div>

          <div className="cols cols-2 exchange-icon-wrap">
            <div className="exchange-icon">
              <Icon
                name="exchange"
                size="4x"
              />
            </div>
          </div>

          <div className="box-right cols col-5">
            {
              this.props.rightboxtitle ? (
                <div className="box-head box-head-right row">
                  <h3 className="cols col-11">{this.props.rightboxtitle}</h3>
                  {
                    this.props.rightaddbutton ? (
                      <Icon
                        className="action-icon cols col-1"
                        name="plus"
                        size="lg"
                        onClick={() => { this.setState({ showEditModal: true }); }}
                      />
                    ) : null
                  }
                </div>
              ) : null
            }
            <div className="box-body">
              <ul>
                {
                  this.props.rightboxlist ? (
                    this.props.rightboxlist.map((list) => {
                      const listshowinbox = this.props.listOptions.filter(item => item.get('showInBox'));
                      return (
                        <li
                          className="list-item"
                          onDoubleClick={() => { this.props.onRightListDoubleClick(list); }}
                          draggable
                          onDrag={() => {
                            this.listOnMove = list;
                            this.dragPosition = 'right';
                          }}
                          onDragOver={(e) => { e.preventDefault(); }}
                          onDrop={() => {
                            this.dropPosition = 'right';
                            if (this.dragPosition !== this.dropPosition) {
                              this.props.onLeftListDoubleClick(list);
                            }
                          }}
                        >
                          {
                            listshowinbox.map((item) => {
                              const id = item.get('id');
                              return (
                                <span className="list-span">{list.get(id)}</span>
                              );
                            })
                          }
                          <span className="list-icon-wrap list-span">
                            <Icon
                              className="list-icon"
                              name="pencil-square-o"
                              size="lg"
                              onClick={() => {
                                this.setState({
                                  showEditModal: true,
                                  listItemOnEdit: list,
                                });
                              }}
                            />
                            <Icon
                              className="list-icon"
                              name="trash-o"
                              size="lg"
                              onClick={() => {
                                this.props.onDeleteBtnClick(list);
                              }}
                            />
                            <Icon
                              className="list-icon"
                              name="eye"
                              size="lg"
                            />
                          </span>
                        </li>
                      );
                    })
                  ) : null
                }
              </ul>
            </div>
            <div className="box-footer" />
          </div>
        </div>

        <Modal
          isShow={this.state.showEditModal}
          title={__('Edit List')}
          onOk={this.onEditModalOk}
          onClose={() => {
            this.setState({
              showEditModal: false,
              listItemOnEdit: fromJS({}),
            });
          }}
        >
          <FormContainer
            options={this.props.listOptions}
            data={this.state.listItemOnEdit}
            onChangeData={(data) => {
              const listItemOnEdit = this.state.listItemOnEdit.merge(fromJS(data));
              this.setState({ listItemOnEdit });
            }}
          />
        </Modal>
      </div>
    );
  }
}


Exchange.propTypes = propTypes;
Exchange.defaultProps = defaultProps;


export default Exchange;

