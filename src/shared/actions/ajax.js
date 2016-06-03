export function requestSave() {
  return {
    type: 'REQUEST_SAVE'
  }
}

export function receiveSave(state) {
  return {
    type: 'RECEIVE_SAVE',
    savedAt: Date.now(),
    state
  }
}