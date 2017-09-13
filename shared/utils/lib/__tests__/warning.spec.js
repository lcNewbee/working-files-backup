import warning from 'shared/utils/lib/warning';

describe('utils warning', () => {
  describe('#warning', () => {
    let sandbox;
    beforeEach(() => {
      // create a sandbox
      sandbox = sinon.sandbox.create();

      // stub some console methods
      sandbox.stub(console, 'log');
      sandbox.stub(console, 'error');
    });

    afterEach(() => {
      // restore the environment as it was before
      sandbox.restore();
    });

    it('should console error when condition is not established', () => {
      const errorMsg = 'should console error when msg not empty';
      warning(false, errorMsg);
      sinon.assert.calledOnce(console.error);
      sinon.assert.calledWithExactly(console.error, `Warning: ${errorMsg}`);
    });

    it('should console error when condition is true', () => {
      warning(true, '');
      sinon.assert.notCalled(console.error);
    });

    it('should throw error when not forrmat argument', () => {
      expect(() => {
        warning(true);
      }).toThrow();
    });
  });
});
