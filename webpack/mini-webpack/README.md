# features

- 将ES6语法转换成ES5的语法
  - 通过babylon生成AST
  - 通过babel-core将AST重新生成源码
- 可以分析模块间的依赖关系
  - 通过babel-traverse的ImportDeclaration获取依赖属性
  - 递归进行模块构建
- 生成的JS文件可以在浏览器运行
