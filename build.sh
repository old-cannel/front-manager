#!/bin/bash
if [[ ${CI_COMMIT_MESSAGE} =~ "@install" ]]
then
    echo '提交信息包含@install,需要更新安装依赖'
    cnpm i
#    echo '移动依赖包到统一位置'
#    rm -rf /home/scda/global/node_modules/manager/node_modules
 #   mv node_modules /home/scda/global/node_modules/manager/node_modules
else
    echo '不需要更新依赖'
fi
echo '添加依赖软连接到当前路径'
#ln -s /home/scda/global/node_modules/manager/node_modules node_modules
echo '开始构建项目'
cnpm run build
echo '复制构建文件到静态文件目录'
rm -rf /home/scda/project/html/admin
mv dist /home/scda/project/html/admin
