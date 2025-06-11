import axios from 'axios';
export const uploadFileApi = (file) => {
    // 1. 创建一个 FormData 对象，这是发送文件所必须的
    const formData = new FormData();

    // 2. 将文件添加到 FormData 中
    //    'file' 这个键名必须和您后端 CommonController 中 @RequestParam("file") 的值完全一致
    formData.append('file', file);

    // 3. 发送POST请求
    return axios.post('/api/common/upload', formData, {
        headers: {
            // 必须设置这个请求头，告诉后端这是一个文件上传请求
            'Content-Type': 'multipart/form-data',
        },
    });

};