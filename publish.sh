# 设置镜像地址
npm config set registry https://registry.npmjs.org
# 登录，如果有 OTP, 邮箱会接收到验证码，输入即可
npm login 
# 登录成功后，短时间内会保存状态
# 发布
npm publish

# 切换回淘宝镜像
npm config set registry https://registry.npmmirror.com/

