<template>
  <div class="user-score-wrap" :style="{width: width}">
    <!-- 上传功能 -->
    <h3>在此上传您的成果</h3>
    <div class="upload-area"
      v-loading="scoreLoading"
      element-loading-text="文件已上传成功，正在评分中……"
      element-loading-spinner="el-icon-loading"
    >
      <el-upload
        v-loading="uploadLoading"
        element-loading-text="检查上一次提交……"
        element-loading-spinner="el-icon-loading"
        ref="upload"
        action="/api/upload-file"
        :data="userInfo"
        :on-success="handleSuccess"
        :auto-upload="false"
        :limit="1"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">提交成果</el-button>
      </el-upload>
    </div>

    <!-- 得分与历史得分 -->
    <h3>您的得分情况</h3>
    <div class="score-area">
      <el-progress :stroke-width="10" type="circle" :percentage="parseFloat((scoreMax + '').slice(0, 9))"></el-progress>
      <p style="margin:5px;">最高分：
        <span style="color:red;font-weight:bold;font-size:24px;text-decoration:underline;">
          {{(scoreMax + '').slice(0, 10)}}
        </span>
      </p>

      <el-table :data="scoreList" max-height="380px">
        <el-table-column label="分数" sortable prop="score">
          <template slot-scope="scope">
            <span :style="{color: scope.row.score == scoreMax ? 'red' : ''}">{{scope.row.score}}</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" sortable :sort-method="scoreSortMethod" prop="time">
        </el-table-column>
      </el-table>
    </div>

    <!-- 得分提示对话框 -->
    <el-dialog
      title="得分"
      :visible.sync="scoreDialogVisible"
      width="30%"
      center>
      <p class="score">{{ totalScore }}</p>
      <table border="1" style="margin:auto;text-align:center;">
        <tr>
          <th>分数1</th><th>分数2</th>
        </tr>
        <tr>
          <td>{{score1 === -1 ? 'Error' : score1}}</td>
          <td>{{score2 === -1 ? 'Error' : score2}}</td>
        </tr>
      </table>
      <span>Tip：若分数出现“Error”，说明该部分评分失败</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="scoreDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="scoreDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'home',
  props : {
    width: {
      default: '475px',
      type: String
    },
    account: {
      require: true,
      type: String
    }
  },
  data() {
    return {
      userInfo: {
        userId: this.account
      },

      score1: 0,
      score2: 0,
      totalScore: 0,
      scoreDialogVisible: false,

      scoreList: [],
      scoreMax: 0,

      // 分数运算是否完成
      scoreLoading: false,
      // 上传按钮是否显示
      uploadLoading: true,
    }
  },
  created() {
    const self = this;
    self.getScore();

    self.$axios.post('/api/evaluate-result', {
      account: self.account
    }).then(res => {
      const data = res.data;
      console.log(data)
      if (data.status === 200 && data.result.length > 0) {
        if (data.result[0].result === 'ing') {
          self.getEvaluateResult();
        }
      } else {
        console.error(data);
      }
    }).catch(err => console.error(err));
  },
  methods: {
    scoreSortMethod(a, b) {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    },
    getScore() {
      const self = this;

      self.$axios.post('/api/user/my-score', {
        account: self.account
      })
      .then(response => {
        const data = response.data;
        if (data.status === 200) {
          self.scoreList = data.result;

          // 最高分
          if (self.scoreList.length > 0) {
            self.scoreMax = data.result.sort((a,b) => {
              return b.score - a.score;
            })[0].score;
          }

        } else {
          console.error(data.message);
          self.$message({
            type: 'error',
            message: '[' + data.status + ']' + data.message
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
    },
    submitUpload() {
      const self = this;
      self.$refs.upload.submit();
    },
    getEvaluateResult() {
      const self = this;

      const i = setInterval(() => {
        self.$axios.post('/api/evaluate-result', {
          account: self.account
        }).then(response => {
          const data = response.data;
          if (data.status === 200 && data.result.length > 0) {
            if (data.result[0].result === 'done') {
              clearInterval(i);
            }
          } else if (data.result.length === 0) {
            return;
          } else {
            console.error(data);
            clearInterval(i);
            return self.$message({
              type: 'error',
              message: data.message
            });
          }
        }).catch(err => {
          console.error(err);
        });
      }, 3000);
    },
    // data is response.data
    handleSuccess (data, file, fileList) {
      const self = this;
      
      if (data.status === 200) {

        self.getEvaluateResult();

        // 上传成功，送去评分
        self.$axios.post('/api/file-evaluate', data)
        .then(response => {
          const resData = response.data;
          if (resData.status === 200) {
            self.scoreDialogVisible = true;

            self.totalScore = resData.score;
            self.score1 = resData.score1;
            self.score2 = resData.score2;
            
            // 获取自己分数
            self.getScore();

            // 刷新所有分数
            self.$emit('fresh');

            // 清空上传成功的文件
            self.$refs.upload.clearFiles();

          } else {
            loading.close();
            console.error(resData);
            self.$alert('评分失败，请检查文件或联系管理员', '提示', {type: 'error'});
          }
        })
        .catch(err => {
          console.error(err)
        });

      } else {
        console.error(data);
        self.$message({
          type: 'error',
          message: '[' + data.status + ']' + data.message
        });
      }
    },
  }
}
</script>

<style scoped>
.user-score-wrap {
  line-height: 20px;
  height: 800px;
}
.upload-area, .score-area {
  border: 2px dashed rgb(112, 109, 109);
  width: 90%;
  margin: auto;
  padding: 10px 5px;
  border-radius: 10px;
  height: 70px;
}
.score-area {
  height: 550px;
}
.score {
  text-align: center;
  font-size: 24px;
  color: red;
  font-weight: bold;
}
</style>
