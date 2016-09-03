import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import Button from '../Button/Button';

const propTypes = {
  target: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  buttonText: PropTypes.string,
  onChange: PropTypes.func,
  onUploaded: PropTypes.func,
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
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onUploadImage = this.onUploadImage.bind(this);
    this.restImageStatus = this.restImageStatus.bind(this);
    this.imageUploading = this.imageUploading.bind(this);
  }

  onChangeImage(e) {
    const data = {};
    const { acceptExt } = this.props;
    const thisElem = e.target;
    const filePath = thisElem.value;
    const extension = utils.getExtension(filePath);

    if (!filePath) {
      this.props.createModal({
        id: 'admin',
        role: 'alert',
        text: _('Please select a upload file'),
      });
      return;
    }

    // 验证可接受的文件类型
    if (acceptExt && acceptExt.indexOf(extension) === -1) {
      this.props.createModal({
        id: 'admin',
        role: 'alert',
        text: _('Select file extension range: ') + acceptExt,
      });

      thisElem.value = '';
      this.restImageStatus();
      return;
    }

    data.imageStatus = 'selected';
    this.setState(utils.extend({}, this.state, data));
  }

  onUploadImage() {
    const that = this;
    const url = this.props.url;
    const input = this.fileElem;
    const formElem = this.formElem;
    let extension = '';
    let data;

    if (!input.value) {
      that.props.createModal({
        id: 'admin',
        role: 'alert',
        text: _('Please select a upload image'),
      });
      return;
    }

    extension = utils.getExtension(input.value);

    if (that.state.imageStatus !== 'selected') {
      return;
    }

    //
    if (typeof FormData === 'function') {
      data = new FormData();
      data.append('filename', input.files[0]);
      data.append('suffix', extension);
      that.imageUploading();

      fetch(url, {
        method: 'POST',
        body: data,
      })
      .then(() => {
        that.restImageStatus();
      });
    } else {
      that.imageUploading();
      formElem.submit();
      that.restImageStatus();
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
        ref={formElem => {
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
          }}
          ref={fileElem => {
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
