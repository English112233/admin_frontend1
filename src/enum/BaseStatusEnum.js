import BaseEnum from 'bluesdk-base-enum'

class BaseStatusEnum extends BaseEnum {
  constructor () {
    super()
    this.FAIL = super.put(-1, '失败')
    this.PROCESS = super.put(0, '处理中')
    this.SUCCESS = super.put(1, '成功')
    this.PENDING = super.put(2, '待处理')
  }
}

const o = new BaseStatusEnum()
export default o
