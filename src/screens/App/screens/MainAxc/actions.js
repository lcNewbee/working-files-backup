export function toggleMainPopOver(option) {
  return {
    type: 'TOGGLE_MAIN_POP_OVER',
    option
  }
}

export function showMainModal(option) {
  return {
    type: 'SHOW_MAIN_MODAL',
    option
  }
}

export function saveMainModal() {

}

export function selectVlan(id) {
  return {
    type: 'SELECT_VLAN',
    id
  }
}
export function selectGroup(id) {
  return {
    type: 'SELECT_GROUP',
    id
  }
}
