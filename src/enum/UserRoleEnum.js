import BaseEnum from 'bluesdk-base-enum'

class UserRoleEnum extends BaseEnum {
  constructor () {
    super()
    this.MANAGER = super.put(1, '经理')
    this.STAFF = super.put(2, '员工')
  }
}

const o = new UserRoleEnum()
export default o
