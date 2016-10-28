import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import Button from '../Button/Button';

const MSG = {
  shouldSelectFile: _('Please select a upload file'),
  extensionRange: _('Select file extension range: %s'),
};

const propTypes = {
  target: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  buttonText: PropTypes.string,
  acceptExt: PropTypes.string,
  onChange: PropTypes.func,
  onBeforeUpload: PropTypes.func,
  onUploaded: PropTypes.func,

  // 弹出提示宽
  createModal: PropTypes.func,
};
const defaultProps = {
  name: 'filename',
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
      this.onAlert(_(MSG.extensionRange, acceptExt));
      thisElem.value = '';
      this.restImageStatus();
      return;
    }

    data.imageStatus = 'selected';
    this.setState(utils.extend({}, this.state, data));
  }

  onUploadImage() {
    const { url, onBeforeUpload, onUploaded } = this.props;
    const input = this.fileElem;
    const formElem = this.formElem;
    let data;

    if (!input.value) {
      this.onAlert(MSG.shouldSelectFile);
      return;
    }

    if (this.state.imageStatus !== 'selected') {
      return;
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
    const input = this.fileElem;
    const data = {};

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
    const { url, target, buttonText, name } = this.props;
    const { imageStatus } = this.state;

    return (
      <form
        action={url}
        method="POST"
        target={target}
        encType="multipart/form-data"
        ref={(formElem) => {
          if (formElem) {
            this.formElem = formElem;
          }
        }}
      >
        <input
          type="file"
          className="text"
          name={name}
          onChange={this.onChangeImage}
          style={{
            marginRight: '8px',
            marginBottom: '4px',
          }}
          ref={(fileElem) => {
            if (fileElem) {
              this.fileElem = fileElem;
            }
          }}
        />
        <Button
          type="button"
          text={buttonText || _('Upload Image')}
          icon="upload"
          loading={imageStatus === 'loading'}
          theme={imageStatus === 'selected' ? 'primary' : undefined}
          onClick={this.onUploadImage}
        />
      </form>
    );
  }
}

FileUpload.propTypes = propTypes;
FileUpload.defaultProps = defaultProps;

export default FileUpload;
