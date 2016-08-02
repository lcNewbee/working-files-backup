export function onToggleTopMenu() {
  return {
    type: 'ON_TOGGLE_TOP_MENU'
  }
}

export function onToggleAsiderLeft() {
  return {
    type: 'ON_TOGGLE_ASIDER_LEFT'
  }
}

export function onSelectVlan(id) {
  return {
    type: 'ON_SELECT_VLAN',
    id
  }
}
