<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
  }

  .el-dialog {
    padding: 0;
  }
  .el-dialog .el-dialog__header {
    padding: 2px 3px 5px 10px;
    background-color: #f8f8f8;
  }
  .el-dialog .el-dialog__header .el-dialog__headerbtn {
    top: 5px;
    right: 10px;
  }
  .el-dialog .el-dialog__body {
    padding: 5px 20px 3px 10px;
  }

  .sent {
  }
  .sent .stroke {
    stroke: #f0c78a;
    stroke-width: 2;
    stroke-dasharray: 3,3;
  }

  .recv {
  }
  .recv .stroke {
    stroke: #cf9236;
    stroke-width: 2;
  }

  .status-running {
    color: #67C23A;
  }
  .status-stopped {
    color: #F56C6C;
  }
</style>
