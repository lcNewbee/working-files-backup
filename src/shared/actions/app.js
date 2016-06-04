export function refreshAll() {
  return {
    type: 'REFRESH_ALL',
    refreshAt: Date.now()
  }
}