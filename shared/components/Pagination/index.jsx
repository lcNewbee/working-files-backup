import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from '../Base/PureComponent';
import Select from '../Select';

import './index.scss';

const sizeOptions = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

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

    this.onGoPage = this.onGoPage.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onGoFrist = this.onGoFrist.bind(this);
    this.onGoEnd = this.onGoEnd.bind(this);
    this.getPageOptions = this.getPageOptions.bind(this);
    this.goPage = this.goPage.bind(this);
  }

  onGoPage(e) {
    const page = window.parseInt(e.target.innerHTML);

    e.preventDefault();
    this.goPage(page);
  }

  onPrev(e) {
    let page;

    e.preventDefault();

    page = this.getPageOptions().currPage - 1;

    page = page > 0 ? page : 1;

    this.goPage(page);
  }

  onNext(e) {
    const page = this.getPageOptions().nextPage;

    e.preventDefault();
    this.goPage(page);
  }

  onGoFrist(e) {
    e.preventDefault();
    this.goPage(1);
  }

  onGoEnd(e) {
    const page = this.getPageOptions().lastPage;
    e.preventDefault();
    this.goPage(page);
  }

  getPageOptions() {
    let ret = {};

    if (this.props.page) {
      if (this.props.page.toJS) {
        ret = this.props.page.toJS();
      } else {
        ret = this.props.page;
      }
    }
    return ret;
  }
  goPage(i) {
    if (this.props.onPageChange) {
      if (this.getPageOptions().currPage !== i && i > 0) {
        this.props.onPageChange(i);
      }
    }
  }
  render() {
    const { currPage, nextPage, totalPage, total } = this.getPageOptions();
    const prevClassName = +currPage === 1 ? 'disabled' : '';
    const nextClassName = +nextPage === -1 ? 'disabled' : '';
    const list = [];
    let key;
    let i;

    const startPage = (currPage < 5) || (totalPage < 8) ? 1 : (currPage - 4);
    let endPage = startPage + 8;

    endPage = endPage > totalPage ? totalPage : endPage;

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

    return (
      <div className="m-pagination">
        <span className="m-pagination__total">{__('A total of %s', total)}.</span>
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
            <ul className="pagination">
              <li className={prevClassName}><a href="#/" onClick={this.onGoFrist}>{__('First')}</a></li>
              <li className={prevClassName}><a href="#/" onClick={this.onPrev}>{__('<')}</a></li>
              {list}
              <li className={nextClassName}><a href="#/" onClick={this.onNext}>{__('>')}</a></li>
              <li className={nextClassName}><a href="#/" onClick={this.onGoEnd}>{__('Last')}</a></li>
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
