import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from '../../Base/PureComponent';


// React 所有支持的 HTML Attributes
const supportAttr = `accept,acceptCharset,accessKey,action,allowFullScreen,allowTransparency,alt,
async,autoComplete,autoFocus,autoPlay,capture,cellPadding,cellSpacing,challenge,
charSet,checked,cite,classID,className,colSpan,cols,content,contentEditable,
contextMenu,controls,coords,crossOrigin,data,dateTime,default,defer,dir,
disabled,download,draggable,encType,form,formAction,formEncType,formMethod,
formNoValidate,formTarget,frameBorder,headers,height,hidden,high,href,hrefLang,
htmlFor,httpEquiv,icon,id,inputMode,integrity,is,keyParams,keyType,kind,label,
lang,list,loop,low,manifest,marginHeight,marginWidth,max,maxLength,media,
mediaGroup,method,min,minLength,multiple,muted,name,noValidate,nonce,open,
optimum,pattern,placeholder,poster,preload,profile,radioGroup,readOnly,rel,
required,reversed,role,rowSpan,rows,sandbox,scope,scoped,scrolling,seamless,
selected,shape,size,sizes,span,spellCheck,src,srcDoc,srcLang,srcSet,start,step,
style,summary,tabIndex,target,title,type,useMap,value,width,wmode,wrap,value,
onCopy,onCut,onPaste,
onCompositionEnd,onCompositionStart,onCompositionUpdate,
onKeyDown,onKeyPress,onKeyUp,
onFocus,onBlur,
onChange,onInput,onSubmit,
onClick,onContextMenu,onDoubleClick,onDrag,onDragEnd,onDragEnter,onDragExit,
onDragLeave,onDragOver,onDragStart,onDrop,onMouseDown,onMouseEnter,onMouseLeave,
onMouseMove,onMouseOut,onMouseOver,onMouseUp,
onSelect,
onTouchCancel,onTouchEnd,onTouchMove,onTouchStart,
onTransitionEnd,`;

const propTypes = {
  isFocus: PropTypes.bool,
};

const defaultProps = {
  type: 'text',
  isFocus: false,
};

class Input extends PureComponent {
  componentDidUpdate() {
    if (this.props.isFocus) {
      this.myRef.focus();
    }
  }
  render() {
    const { props } = this;
    const inputProps = {};
    let ThisComponent = 'input';

    Object.keys(props).forEach(
      (curKey) => {
        if (supportAttr.indexOf(`${curKey},`) !== -1) {
          inputProps[curKey] = props[curKey];
        }
      },
    );

    if (inputProps.type === 'textarea') {
      ThisComponent = 'textarea';
    }

    // 解决 ie9-11, readOnly情况下还是可以聚焦问题
    if (inputProps.readOnly) {
      inputProps.unselectable = 'on';
    }

    return (
      <ThisComponent
        {...inputProps}
        ref={ref => (this.myRef = ref)}
      />
    );
  }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
