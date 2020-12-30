<template>
  <el-autocomplete
    class="inline-input"
    :value="agencyName"
    :fetch-suggestions="querySearch"
    placeholder="请输入代理商名称"
    :trigger-on-focus="false"
    :select-when-unmatched="true"
    @select="handleSelect"
    @blur="blur($event)"
  ></el-autocomplete>
</template>
<script>
  export default {
    data: function () {
      return {
        item: {}
      }
    },
    name: 'SelectSubAgency',
    props: {
      agencyName: String
    },
    methods: {
      querySearch: function (queryStr, cb) {
        this.$getJson({
          url: '/subAgency/listAgencyName.do?agencyName=' + queryStr,
          callback: function (vue, res) {
            let items = []
            for (let i in res.content) {
              items.push({value: res.content[i].label, agencyId: res.content[i].value})
            }
            if (items.length === 0) {
              vue.$emit('select', {value: '', agencyId: ''})
            }
            cb(items)
          }
        })
      },
      handleSelect: function (item) {
        this.$emit('select', item)
      },
      blur: function ($event) {
        if ($event.target.value === '') {
          this.$emit('select', {value: '', agencyId: ''})
        }
      }
    }
  }
</script>
