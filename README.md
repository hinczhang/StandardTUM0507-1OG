# StandardTUM0507-1OG
Standard area map of 0507 building, 1 OG of TU Munich

### 使用说明
页面中小圆圈代表小型对象，如消防栓等。大圆圈是主要对象，如房间等。鼠标悬停可以看到对象名称。  
点击后弹出对话框，对于用户的标注评分。分为：  
1. Totally wrong: 标注缺失
2. Group correct: 大致标注出此区域出现的地物（如指出该区域是Cartography办公区但没有详细标明每个教室）
3. Single correct: 正确标注地物位置和基本信息  
4. Information correct: 正确标注地物位置和详细信息（如办公室功用、教授名称等）  

每种标注都会显示各自的颜色。标注完成后可以点击`标记剩余按钮`，将未标注对象全体改成`Totally wrong`。点击输出，输入文件名后即可以下载文件内容。点击`清空`即可以刷新页面。  

输出的文件内容包括：
1. obj_names: 矩阵对应的行列地物名称,
2. matrix: 邻接矩阵，值根据对应地物的平均评分计算（如果其中有一个地物的评分是0，即完全错误，则设置该单元为0，不取均分）,
3. number_score: 标注基本正确的物体和总物体量的比值,
4. main_score: 主要对象标注比值,
5. sec_score: 次要对象标注比值,
6. pre_score: 评分加权比值（给出标注精度）,
7. name: 文件名（对象名称，建议用序号_EX或CON标注）
