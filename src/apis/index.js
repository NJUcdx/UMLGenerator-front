import request from '../utils/request';

var url = "http://localhost:8081"
export default {
    submitAndRun: data => {
        return request({
            // url: "../../data/getRouterInfo.json",
            url: url+'/saveSpeechFile',
            method: "post",
            headers: {'Content-Type': 'multipart/form-data'},
            data: data
        })

    },
    submitAndTest: data => {
        return request({
            url: url + '/sendCheckFile',
            method: "post",
            headers: {'Content-Type': 'multipart/form-data'},
            data: data
        })

    },
    testRouter: param => {
        return request({
            // url: '../../data/checkCommand.json',
            url: url + '/checkCommand',
            method: "get",
            params: param
        })
    },
    getRouterInfo: param => {
        return request({
            // url: url + '/getRouterInfo',
            url: '../../data/getRouterInfo.json',
            method: "get",
            params: param
        })
    },
    getWireInfo: param => {
        return request({
            url: '../../data/getWireInfo.json',
            // url: url + '/getWireInfo',
            method: "get",
            params: param
        })
    },
    sendCommandS: param => {
        console.log(JSON.stringify(param))
        return request({
            url: url + '/sendCommand',
            method: "get",
            timeout:20000,
            params: param
        })
    },
    modifyRouterInfo: data => {
        return request({
            url: url + '/modifyRouterInfo',
            method: "post",
            data: data
        })
    },
    clear: data => {
        return request({
            url: url + '/clear',
            method: "post",
            data: data
        })
    }
}
