import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import Button from '../Button/Button';
import InputFile from '../Form/File';

import './_FileUpload.scss';

const MSG = {
  shouldSelectFile: __('Please select a upload file'),
  extensionRange: __('Select file extension range: %s'),
};

const propTypes = {
  target: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  buttonText: PropTypes.string,
  placeholder: PropTypes.string,
  buttonIcon: PropTypes.string,
  acceptExt: PropTypes.string,
  onChange: PropTypes.func,
  onBeforeUpload: PropTypes.func,
  onUploaded: PropTypes.func,

  // 弹出提示宽
  createModal: PropTypes.func,
  disabled: PropTypes.bool,
};
const defaultProps = {
  name: 'filename',
  buttonIcon: 'upload',
  disabled: false,
};

class FileUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageStatus: 'default',
    };

    utils.binds(this, [
      'onChangeImage',
      'onUploadImage',
      'restImageStatus',
      'imageUploading',
      'onAlert',
    ]);
  }
  onAlert(msg) {
    const createModal = this.props.createModal;

    if (createModal) {
      createModal({
        id: 'admin',
        role: 'alert',
        text: msg,
      });
    } else {
      alert(msg);
    }
  }
  onChangeImage(e) {
    const data = {};
    const { acceptExt, onChange } = this.props;
    const thisElem = e.target;
    const filePath = thisElem.value;
    const extension = utils.getExtension(filePath);

    this.ext = extension;

    if (onChange) {
      onChange({
        value: filePath,
        ext: extension,
      }, e);
    }

    if (!filePath) {
      this.onAlert(MSG.shouldSelectFile);
      return;
    }

    // 验证可接受的文件类型
    if (acceptExt && acceptExt.indexOf(extension) === -1) {
      this.onAlert(__(MSG.extensionRange, acceptExt));
      thisElem.value = '';
      this.restImageStatus();
      return;
    }

    data.imageStatus = 'selected';
    this.setState(utils.extend({}, this.state, data));
  }

  onUploadImage() {
    const { url, onBeforeUpload, onUploaded, disabled } = this.props;
    const formElem = this.formElem;
    let input = this.fileElem;
    let data;

    // 如果是禁用不响应事件
    if (disabled) {
      return null;
    }

    // InputFile组件需要访问 myRef
    if (input.myRef) {
      input = input.myRef;
    }

    if (!input.value) {
      this.onAlert(MSG.shouldSelectFile);
      return null;
    }

    if (this.state.imageStatus !== 'selected') {
      return null;
    }

    if (onBeforeUpload) {
      onBeforeUpload();
    }

    //
    if (typeof FormData === 'function') {
      data = new FormData();
      data.append('filename', input.files[0]);
      data.append('suffix', this.ext);
      this.imageUploading();
      fetch(url, {
        method: 'POST',
        body: data,
      })
      .then(() => {
        this.restImageStatus();

        // 完成时的回调函数
        if (onUploaded) {
          onUploaded();
        }
      });
    } else {
      this.imageUploading();
      formElem.submit();
      this.restImageStatus();

      // 完成时的回调函数
      if (onUploaded) {
        onUploaded();
      }
    }
  }

  restImageStatus() {
    let input = this.fileElem;
    const data = {};

    // InputFile组件需要访问 myRef
    if (input.myRef) {
      input = input.myRef;
    }
    this.formElem.reset();

    data.imageStatus = 'default';
    this.setState(utils.extend({}, this.state, data));
    input.value = '';
  }

  imageUploading() {
    const data = {};

    data.imageStatus = 'loading';
    this.setState(utils.extend({}, this.state, data));
  }

  render() {
    const { url, target, buttonText, name, buttonIcon, disabled } = this.props;
    const { imageStatus } = this.state;
    const curButtonText = buttonText || __('Upload Image');
    let displayStyle = 'none';

    if (imageStatus === 'default') {
      displayStyle = 'inline-block';
    }

    return (
      <form
        action={url}
        method="POST"
        target={target}
        encType="multipart/form-data"
        className="m-file-upload"
        ref={(formElem) => {
          if (formElem) {
            this.formElem = formElem;
          }
        }}
      >
        <InputFile
          type="file"
          className="text"
          name={name}
          onChange={this.onChangeImage}
          disabled={disabled}
          style={{
            marginRight: '8px',
            display: displayStyle,
          }}
          onRef={(fileElem) => {
            if (fileElem) {
              this.fileElem = fileElem;
            }
          }}
        />
        <Button
          type="button"
          text={curButtonText}
          icon={buttonIcon}
          loading={imageStatus === 'loading'}
          theme={imageStatus === 'selected' ? 'primary' : undefined}
          onClick={this.onUploadImage}
          disabled={disabled}
        />
      </form>
    );
  }
}

FileUpload.propTypes = propTypes;
FileUpload.defaultProps = defaultProps;

export default FileUpload;
