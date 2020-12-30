<template>

  <el-select v-model="shopName" filterable placeholder="请选择"
             style="width: 200px" @change="change">
    <el-option
      v-for="item in content"
      :key="item.shopId"
      :label="item.shopName"
      :value="item.shopId">
    </el-option>
  </el-select>

</template>
<script>
  export default {
    name: 'ShopSelect',
    data () {
      return {
        map: {},
        content: [],
        shopName: this.$url.getPara('shopName'),
        shopId: this.$url.getPara('shopId')
      }
    },
    beforeCreate () {
      this.$getJson({
        url: '/shop/list.do',
        callback (vue, res) {
          let init = false
          for (let i in res.data) {
            const shopId = res.data[i].shopId
            vue.map[shopId] = res.data[i].shopName
            if (!vue.shopName) {
              vue.shopName = vue.map[shopId]
              init = true
              vue.shopId = shopId
              vue.change(shopId)
            }
          }
          if (!init) {
            vue.change(vue.shopId)
          }
          vue.content = res.data
          vue.$emit('updateMap', vue.map)
        }
      })
    },
    methods: {
      change (val) {
        this.$emit('change', { shopId: val, shopName: this.map[val] })
      }
    }
  }
</script>
