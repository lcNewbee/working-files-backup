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
  
  }
  
  onGoPage(i) {
    
  }
  
  onPrev() {
    
  }
  
  onNext() {
    
  }
  
  onGoFrist() {
    
  }
  
  onGoEnd() {
    
  }
  
  render() {
    var total = this.props.total;
    var currPage = this.props.currPage;
    var lastPage = this.props.lastPage;
    var nextPage = this.props.nextPage;
    var totalPage = this.props.totalPage;
    var prevClassName = currPage == 1 ? 'disabled' : '';
    var nextClassName = nextPage == -1 ? 'disabled' : '';
    var list = [];
    var key;
    var i;
    
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
        <li className={prevClassName}><a href="#" onClick={this.onGoFrist}>首页</a></li>
        <li className={prevClassName}><a href="#" onClick={this.onPrev}>上页</a></li>
        {list}
        <li className={nextClassName}><a href="#" onClick={this.onNext}>下页</a></li>
        <li className={nextClassName}><a href="#" onClick={this.onGoEnd}>尾页</a></li> 
      </ul>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;