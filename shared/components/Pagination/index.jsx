import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import Select from '../Select';
import PureComponent from '../Base/PureComponent';

import './index.scss';

const sizeOptions = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

function getPageOptions(props) {
  let ret = {};

  if (props.page) {
    if (props.page.toJS) {
      ret = props.page.toJS();
    } else {
      ret = props.page;
    }
  }

  return ret;
}

const propTypes = {
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  size: PropTypes.number,
  sizeOptions: PropTypes.array,
  page: PropTypes.object,
};

const defaultProps = {
  currPage: 1,
  sizeOptions,
};

class Pagination extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onGoPage',
      'onPrev',
      'onPrevFivePage',
      'onNext',
      'onNextFivePage',
      'onGoFrist',
      'onGoEnd',
      'getPageOptions',
      'goPage',
      'onGotoKeyup',
    ]);
    this.pageOptions = getPageOptions(props);
    this.state = {
      goPage: this.pageOptions.currPage,
      pageOptions: this.pageOptions,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      this.pageOptions = getPageOptions(nextProps);

      this.setState({
        goPage: this.pageOptions.currPage,
        pageOptions: this.pageOptions,
      });
    }
  }

  onGoPage(e) {
    const page = parseInt(e.target.innerHTML, 10);

    e.preventDefault();
    this.goPage(page);
  }
  onGotoKeyup(e) {
    const page = parseInt(e.target.value, 10);

    if (e.which === 13) {
      e.preventDefault();
      this.goPage(page);
    }
  }

  onPrev(e) {
    const page = this.state.pageOptions.currPage - 1;

    e.preventDefault();
    this.goPage(page);
  }

  onNext(e) {
    const pageOptions = this.state.pageOptions;
    const page = parseInt(pageOptions.currPage, 10) + 1;

    e.preventDefault();
    this.goPage(page);
  }

  onGoFrist(e) {
    e.preventDefault();
    this.goPage(1);
  }

  onGoEnd(e) {
    const pageOptions = this.state.pageOptions;
    const page = pageOptions.totalPage || pageOptions.lastPage;

    e.preventDefault();
    this.goPage(page);
  }
  onPrevFivePage() {
    const curPage = parseInt(this.state.pageOptions.currPage, 10);
    this.goPage(curPage - 5);
  }

  onNextFivePage() {
    const curPage = parseInt(this.state.pageOptions.currPage, 10);

    this.goPage(curPage + 5);
  }

  getPageList(pageOptions) {
    const { currPage, totalPage } = pageOptions;
    const list = [];
    let key;
    let i;

    let startPage = (currPage <= 5) || (totalPage <= 6) ? 1 : (currPage - 2);
    let endPage = startPage + 4;

    if (endPage > totalPage) {
      startPage = totalPage - 4;
      endPage = totalPage;
    }

    if (startPage < 1) {
      startPage = 1;
    }

    if (startPage > 1) {
      list.push(<li key="page.1" ><a onClick={this.onGoPage}>1</a></li>);
    }
    if (startPage > 2) {
      list.push((
        <li key="page.prev" className="jump-prev">
          <span title={__('Previous 5 Pages')} onClick={this.onPrevFivePage} className="fa" />
        </li>
      ));
    }

    for (i = startPage; i <= endPage; i += 1) {
      key = `pager_${i}`;

      if (+currPage !== i) {
        list.push(<li key={key}><a href="#/" onClick={this.onGoPage}>{i}</a></li>);
      } else {
        list.push(<li key={key} className="active">
          <a href="#/" onClick={this.onGoPage}>{i}</a>
        </li>);
      }
    }
    if (endPage < totalPage - 1) {
      list.push(<li key="page.next" className="jump-next"><span title={__('Next 5 Pages')} onClick={this.onNextFivePage} className="fa" /></li>);
    }
    if (endPage < totalPage) {
      list.push(<li key="page.last"><a href="#/" onClick={this.onGoPage}>{totalPage}</a></li>);
    }

    return list;
  }
  goPage(i) {
    let gotoPageNum = parseInt(i, 10);

    if (this.props.onPageChange) {
      if (gotoPageNum < 1) {
        gotoPageNum = 1;
      } else if (gotoPageNum > this.state.pageOptions.totalPage) {
        gotoPageNum = this.state.pageOptions.totalPage;
      }

      if (this.state.pageOptions.currPage !== gotoPageNum) {
        this.props.onPageChange(gotoPageNum);
      }
    }
  }
  render() {
    const { currPage, totalPage, total } = this.state.pageOptions;
    const prevClassName = parseInt(currPage, 10) === 1 ? 'prev disabled' : 'prev';
    const nextClassName = parseInt(totalPage, 10) === currPage ? 'next disabled' : 'next';
    const pageList = this.getPageList(this.state.pageOptions);

    return (
      <div className="m-pagination">
        { total > 0 ? (<span className="m-pagination__total">{__('A total of %s', total)}.</span>) : null}
        {
          this.props.sizeOptions && this.props.size ? (
            <div className="m-pagination__size">
              <label
                key="pageLabel"
                htmlFor="pageSelect"
              >
                {__('Items per page')}
              </label>
              <Select
                key="pageSelect"
                value={this.props.size}
                onChange={this.props.onPageSizeChange}
                options={this.props.sizeOptions}
                searchable={false}
                clearable={false}
                autoWidth
              />
            </div>
          ) : null
        }

        {
          totalPage && totalPage > 1 ? (
            <ul className="m-pagination__pages">
              <li className={prevClassName}><span title={__('Previous')} onClick={this.onPrev} className="fa" /></li>
              {pageList}
              <li className={nextClassName}><span title={__('Next')} onClick={this.onNext} className="fa" /></li>
              {
                // 超过7页，才显示
                totalPage > 7 ? (
                  <li className="pages-goto">
                    <label
                      htmlFor="gotoPage"
                    >
                      {__('Go to')}
                    </label>
                    <input
                      type="number"
                      value={this.state.goPage}
                      id="gotoPage"
                      className=""
                      min="1"
                      max={totalPage}
                      onChange={(e) => {
                        let gotoPageVal = parseInt(e.target.value, 10);

                        if (gotoPageVal > totalPage) {
                          gotoPageVal = totalPage;
                        } else if (gotoPageVal < 1) {
                          gotoPageVal = 1;
                        } else if (isNaN(gotoPageVal)) {
                          gotoPageVal = '';
                        }
                        if(gotoPageVal !== this.state.goPage) {
                          this.setState({
                            goPage: gotoPageVal,
                          });
                        }
                      }}
                      onKeyUp={this.onGotoKeyup}
                    />
                  </li>
                ) : null
              }
            </ul>
          ) : null
        }
      </div>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;
