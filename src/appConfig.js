export default {
  serverUrl: '/api',
  tokenUrl: this.serverUrl + '/common/getToken.action',
  uploadUrl: function () {
    return '/upload/index.php'
  }
}
