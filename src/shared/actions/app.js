export function refreshAll() {
  return {
    type: 'REFRESH_ALL',
    refreshAt: Date.now()
  }
}

export function changeLoginStatus(data) {
  return {
    type: 'CHANGE_LOGIN_STATUS',
    data
  }
}
