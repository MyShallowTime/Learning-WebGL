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
        x, y,
        x + thickness, y,
        x, y + height,
        x, y + height,
        x + thickness, y,
        x + thickness, y + height,

        //上横
        x + thickness, y,
        x + width, y,
        x + thickness, y + thickness,
        x + thickness, y + thickness,
        x + width, y,
        x + width, y + thickness,

        //中横
        x + thickness, y + middleHeight,
        x + width * wRatio, y + middleHeight,
        x + thickness, y + middleHeight + thickness,
        x + thickness, y + middleHeight + thickness,
        x + width * wRatio, y + middleHeight,
        x + width * wRatio, y + middleHeight + thickness

        // 文章中还用了height与thickness的关系，简化了运算
    ]), gl.STATIC_DRAW);
}

const m3 = {
    translation: (tx, ty) => {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ]
    },
    rotation: (angle) => { //这个公式记不住
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ]
    },
    scaling: (x, y) => {
        return [
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        ]
    },
    multiply: (a, b) => { //两个矩阵相乘
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
            b31 * a13 + b32 * a23 + b33 * a33
        ]
        // return [
        //     a11 * b11 + a12 * b21 + a13 * b31,
        //     a11 * b12 + a12 * b22 + a13 * b32,
        //     a11 * b13 + a12 * b23 + a13 * b33,

        //     a21 * b11 + a22 * b21 + a23 * b31,
        //     a21 * b12 + a22 * b22 + a23 * b32,
        //     a21 * b13 + a22 * b23 + a23 * b33,

        //     a31 * b11 + a32 * b21 + a33 * b31,
        //     a31 * b12 + a32 * b22 + a33 * b32,
        //     a31 * b13 + a32 * b23 + a33 * b33
        // ]
    },
    identity: () => {//单位矩阵，与它相乘的矩阵都没有变化
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]
    },
    projection:(width, height) => {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ]
    }, 
    translate: (m, tx, ty) => {
        return m3.multiply(m, m3.translation(tx, ty))
    },
    rotate: (m, angleInRadians) => {
        return m3.multiply(m, m3.rotation(angleInRadians))
    },
    scale: (m, sx, sy) => {
        return m3.multiply(m, m3.scaling(sx, sy));
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

        uniform vec4 u_color;

        void main() {
            // 片段着色器的主要设置变量
            // rgba, [0, 1]
            // 对于每一个像素，WebGL会调用该值设置像素颜色
            // gl_FragColor = vec4(1, 0, 0.5, 1); // 绘制值:[255, 0, 127, 255]
            gl_FragColor = u_color;
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
    // 分辨率属性位置， 注意，这个是getUniformLocation，不需要enable
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    const colorLocation = gl.getUniformLocation(program, 'u_color');

    const martixLocation = gl.getUniformLocation(program, 'u_matrix');

    // ## 属性值从缓冲中获取数据
    // 创建缓冲
    const positionBuffer = gl.createBuffer();
    // 绑定位置信息缓冲 gl.ARRAY_BUFFER 约等于 webgl的一个全局变量此处是为了bufferData
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setF(gl, 0, 0);

    // scale为负数没有生效，是因为translation为0， 计算超出可视范围
    // let translation = [0, 0];
    let translation = [100, 100];
    let angle = 0;
    let width = 100;
    let height = 30;
    const color = [Math.random(), Math.random(), Math.random, 1];
    let scale = [1, 1];

    // 渲染
    const drawScene = () => {
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

        // 从缓冲中读取数据
        // 将绑定点绑定到缓冲数据， 前面已经绑定过了
        // !!https://webglfundamentals.org/webgl/lessons/resources/webgl-state-diagram.html中明白了，多个buffer渲染时要重新绑定一下
        // 此处是为了vertexAttribPointer
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

        // 设置全局变量-分辨率
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // 设置全局变量-颜色
        gl.uniform4fv(colorLocation, color);

        // 设置矩阵表
        // const translationMatrix = m3.translation(translation[0], translation[1]);
        // const rotationMatrix = m3.rotation(angle * Math.PI / 180);
        // const scaleMatrix = m3.scaling(scale[0], scale[1]);
        // 第一种方式
        // gl.uniformMatrix3fv(martixLocation, false, m3.multiply(m3.multiply(translationMatrix, rotationMatrix), scaleMatrix));
        // 第二种方式
        let matrix = m3.identity();
        // 返回画布在浏览器中实际显示的大小，常用于计算长宽比
        matrix = m3.multiply(matrix, m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight));
        // 常见的方式：写成函数
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angle * Math.PI / 180);
        matrix = m3.scale(matrix, scale[0], scale[1]);
        // matrix = m3.multiply(matrix, translationMatrix);
        // matrix = m3.multiply(matrix, rotationMatrix);
        // matrix = m3.multiply(matrix, scaleMatrix);
        const centerMatrix = m3.translation(-50, -75);
        matrix = m3.multiply(matrix, centerMatrix);
        gl.uniformMatrix3fv(martixLocation, false, matrix);
        // WebGL运行GLSL着色程序
        const primitiveType = gl.TRIANGLES;
        const offset2 = 0; 
        
        // "处理6个顶点"，会有6个顶点被转换
        // gl.ARRAY_BUFFER -> VertexShader -> 裁剪空间坐标系
        const count = 18;
        gl.drawArrays(primitiveType, offset2, count);// 使着色器能够在GPU上运行
    }
    drawScene();

    // 绑定点击事件
    const btn = document.querySelector('#changeTranslation');
    btn.onclick = () => {
        console.log('click Translation');
        translation = [Math.random() * (gl.canvas.width - width), Math.random() * (gl.canvas.height - height)];
        drawScene();
    }

    // 绑定点击事件
    const btn2 = document.querySelector('#changeRotation');
    btn2.onclick = () => {
        console.log('click rotation');
        angle += 20;
        drawScene();
    }

    // 绑定点击事件
    const btn3 = document.querySelector('#changeScale');
    btn3.onclick = () => {
        console.log('click scale');
        scale = [Math.random(), Math.random()];
        drawScene();
    }
}

main();