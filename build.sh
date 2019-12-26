#!/bin/bash
if [[ ${CI_COMMIT_MESSAGE} =~ "@install" ]]
then
    echo '提交信息包含@install,需要更新安装依赖'
    cnpm i
else
    echo '不需要更新依赖'
fi
echo '开始构建项目'
cnpm run build
echo '复制构建文件到静态文件目录'
rm -rf /home/scda/project/html/admin
mv dist /home/scda/project/html/admin
