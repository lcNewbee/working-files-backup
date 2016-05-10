import './index.scss';
import React, {PropTypes, Component} from 'react';

const propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  curIndex: 1
};

class Pagination extends Component {
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
  
  goPage(i) {
    if(typeof this.props.onPageChange === 'function') {
      
      if(this.getPageOptions().currPage !== i && i > 0) {
        this.props.onPageChange(i)
      } 
      
    }
  }
  
  onGoPage(e) {
    let page;
    e.preventDefault();
    
    page = parseInt(e.target.innerHTML);
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
    let page;
    
    e.preventDefault();
    
    page = this.getPageOptions().nextPage;
    
    this.goPage(page);
  }
  
  onGoFrist(e) {
    e.preventDefault();
    this.goPage(1);
  }
  
  onGoEnd(e) {
    let page;
    e.preventDefault();
    
    page = this.getPageOptions().lastPage;
    
    this.goPage(page);
  }
  
  getPageOptions() {
    var ret = {};
    
    if(this.props.page) {
      if(this.props.page.toJS) {
        ret = this.props.page.toJS()
      } else {
        ret = this.props.page;
      }
    }
    return ret;
  }
  
  render() {
    let {total, currPage, lastPage, nextPage, totalPage} = this.getPageOptions();
    let prevClassName = currPage == 1 ? 'disabled' : '';
    let nextClassName = nextPage == -1 ? 'disabled' : '';
    let list = [];
    let key;
    let i;
    
    var startPage = (currPage < 5)  || (totalPage < 8)? 1 : (currPage - 4);
    var endPage = startPage + 8;

    endPage = endPage > totalPage ? totalPage : endPage;


    for (i = startPage; i <= endPage; i++) {
      key = ('pager_' + i);
      if(currPage != i) {
        list.push(<li key={key}><a href="#" onClick={this.onGoPage}>{i}</a></li>);
      } else {
        list.push(<li key={key} className="active"><a href="#" onClick={this.onGoPage}>{i}</a></li>);
      }
    }
    
    return (
      <ul className="pagination">
        <li className={prevClassName}><a href="#" onClick={this.onGoFrist}>{_('First')}</a></li>
        <li className={prevClassName}><a href="#" onClick={this.onPrev}>{_('Prev')}</a></li>
        {list}
        <li className={nextClassName}><a href="#" onClick={this.onNext}>{_('Next')}</a></li>
        <li className={nextClassName}><a href="#" onClick={this.onGoEnd}>{_('Last')}</a></li> 
      </ul>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;