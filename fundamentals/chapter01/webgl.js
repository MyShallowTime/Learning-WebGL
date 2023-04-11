// import { createShader, createProgram } from "./WebGLUtil"; //TODO 本地不支持
/**
 * 创建着色器方法
 * @param {*} gl 渲染上下文
 * @param {*} type 着色器类型：顶点、片段
 * @param {*} source 数据源 glsl语言
 * @returns 
 */
 const createShader = (gl, type, source) => {
    // 创建着色器对象
    const shader = gl.createShader(type);
    // 添加数据源
    gl.shaderSource(shader, source);
    // 编译，生成着色器
    gl.compileShader(shader);
    // 判断成功与否
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
/**
 * 创建GLSL着色程序
 * 往往都是顶点着色器+片段着色器成对出现
 * @param {*} gl 渲染上下文
 * @param {*} vertexShader 顶点着色器
 * @param {*} fragmentShader 片段着色器
 * @returns 
 */
const createProgram = (gl, vertexShader, fragmentShader) => {
    // 创建着色程序
    const propram = gl.createProgram();
    // 将着色器链接到着色程序
    gl.attachShader(propram, vertexShader);
    gl.attachShader(propram, fragmentShader);
    // 将着色程序链接到gl
    gl.linkProgram(propram);
    // 判断成功与否
    const success = gl.getProgramParameter(propram, gl.LINK_STATUS);
    if(success) {
        return propram;
    }
    console.log(gl.getProgramInfoLog(propram));
    gl.deleteProgram(propram);
}

// 初始化代码，只会运行一次
const main = () => {
    // 初始化一个gl
    const container = document.querySelector("#webgl");
    const gl = container.getContext('webgl');

    // 创建顶点着色器
    const vertexShaderSource = document.querySelector("#vertex-shader").text;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    // 创建片段着色器
    const fragmentShaderSource = document.querySelector("#fragment-shader").text;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // 创建着色程序
    const program = createProgram(gl, vertexShader, fragmentShader);

    // 添加数据
    // WebGL的主要任务就是设置好状态并为GLSL着色程序提供数据

    // 初始化！时，找到属性值的位置
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // ## 属性值从缓冲中获取数据
    // 创建缓冲
    const positionBuffer = gl.createBuffer();

    // 绑定位置信息缓冲 gl.ARRAY_BUFFER 约等于 webgl的一个全局变量
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 通过绑定点向缓冲中存放数据
    // position 是裁剪空间，绘制时会转换成屏幕空间, (自己换算了一遍，正确)
    const positions = [
        0, 0, //200, 150
        0, 0.5,//200, 225
        0.7, 0//340,150
    ];

    // webgl需要强类型：Float32Array
    // STATIC_DRAW 提示webgl我们将怎么使用这些数据，不会经常改变这些数据
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 开始渲染了
    // 调整canvas尺寸，尽可能用css设置所需画布大小 注释掉也没什么影响
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // 裁剪空间的-1 -> +1分别对应x， y 的width， height
    // css里面设置400*300， 但gl.canvas的宽高还是300*150, 实际渲染时还是400*300， why？这句有什么意义？
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // 注释与不注释，没什么区别呀

    // 清空画布 透明
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 运行那个着色程序
    gl.useProgram(program);

    // 怎么从我们准备的缓冲中获取数据给着色器中的属性（a_position），需要启用该属性。
    gl.enableVertexAttribArray(positionAttributeLocation);

    // 从缓冲中读取数据
    // 将绑定点绑定到缓冲数据， 前面已经绑定过了TODO示例中也是绑定两次，why？注释掉也没影响
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 告诉属性（a_position）怎么从positionBuffer中读取数据。
    const size = 2; // 每次迭代运行提取两个单位数据， xy
    const type = gl.FLOAT;//每个单位的数据类型是32为浮点型
    const normaliz = false;//不需要归一化数据？标准化标记适用于所有非浮点型数据。false-解读原数据类型
    const stride = 0;//每次迭代运动， 运动多少内容到下一个数据开始点？
    const offset = 0;//从缓冲起始位置开始读取它们。使用 0 以外的值时会复杂得多，虽然这样会取得一些性能能上的优势， 但是一般情况下并不值得，除非你想充分压榨WebGL的性能。
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normaliz, stride, offset);
    // 将属性（a_position）绑定到当前ARRAY_BUFFER（positionBuffer）
    // 意思是 a_position 读取 positionBuffer 中的前两个值， 0， 0（看下文理解正确）

    // WebGL运行GLSL着色程序
    const primitiveType = gl.TRIANGLES; // 设置图元类型为三角形，还有哪些类型？（点、线、三角形）
    const offset2 = 0; //设置为-0.5， 没什么效果？1也没有？？
    // 顶点着色器将运行三次， 第一次，a_position的xy被赋值0， 0， 第二次，被赋值为0， 0.5， 第三次，被赋值为0.7， 0
    const count = 3; 
    gl.drawArrays(primitiveType, offset2, count);// 使着色器能够在GPU上运行
}

main();