<template>
    <div>
        <div class="container" style="margin-top:30px;">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-add"
                    class="handle-del mr10"
                    @click="addUserVisible=true"
                >添加用户</el-button>
                <el-input v-model="query.name" placeholder="用户名" @keydown.enter.native="handleSearch" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button @click="handleSearchReset">重置</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="200" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.register?'success':'danger'"
                        >{{scope.row.register?'已注册':'未注册'}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="reg_time" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="sizes, total, prev, pager, next"
                    :pager-count="5"
                    :current-page.sync="query.pageIndex"
                    :page-sizes="[5, 10, 15]"
                    :page-size.sync="query.pageSize"
                    :total="rawTableData.length"
                    @size-change="updateTable()"
                    @current-change="updateTable()"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" style="text-align:left;">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.register">
                      <el-radio :label="true">注册</el-radio>
                      <el-radio :label="false">未注册</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {};">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加用户弹出框 -->
        <el-dialog title="添加用户" :visible.sync="addUserVisible" width="30%" style="text-align:left;">
            <el-form :model="form" ref="addUserForm" :rules="rules" label-width="70px">
                <el-form-item label="账户" prop="account">
                    <el-input v-model="form.account" @keydown.enter.native="addUser"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="form.name" @keydown.enter.native="addUser"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" @keyup.enter.native="addUser"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserVisible = false; form = {}">取 消</el-button>
                <el-button type="success" @click="addUser">添加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            
            tableData: [],
            rawTableData: [],
            rawTableDataCache: [],

            multipleSelection: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            addUserVisible: false,
            rules: {
                account: [
                    {required: true, message: '请输入账户（ID）'}
                ],
                name: [
                    {required: true, message: '请输入用户名'}
                ],
                password: [
                    {required: true, message: '请输入密码'}
                ]
            }
        };
    },
    created() {
        this.getUser();
    },
    methods: {
        getUser() {
            const self = this;
            self.$axios.get('/api/admin/all-user')
            .then(response => {
                const data = response.data;
                if (data.status === 200) {
                    self.tableData = data.result.map(i => {
                        return i;
                    });
                    self.rawTableData = data.result.map(i => {
                        return i;
                    });

                    self.updateTable();
                } else {
                    self.$message({
                        type: 'error',
                        message: '[' + data.status + ']' + data.message
                    })
                }
            })
            .catch(err => {
                console.error(err)
            });
        },
        addUser() {
            const self = this;

            self.$refs.addUserForm.validate(valid => {
                if (valid) {
                    self.$axios.post('/api/admin/add-user', self.form)
                    .then( response => {
                        const data = response.data;
                        if (data.status === 200) {
                            self.$message.success('添加成功');

                            self.addUserVisible = false;
                            self.rawTableData.push(data.form);

                            self.updateTable();

                            // self.form = {};
                        } else {
                            console.error(data.message)
                            self.$message.error('[' + data.status + ']' + data.message);
                        }
                    })
                    .catch( err => {
                        if (err) {
                            console.error(err)
                        }
                    });
                }
            })
        },
        // 触发搜索按钮
        handleSearch() {
            if (this.rawTableDataCache.length > 0) {
                this.rawTableData = this.rawTableDataCache.map(r=>r);
                this.rawTableDataCache = [];
            }
            this.rawTableDataCache = this.rawTableData.map(r=>r);
            
            this.rawTableData = this.rawTableData.map(i => {
                if (i.name.indexOf(this.query.name) != -1) {
                    return i;
                }
            }).filter(r => r);

            this.updateTable();
        },
        // 重置搜索结果
        handleSearchReset() {
            this.rawTableData = this.rawTableDataCache.map(r=>r);
            this.rawTableDataCache = [];
            this.query.name = '';
            this.updateTable();
        },
        // 删除操作
        handleDelete(index, row) {
            const self = this;
            // 二次确认删除
            self.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                self.$axios.post('/api/admin/delete-user', {
                    users: [
                        {account: row.id, register: row.register}
                    ]
                })
                .then( response => {
                    const data = response.data;
                    if (data.status === 200) {
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    } else {
                        this.$message.error('[' + data.status + ']' + data.message);
                    }
                })
                .catch( err => {
                    if (err) {
                        console.error(err);
                    }
                });
                
            }).catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const self = this;
            // 二次确认删除
            self.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                let users = self.multipleSelection.map( i => {
                    return {
                        account: i.id,
                        register: i.register
                    }
                });
                self.$axios.post('/api/admin/delete-user', {
                    users: users
                })
                .then( response => {
                    const data = response.data;
                    if (data.status === 200) {
                        self.$message.success('删除成功');
                        self.getUser();
                    } else {
                        self.$message.error('[' + data.status + ']' + data.message);
                    }
                })
                .catch( err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }).catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            // 深拷贝
            this.idx = index;
            if (!row.register) {
                this.form = JSON.parse(JSON.stringify(row));
                this.form.toRegister = true;
            } else {
                this.form = JSON.parse(JSON.stringify(row));
            }

            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            const self = this;
            if (JSON.stringify(self.form) == JSON.stringify(self.tableData[self.idx]))
            {
                return self.$message({
                    message: '什么也没有发生',
                    type: 'warning'
                });
            } else if (!self.form.toRegister && self.form.register === false) {
                return self.$alert('不允许修改已注册用户的注册状态', '提示', {type: 'warning'});
            } else {
                self.$axios.post('/api/admin/alter-user', self.form)
                .then(response => {
                    const data = response.data;
                    if (data.status === 200) {
                        self.$message.success(`修改成功`);

                        // 用存储表单更新数据，避免网页刷新
                        self.tableData[self.idx].name = self.form.name
                        self.tableData[self.idx].register = self.form.register
                        self.tableData[self.idx].password = self.form.password

                        // 清空临时表单
                        self.form = {};
                        self.editVisible = false;
                    } else {
                        self.$message.error('[' + data.status + ']' + data.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
            }
        },

        updateTable() {
            let idx = this.query.pageIndex;
            let size = this.query.pageSize;
            this.tableData = this.rawTableData.slice((idx-1)*size, idx*size);
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
