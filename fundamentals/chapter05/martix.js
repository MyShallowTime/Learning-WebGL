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

// 这种缓冲数据的方式在大多数程序中并不常见
const setF = (gl, x, y) => {
    const width = 100, //F的宽度
    height = 150,//F的height
    thickness = 30, //字母的厚度
    wRatio = 0.8, //中横宽度与F宽度的比率
    middleHeight = height * 0.4; //中横高度与F高度的比率

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // 左竖
        x, y, 0,
        x + thickness, y, 0,
        x + thickness, y + height, 0,
        x + thickness, y + height, 0,
        x, y + height, 0,
        x, y, 0,
        // x, y, 0,
        // x + thickness, y, 0,
        // x, y + height, 0,
        // x, y + height, 0,
        // x + thickness, y, 0,
        // x + thickness, y + height, 0,

        //上横
        x + thickness, y, 0,
        x + width, y, 0,
        x + thickness, y + thickness, 0,
        x + thickness, y + thickness, 0,
        x + width, y, 0,
        x + width, y + thickness, 0,

        //中横
        x + thickness, y + middleHeight, 0,
        x + width * wRatio, y + middleHeight, 0,
        x + thickness, y + middleHeight + thickness, 0,
        x + thickness, y + middleHeight + thickness, 0,
        x + width * wRatio, y + middleHeight, 0,
        x + width * wRatio, y + middleHeight + thickness, 0

        // 文章中还用了height与thickness的关系，简化了运算
    ]), gl.STATIC_DRAW);
}
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column front
            0,   0,  0,
            0, 150,  0,
            30,   0,  0,
            0, 150,  0,
            30, 150,  0,
            30,   0,  0,
  
            // top rung front
            30,   0,  0,
            30,  30,  0,
            100,   0,  0,
            30,  30,  0,
            100,  30,  0,
            100,   0,  0,
  
            // middle rung front
            30,  60,  0,
            30,  90,  0,
            67,  60,  0,
            30,  90,  0,
            67,  90,  0,
            67,  60,  0,
  
            // left column back
              0,   0,  30,
             30,   0,  30,
              0, 150,  30,
              0, 150,  30,
             30,   0,  30,
             30, 150,  30,
  
            // top rung back
             30,   0,  30,
            100,   0,  30,
             30,  30,  30,
             30,  30,  30,
            100,   0,  30,
            100,  30,  30,
  
            // middle rung back
             30,  60,  30,
             67,  60,  30,
             30,  90,  30,
             30,  90,  30,
             67,  60,  30,
             67,  90,  30,
  
            // top
              0,   0,   0,
            100,   0,   0,
            100,   0,  30,
              0,   0,   0,
            100,   0,  30,
              0,   0,  30,
  
            // top rung right
            100,   0,   0,
            100,  30,   0,
            100,  30,  30,
            100,   0,   0,
            100,  30,  30,
            100,   0,  30,
  
            // under top rung
            30,   30,   0,
            30,   30,  30,
            100,  30,  30,
            30,   30,   0,
            100,  30,  30,
            100,  30,   0,
  
            // between top rung and middle
            30,   30,   0,
            30,   60,  30,
            30,   30,  30,
            30,   30,   0,
            30,   60,   0,
            30,   60,  30,
  
            // top of middle rung
            30,   60,   0,
            67,   60,  30,
            30,   60,  30,
            30,   60,   0,
            67,   60,   0,
            67,   60,  30,
  
            // right of middle rung
            67,   60,   0,
            67,   90,  30,
            67,   60,  30,
            67,   60,   0,
            67,   90,   0,
            67,   90,  30,
  
            // bottom of middle rung.
            30,   90,   0,
            30,   90,  30,
            67,   90,  30,
            30,   90,   0,
            67,   90,  30,
            67,   90,   0,
  
            // right of bottom
            30,   90,   0,
            30,  150,  30,
            30,   90,  30,
            30,   90,   0,
            30,  150,   0,
            30,  150,  30,
  
            // bottom
            0,   150,   0,
            0,   150,  30,
            30,  150,  30,
            0,   150,   0,
            30,  150,  30,
            30,  150,   0,
  
            // left side
            0,   0,   0,
            0,   0,  30,
            0, 150,  30,
            0,   0,   0,
            0, 150,  30,
            0, 150,   0]),
        gl.STATIC_DRAW);
  }
function setColors(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([
            // left column front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // top rung front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // middle rung front
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
          200,  70, 120,
  
            // left column back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // top rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // middle rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
  
            // top
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
  
            // top rung right
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
  
            // under top rung
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
  
            // between top rung and middle
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
  
            // top of middle rung
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
  
            // right of middle rung
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
  
            // bottom of middle rung.
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
  
            // right of bottom
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
  
            // bottom
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
  
            // left side
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220]),
        gl.STATIC_DRAW);
  };
const m4 = {
    translation: (tx, ty, tz) => {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ]
    },
    // 这些矩阵怎么来的，还是不太清楚
    xRotation: (angle) => { //这个公式记不住
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]
    },
    yRotation: (angle) => { //这个公式记不住
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]
    },
    zRotation: (angle) => { //这个公式记不住
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    },
    scaling: (x, y, z) => {
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ]
    },
    multiply: function(a, b) {
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        return [
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },
    projection:(width, height, depth) => {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1
        ]
    }, 
    translate: (m, tx, ty, tz) => {
        return m4.multiply(m, m4.translation(tx, ty, tz))
    },
    xRotate: (m, angleInRadians) => {
        return m4.multiply(m, m4.xRotation(angleInRadians))
    },
    yRotate: (m, angleInRadians) => {
        return m4.multiply(m, m4.yRotation(angleInRadians))
    },
    zRotate: (m, angleInRadians) => {
        return m4.multiply(m, m4.zRotation(angleInRadians))
    },
    scale: (m, sx, sy, sz) => {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
    }
}

// 初始化代码，只会运行一次
const main = () => {
    // 初始化一个gl
    const container = document.querySelector("#webgl");
    const gl = container.getContext('webgl');

    // 创建顶点着色器
    const vertexShaderSource = document.querySelector("#vertex-shader").text;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    // 创建片段着色器 模板字符串可
    const fsGLSL = `
        // 精度 中等 浮点类型
        precision mediump float;

        // uniform vec4 u_color;
        varying vec4 v_color;

        void main() {
            // 片段着色器的主要设置变量
            // rgba, [0, 1]
            // 对于每一个像素，WebGL会调用该值设置像素颜色
            // gl_FragColor = vec4(1, 0, 0.5, 1); // 绘制值:[255, 0, 127, 255]
            // gl_FragColor = u_color;
            gl_FragColor = v_color;
        }
    `;
    // const fragmentShaderSource = document.querySelector("#fragment-shader").text;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsGLSL);

    // 创建着色程序
    const program = createProgram(gl, vertexShader, fragmentShader);

    // 添加数据
    // WebGL的主要任务就是设置好状态并为GLSL着色程序提供数据

    // 初始化！时，找到属性值的位置
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    // // 分辨率属性位置， 注意，这个是getUniformLocation，不需要enable
    // const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    // const colorLocation = gl.getUniformLocation(program, 'u_color');

    const martixLocation = gl.getUniformLocation(program, 'u_matrix');

    // ## 属性值从缓冲中获取数据
    // 创建缓冲
    const positionBuffer = gl.createBuffer();
    // 绑定位置信息缓冲 gl.ARRAY_BUFFER 约等于 webgl的一个全局变量此处是为了bufferData
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // setF(gl, 0, 0);
    setGeometry(gl);

    // 设置颜色
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);

    let translation = [45, 150, 0];
    let rotation = [40 * Math.PI / 180, 25 * Math.PI / 180, 325 * Math.PI / 180];
    // const color = [Math.random(), Math.random(), Math.random, 1];
    let scale = [1, 1, 1];

    // 渲染
    const drawScene = () => {
        // 开始渲染了
        // 调整canvas尺寸，尽可能用css设置所需画布大小
        // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // 裁剪空间的-1 -> +1分别对应x， y 的width， height
        // css里面设置400*300， 但gl.canvas的宽高还是300*150, 实际渲染时还是400*300， why？这句有什么意义？
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // 注释与不注释，没什么区别呀

        // 清空画布 透明
        // gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 剔除负面三角形
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // 运行那个着色程序
        gl.useProgram(program);

        // 怎么从我们准备的缓冲中获取数据给着色器中的属性（a_position），需要启用该属性。
        gl.enableVertexAttribArray(positionAttributeLocation);

        // 从缓冲中读取数据
        // 将绑定点绑定到缓冲数据， 前面已经绑定过了
        // !!https://webglfundamentals.org/webgl/lessons/resources/webgl-state-diagram.html中明白了，多个buffer渲染时要重新绑定一下
        // 此处是为了vertexAttribPointer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const size = 3; // 每次迭代运行提取3个单位数据
        const type = gl.FLOAT;//每个单位的数据类型是32为浮点型
        const normaliz = false;//不需要归一化数据？？
        const stride = 0;//每次迭代运动， 运动多少内容到下一个数据开始点？
        const offset = 0;//从缓冲起始位置开始读取
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normaliz, stride, offset);

        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // 告诉属性（a_position）怎么从positionBuffer中读取数据。
        gl.vertexAttribPointer(colorAttributeLocation, size, gl.UNSIGNED_BYTE, true, stride, offset);

        // 将属性（a_position）绑定到当前ARRAY_BUFFER（positionBuffer）
        // 意思是 a_position 读取 positionBuffer 中的前两个值， 0， 0（看下文理解正确）

        // // 设置全局变量-分辨率
        // gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // 设置全局变量-颜色
        // gl.uniform4fv(colorLocation, color);

        // 设置矩阵表
        let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        // 常见的方式：写成函数
        matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
        gl.uniformMatrix4fv(martixLocation, false, matrix);
        // WebGL运行GLSL着色程序
        const primitiveType = gl.TRIANGLES;
        const offset2 = 0; 
        
        // "处理6个顶点"，会有6个顶点被转换
        // gl.ARRAY_BUFFER -> VertexShader -> 裁剪空间坐标系
        const count = 16 * 6;
        // const count = 18;
        gl.drawArrays(primitiveType, offset2, count);// 使着色器能够在GPU上运行
    }
    drawScene();
}

main();