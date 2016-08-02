export function closeInterfacesEdit() {
  return {
    type: 'CLOSE_INTERFACES_EDIT'
  }
}

export function addInterface() {
  return {
    type: 'ADD_INTERFACE'
  };
}

export function editInterface(id) {
  return {
    type: 'EDIT_INTERFACE',
    id
  }
}

export function updateInterfaceEdit(data) {
  return {
    type: 'UPDATE_INTERFACE_EDIT',
    data
  }
}
