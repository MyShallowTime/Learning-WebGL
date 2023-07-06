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

const randomInt = (range) => {
    return Math.floor(Math.random() * range);
}

// 这种缓冲数据的方式在大多数程序中并不常见
const setRectangle = (gl, x, y, width, height) => {
    const x1 = x,
    x2 = x + width,
    y1 = y,
    y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1, 
        x2, y1, 
        x1, y2,
        x1, y2, // 这里是什么意思, 按顺序画了一下，原来是画了两个三角形， 就只支持三角形吗？
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);
}
const createTexture = (gl) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置参数，可以绘制任何尺寸的图像 ？？分别代表的什么意思？固定的吗？
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return texture;
}

const m3 = {
    identity: () => {
        return [
            1,0,0,
            0,1,0,
            0,0,1
        ]
    },
    projection:(width, height) => {
        return [
            2 / width,0,0,
            0,-2 / height,0,
            -1,1,1
        ]
    },
    multiply: (a, b) => {
        const a11 = a[0];
        const a12 = a[1];
        const a13 = a[2];
        const a21 = a[3];
        const a22 = a[4];
        const a23 = a[5];
        const a31 = a[6];
        const a32 = a[7];
        const a33 = a[8];
        const b11 = b[0];
        const b12 = b[1];
        const b13 = b[2];
        const b21 = b[3];
        const b22 = b[4];
        const b23 = b[5];
        const b31 = b[6];
        const b32 = b[7];
        const b33 = b[8];

        return [
            b11 * a11 + b12 * a21 + b13 * a31,
            b11 * a12 + b12 * a22 + b13 * a32,
            b11 * a13 + b12 * a23 + b13 * a33,

            b21 * a11 + b22 * a21 + b23 * a31,
            b21 * a12 + b22 * a22 + b23 * a32,
            b21 * a13 + b22 * a23 + b23 * a33,

            b31 * a11 + b32 * a21 + b33 * a31,
            b31 * a12 + b32 * a22 + b33 * a32,
            b31 * a13 + b32 * a23 + b33 * a33,
        ]
    }
}
// 初始化代码，只会运行一次
const main = () => {
    const image = new Image();
    image.src = "./images/point-907599.png";
    image.onload = () => {
        render(image);
    }
}
const render = (image) => {
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


    // 添加数据-WebGL的主要任务就是设置好状态并为GLSL着色程序提供数据

    // 初始化！时，找到属性值的位置
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // ## 属性值从缓冲中获取数据
    // 创建缓冲
    const positionBuffer = gl.createBuffer();
    // 绑定位置信息缓冲 gl.ARRAY_BUFFER 约等于 webgl的一个全局变量
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // 绑定数据
    // setRectangle(gl, 50, 50, 100, 100);
    setRectangle(gl, 50, 50, 20, 20);

    // 找到纹理地址
    const texcoordLocation = gl.getAttribLocation(program, "a_textCoord");
    const textCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([// 这是什么？纹理坐标吗？裁剪坐标？
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0, 
        1, 1
    ]), gl.STATIC_DRAW);
    // 无论纹理是什么尺寸，纹理坐标范围始终是 0.0 到 1.0 。

    const texture = createTexture(gl);
    // 将图像上传到纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');

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
    // 将绑定点绑定到缓冲数据， 前面已经绑定过了
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // 告诉属性（a_position）怎么从positionBuffer中读取数据。
    const size = 2; // 每次迭代运行提取两个单位数据
    const type = gl.FLOAT;//每个单位的数据类型是32为浮点型
    const normaliz = false;//不需要归一化数据？？
    const stride = 0;//每次迭代运动， 运动多少内容到下一个数据开始点？
    const offset = 0;//从缓冲起始位置开始读取
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normaliz, stride, offset);
    // 将属性（a_position）绑定到当前ARRAY_BUFFER（positionBuffer）
    // 意思是 a_position 读取 positionBuffer 中的前两个值， 0， 0（看下文理解正确）

    // 纹理
    gl.enableVertexAttribArray(texcoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, textCoordBuffer);
    gl.vertexAttribPointer(texcoordLocation, size, type, normaliz, stride, offset);

    // 设置全局变量-分辨率
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    let matrix = m3.identity();
    matrix = m3.multiply(matrix, m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight))
    gl.uniformMatrix3fv(matrixUniformLocation,false, matrix);

    // WebGL运行GLSL着色程序
    const primitiveType = gl.TRIANGLES; // 矩形也是用三角形来绘制的
    const offset2 = 0; 
    const count = 6; 
    gl.drawArrays(primitiveType, offset2, count); // 使着色器能够在GPU上运行
}

main();