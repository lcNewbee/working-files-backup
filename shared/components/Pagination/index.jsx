import React, { PropTypes, Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './index.scss';

const propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nextPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPageChange: PropTypes.func,
  page: PropTypes.object,
};

const defaultProps = {
  currPage: 1,
};

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
    const { currPage, nextPage, totalPage } = this.getPageOptions();
    const prevClassName = +currPage === 1 ? 'disabled' : '';
    const nextClassName = +nextPage === -1 ? 'disabled' : '';
    const list = [];
    let key;
    let i;

    const startPage = (currPage < 5) || (totalPage < 8) ? 1 : (currPage - 4);
    let endPage = startPage + 8;

    endPage = endPage > totalPage ? totalPage : endPage;

    for (i = startPage; i <= endPage; i++) {
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
      <ul className="pagination">
        <li className={prevClassName}><a href="#/" onClick={this.onGoFrist}>{_('First')}</a></li>
        <li className={prevClassName}><a href="#/" onClick={this.onPrev}>{_('<')}</a></li>
        {list}
        <li className={nextClassName}><a href="#/" onClick={this.onNext}>{_('>')}</a></li>
        <li className={nextClassName}><a href="#/" onClick={this.onGoEnd}>{_('Last')}</a></li>
      </ul>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;
