export function requestSave() {
  return {
    type: 'REQUEST_SAVE'
  }
}

export function receiveSave() {
  return {
    type: 'RECEIVE_SAVE',
    savedAt: Date.now()
  }
}