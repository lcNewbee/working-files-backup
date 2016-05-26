export function startValidateAll() {
  return {
    type: 'START_VALIDATE_ALL',
    validateAt: Date.now()
  }
}
export function validateAll(func) {
  return (dispatch, getState) => {
    dispatch(startValidateAll());
    
    setTimeout(() => {
      const invalid = getState().app.get('invalid');
      
      if(typeof func === 'function') {
        func(invalid)
      }
    }, 20)
  }
}

export function resetVaildateMsg() {
  return {
    type: 'RESET_VAILDATE_MSG'
  }
}

export function reportValidError(data) {
  return {
    type: 'REPORT_VALID_ERROR',
    data
  }
}