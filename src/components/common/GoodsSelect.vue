<template>

  <el-select v-model="goodsName" @visible-change="visibleChange" filterable :clearable="true" placeholder="请选择"
             style="width: 560px" @change="change" @clear="clearGoods">
    <el-option
      v-for="item in goodsList"
      :key="item.goodsId"
      :label="item.goodsName"
      :value="item.goodsId">
    </el-option>
  </el-select>

</template>
<script>
  import $ from 'jquery'

  export default {
    name: 'GoodsSelect',
    data () {
      return {
        goodsName: '',
        goodsList: []
      }
    },
    methods: {
      change (val) {
        for (let i in this.goodsList) {
          const item = this.goodsList[i]
          if (item.goodsId === val) {
            this.$emit('change', item)
          }
        }
      },
      queryTaskGoods (goodsId) {
        this.$getJson({
          url: '/task/listGoods.do?goodsId=' + goodsId,
          callback (vue, res) {
            vue.goodsList = res.data
            for (let i in vue.goodsList) {
              const item = vue.goodsList[i]
              if (goodsId === item.goodsId) {
                vue.goodsName = item.goodsName
                vue.$emit('change', item)
              }
            }
          }
        })
      },
      queryTaskGoods2 (goodsId, tradeDate) {
        this.$getJson({
          url: '/task/listGoods2.do',
          data: { goodsId, tradeDate },
          callback (vue, res) {
            vue.goodsList = res.data
            for (let i in vue.goodsList) {
              const item = vue.goodsList[i]
              if (goodsId === item.goodsId) {
                vue.goodsName = item.goodsName
                vue.$emit('change', item)
              }
            }
          }
        })
      },
      clearGoods () {
        this.$emit('change', { goodsId: '', goodsName: '' })
      },
      queryGoods (date, shopId, goodsId) {
        if (!shopId) {
          return
        }
        this.$getJson({
          url: '/goods/list.do',
          data: { date, shopId },
          callback (vue, res) {
            vue.goodsList = res.data
            for (let i in vue.goodsList) {
              const item = vue.goodsList[i]
              if (goodsId === item.goodsId) {
                vue.goodsName = item.goodsName
                vue.$emit('change', item)
              }
            }
          }
        })
      },
      queryGoods2 (dateBegin, dateEnd, shopId, goodsId) {
        if (!shopId) {
          return
        }
        this.$getJson({
          url: '/goods/list2.do',
          data: { dateBegin, dateEnd, shopId },
          callback (vue, res) {
            vue.goodsList = res.data
            for (let i in vue.goodsList) {
              const item = vue.goodsList[i]
              if (goodsId === item.goodsId) {
                vue.goodsName = item.goodsName
                vue.$emit('change', item)
              }
            }
          }
        })
      },
      visibleChange (visible) {
        if (visible) {
          const self = this
          $('.el-select-dropdown__item').each(function () {
            const e = $(this)
            if (!e.find('img').length) {
              const txt = e.text()
              for (let i in self.goodsList) {
                if (txt === self.goodsList[i].goodsName) {
                  e.prepend('<img src="https://' + self.goodsList[i].goodsImg + '" width="30" height="30" style="vertical-align: middle;margin-right: 5px"/>')
                  break
                }
              }
            }
          })
        }
      }
    }
  }
</script>
