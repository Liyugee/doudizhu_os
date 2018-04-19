const defines = {};

defines.serverUrl = 'http://localhost:3000';
// export default defines;

//作为第三方脚本引入时，需要添加window.*** = ***;
window.defines = defines;
