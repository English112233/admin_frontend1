<template>
  <el-select v-model="userName" :loading="loading" placeholder="员工" @change="change">
    <el-option v-if="showEmpty"
               key="0"
               label="全部"
               value="">
    </el-option>
    <el-option
      v-for="(name,id) in map"
      :key="id"
      :label="name"
      :value="id">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'UserSelect',
    data: function () {
      return {
        map: {},
        loading: true,
        userName: ''
      }
    },
    props: {
      showEmpty: {
        type: Boolean
      },
      selectedId: null
    },
    beforeCreate: function () {
      this.$getJson({
        url: '/user/list.do?pageSize=100&userRole=2&disabled=0',
        callback: function (vue, res) {
          for (let i in res['data']['list']) {
            let item = res['data']['list'][i]
            vue.map[item.userId] = item.userName
          }
          vue.loading = false
          vue.$emit('updateMap', vue.map)
          if (vue.selectedId) {
            vue.userName = vue.map[vue.selectedId]
          }
        }
      })
    },
    methods: {
      change: function (value) {
        this.$emit('change', value)
      }
    }
  }
</script>
