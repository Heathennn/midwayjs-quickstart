export const EnumFileProcessStatus = {
  UPLOADING: 1, // 上传中
  UPLOADED: 2, // 已上传
  PENDING: 3, // 正在解析
  SUCCESS: 4, // 处理成功
  FAIL: 5, // 处理失败
};
export const EnumFileProcessStatusText = {
  [EnumFileProcessStatus.UPLOADING]: '上传中', // 已上传
  [EnumFileProcessStatus.UPLOADED]: '已上传', // 已上传
  [EnumFileProcessStatus.PENDING]: '正在解析', // 正在解析
  [EnumFileProcessStatus.SUCCESS]: '处理成功', // 处理成功
  [EnumFileProcessStatus.FAIL]: '处理失败', // 处理失败
};
