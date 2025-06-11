import axios from 'axios';

export const getSkillTypesApi = () => {
    //创建一个 /api/skills 的接口来提供这个列表

    return axios.get('/api/skills');
};