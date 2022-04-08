<template>
  <div class="fullScreen">
    <h2>UML语音生成</h2>
    <el-row class="fullHeight">
      <el-col :span="12" class="fullHeight">
        <topology-one :links-model="LinksModel" :nodes-model="NodesModel"></topology-one>
      </el-col>
      <el-col :span="12" class="fullHeight">
        <el-container class="container">
          <div class="form-container" style="background: #fafafa">
            <!--            上传yml界面-->
            <el-button type="primary" style="margin-top: 10px" @click="startRecorder" :disabled="recorderDisabled">
              开始录音
            </el-button>
            <el-button type="primary" style="margin-top: 10px" @click="stopRecorder" :disabled="!recorderDisabled">
              录音结束
            </el-button>
            <el-input
                readonly
                type="textarea"
                :rows="40"
                resize="none"
                v-model="textArea"
                style="margin-top: 10px">
            </el-input>
          </div>
        </el-container>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import apis from '@apis/index'
import {Bus} from '@utils/bus.js'
import Recorder from 'js-audio-recorder'
import TopologyOne from "@views/topologyOne";
// const lamejs = require('lamejs')
const recorder = new Recorder({

  sampleBits: 16, // 采样位数，支持 8 或 16，默认是16

  sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000

  numChannels: 1, // 声道，支持 1 或 2， 默认是1

// compiling: false,(0.x版本中生效,1.x增加中) // 是否边录边转换，默认是false

})
export default {
  components: {TopologyOne},
  data() {
    return {
      textArea: "",
      recorderDisabled: false,
      NodesModel: [
        {
          key: 1,
          name: "BankAccount",
          properties: [
            {name: "owner", type: "String", visibility: "public"},
            {name: "balance", type: "Currency", visibility: "public", default: "0"}
          ],
          methods: [
            {name: "deposit", parameters: [{name: "amount", type: "Currency"}], visibility: "public"},
            {name: "withdraw", parameters: [{name: "amount", type: "Currency"}], visibility: "public"}
          ]
        },
        {
          key: 11,
          name: "Person",
          properties: [
            {name: "name", type: "String", visibility: "public"},
            {name: "birth", type: "Date", visibility: "protected"}
          ],
          methods: [
            {name: "getCurrentAge", type: "int", visibility: "public"}
          ]
        },
        {
          key: 12,
          name: "Student",
          properties: [
            {name: "classes", type: "List", visibility: "public"}
          ],
          methods: [
            {name: "attend", parameters: [{name: "class", type: "Course"}], visibility: "private"},
            {name: "sleep", visibility: "private"}
          ]
        },
        {
          key: 13,
          name: "Professor",
          properties: [
            {name: "classes", type: "List", visibility: "public"}
          ],
          methods: [
            {name: "teach", parameters: [{name: "class", type: "Course"}], visibility: "private"}
          ]
        },
        {
          key: 14,
          name: "Course",
          properties: [
            {name: "name", type: "String", visibility: "public"},
            {name: "description", type: "String", visibility: "public"},
            {name: "professor", type: "Professor", visibility: "public"},
            {name: "location", type: "String", visibility: "public"},
            {name: "times", type: "List", visibility: "public"},
            {name: "prerequisites", type: "List", visibility: "public"},
            {name: "students", type: "List", visibility: "public"}
          ]
        }
      ],
      LinksModel:
          [
            {from: 12, to: 11, type: "composition"},
            {from: 13, to: 11, type: "generalization"},
            {from: 14, to: 13, type: "aggregation"}
          ]
    };
  },
  //监听属性 类似于data概念",
  computed: {},
  //监控data中的数据变化",
  watch: {},
  //方法集合",
  methods: {
    startRecorder() {
      recorder.start()
      this.recorderDisabled = true;
    },
    stopRecorder() {
      recorder.stop()
      this.recorderDisabled = false;
      let PCMBlob = recorder.getPCMBlob();//获取 PCM 数据
      //下载
      // recorder.downloadPCM('新文件');
      let formdata = new FormData()
      formdata.append('file', PCMBlob)
      apis.submitAndRun(formdata).then(res=>{
        if(res.success){
          this.NodesModel=res.data.objects
          this.LinksModel=res.data.relations
          setTimeout(()=>{
            Bus.$emit("update")
          },500)
        }else{
          this.$message.error(res.message)
        }
      })

    }
  },
  //生命周期 - 创建之前",数据模型未加载,方法未加载,html模板未加载
  beforeCreate() {
  },

  //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
  created() {
    Recorder.getPermission().then(() => {

      this.$message.success('获取麦克风权限成功')

    }, (error) => {

      console.log(`${error.name} : ${error.message}`);

    });
  },
  //生命周期 - 挂载之前",html模板未渲染
  beforeMount() {

  },

  //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
  mounted() {
  },

  //生命周期 - 更新之前",数据模型已更新,html模板未更新
  beforeUpdate() {
  },
  //生命周期 - 更新之后",数据模型已更新,html模板已更新
  updated() {

  },
  //生命周期 - 销毁之前",
  beforeDestroy() {

  },
  destroyed() {

  },
  //生命周期 - 销毁完成",
  //如果页面有keep-alive缓存功能，这个函数会触发",
  activated() {

  },
}

</script>

<style>
.submit-button {
  float: right;
}

.form-title {
  font-size: 30px;
  text-align: left;
  font-weight: 800;
}

.submit-button-container {
  margin: 10px;
}

.container {
  height: 100%;
  width: 100%;
  /*box-shadow:0px 0px 10px #000;*/

}

.fullScreen {
  height: 100%;
  width: 100%;
}

.fullHeight {
  height: 100%;
}

.form-container {
  margin: 30px;
  margin-top: 10px;
  width: 100%;
}

.ping-button {
  margin-left: 10px;
}

.reload-button {
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>

