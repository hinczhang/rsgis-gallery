<template>
    <el-card shadow="hover" body-style="padding: 0 20px;">
        <div slot="header" class="clearfix">
            <span>注册申请</span>
            <!-- <el-button style="color:#f25e43;float: right; padding: 3px 5px" type="text" @click="clearDone">清空已处理</el-button> -->
            <el-button style="float: right; padding: 3px 5px" type="text" @click="passAll">一键清空</el-button> 
        </div>
        <el-table stripe :data="registerList" height="330" style="width: 100%;font-size:14px;">
            <!-- @selection-change="(val)=>{multiSelection=val;}" -->
        
            <!-- <el-table-column width="40" type="selection" :selectable="(row, index) => {return !row.register;}">
            </el-table-column> -->
            <el-table-column label="账户">
                <template slot-scope="scope">
                    <div class="todo-item" :class="{'todo-item-del': scope.row.register}">
                        {{scope.row.account}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="用户名">
                <template slot-scope="scope">
                    <div class="todo-item" :class="{'todo-item-del': scope.row.register}">
                        {{scope.row.name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="申请时间">
                <template slot-scope="scope">
                    <div class="todo-item" :class="{'todo-item-del': scope.row.register}">
                        {{scope.row.time}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="70">
                <template slot-scope="scope">
                    <!-- <el-tooltip content="通过" placement="top">
                        <el-button type="text" style="color:#606266;" @click="passOne(scope.row)"><i class="el-icon-check"></i></el-button>
                    </el-tooltip> -->
                    <el-tooltip content="删除" placement="top">
                        <el-button type="text" style="color:#606266;" @click="deleteOne(scope.row)"><i class="el-icon-delete"></i></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            registerList: [],
            multiSelection: []
        }
    },
    methods: {
        clearDone() {
            const self = this;

            self.$confirm('确定清空已处理请求吗？', '提示', {
                type: 'error'
            }).then( () => {
                // 已处理的请求
                const ids = self.registerList.map(i => {
                    if (i.register) {
                        return i.id;
                    }
                }).filter(r => r);

                if (ids.length > 0) {
                    self.$axios.post('/api/admin/delete-requests', {
                        ids: ids
                    }).then(response => {
                        const data = response.data;
                        if (data.status === 200) {
                            self.$message.success('已清空');
                            self.getRegisterList();
                        } else {
                            self.$message.error('[' + data.status + ']' + data.message);
                        }
                    }).catch(err => {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            }).catch(() => {});
        },
        deleteOne(row) {
            const self = this;

            if (row.register) {
                self.$axios.post('/api/admin/delete-requests', {
                    ids: [row.id]
                }).then(response => {
                    const data = response.data;
                    if (data.status === 200) {
                        self.$message.success('已清空');

                        let idx = self.registerList.indexOf(row);
                        self.registerList.splice(idx, idx+1);
                    } else {
                        self.$message.error('[' + data.status + ']' + data.message);
                    }
                }).catch(err => {
                    if (err) {
                        console.error(err);
                    }
                });
            } else {
                self.$confirm('确定删除该条请求吗？', '提示', {
                    type: 'error'
                }).then( () => {
                    self.$axios.post('/api/admin/delete-requests', {
                        ids: [row.id]
                    }).then(response => {
                        const data = response.data;
                        if (data.status === 200) {
                            self.$message.success('已清空');

                            let idx = self.registerList.indexOf(row);
                            self.registerList.splice(idx, idx+1);
                        } else {
                            self.$message.error('[' + data.status + ']' + data.message);
                        }
                    }).catch(err => {
                        if (err) {
                            console.error(err);
                        }
                    });
                }).catch(() => {});
            }
        },
        passAll() {
            var len=this.registerList.length;
            for(var i=0;i<len;i++){
                this.deleteOne(this.registerList[i]);
            }
            /*const self = this;
            if (self.multiSelection.length > 0) {
                let ids = self.multiSelection.map(i => {
                    return i.id
                });
                self.$axios.post('/api/admin/register-users', {
                    ids: ids
                }).then(response => {
                    const data = response.data;
                    if (data.status === 200) {
                        self.$message.success('提交成功');
                        self.getRegisterList();
                    } else {
                        self.$message.error('[' + data.status + ']' + data.message);
                    }
                }).catch(err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }*/
        },
        passOne(row) {
            const self = this;
            if (!row.register) {
                self.$axios.post('/api/admin/register-users', {
                    ids: [row.id]
                }).then(response => {
                    const data = response.data;
                    if (data.status === 200) {
                        self.$message.success('提交成功');
                        self.registerList[self.registerList.indexOf(row)].register = true;
                    } else {
                        self.$message.error('[' + data.status + ']' + data.message);
                    }
                }).catch(err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        },
        getRegisterList() {
            const self = this;
            self.$axios.get('/api/admin/all-request')
            .then(response => {
                const data = response.data;
                if (data.status === 200) {
                    self.registerList = data.result.sort((a, b) => {
                        return b.time > a.time ? 1 : -1;
                    });
                } else {
                    self.$message({
                        type: 'error',
                        message: '[' + data.status + ']' + data.message
                    });
                }
            })
            .catch(err => {
                if (err) {
                    console.error(err);
                }
            });
        }
    },
    created() {
        this.getRegisterList();
    },
}
</script>

<style scoped>
.todo-item {
    font-size: 14px;
}

/* .todo-item-del {
    text-decoration: line-through;
    color: #999;
} */
</style>