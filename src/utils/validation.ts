import * as _ from 'lodash';

const isEmail = (val: string) => {
  if (_.isEmpty(val)) {
    return false;
  }
  return /^[a-z0-9]+([._\\-]*[a-z0-9])*@(\w+([-.]\w+)*\.){1,63}[a-z0-9]+$/.test(val);
};

const isPassword = (val: string) => val.length >= 6 && val.length <= 18 ? true : false;

export const registerValidate = (data: any) => {
  const { email = '', password = '' } = data;
  let msg = '';
  if (_.isEmpty(password)) {
    msg = '密码不能为空';
  }
  if (!_.isEmpty(password) && !isPassword(password)) {
    msg = '密码长度在6-18位之间';
  }
  if (_.isEmpty(email)) {
    msg = '邮箱不能为空';
  }
  if (!_.isEmpty(email) && !isEmail(email)) {
    msg = '无效的邮箱地址';
  }
  return msg;
};
