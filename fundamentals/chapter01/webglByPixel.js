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
    // 分辨率属性位置， 注意，这个是getUniformLocation，不需要enable
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    // ## 属性值从缓冲中获取数据
    // 创建缓冲
    const positionBuffer = gl.createBuffer();

    // 绑定位置信息缓冲 gl.ARRAY_BUFFER 约等于 webgl的一个全局变量
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 通过绑定点向缓冲中存放数据
    // position 是屏幕空间，传的像素坐标了！
    const positions = [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30
    ];
    
    // 还可以设置屏幕空间， 思考一下怎么传？下面是自己思考的（反转化）， 结果不是这样的
    // const positions = [
    //     200, 150,
    //     200, 225,
    //     340, 150
    // ].map((v, i) => {
    //     if(i % 2 === 0) {
    //         return (v - gl.canvas.width / 2) / (gl.canvas.width / 2);
    //     }
    //     return (v - gl.canvas.height / 2) / (gl.canvas.height / 2);
    // })

    // webgl需要强类型：Float32Array
    // STATIC_DRAW 提示webgl我们将怎么使用这些数据，不会经常改变这些数据
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 开始渲染了
    // 调整canvas尺寸，尽可能用css设置所需画布大小
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
    // gl.enableVertexAttribArray(resolutionUniformLocation); // 这个不用启用吗？


    // 从缓冲中读取数据
    // 将绑定点绑定到缓冲数据， 前面已经绑定过了
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 告诉属性（a_position）怎么从positionBuffer中读取数据。
    const size = 2; // 每次迭代运行提取两个单位数据
    const type = gl.FLOAT;//每个单位的数据类型是32为浮点型
    const normaliz = false;//不需要归一化数据？？
    const stride = 0;//每次迭代运动， 运动多少内容到下一个数据开始点？
    const offset = 0;//从缓冲起始位置开始读取
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normaliz, stride, offset);
    // 将属性（a_position）绑定到当前ARRAY_BUFFER（positionBuffer）
    // 意思是 a_position 读取 positionBuffer 中的前两个值， 0， 0（看下文理解正确）

    // 设置全局变量-分辨率
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // WebGL运行GLSL着色程序
    const primitiveType = gl.TRIANGLES;
    const offset2 = 0; 
    
    // "处理6个顶点"，会有6个顶点被转换
    // gl.ARRAY_BUFFER -> VertexShader -> 裁剪空间坐标系
    const count = 6;
    gl.drawArrays(primitiveType, offset2, count);// 使着色器能够在GPU上运行
}

main();