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
    if (success) {
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
    if (success) {
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
    const fragmentShaderSource = document.querySelector("#fragment-shader").text;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // 创建着色程序
    const program = createProgram(gl, vertexShader, fragmentShader);

    // 添加数据
    // WebGL的主要任务就是设置好状态并为GLSL着色程序提供数据

    // 初始化！时，找到属性值的位置
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    const textureLocation = gl.getUniformLocation(program, 'u_texture');
    const martixLocation = gl.getUniformLocation(program, 'u_matrix');

    // ## 属性值从缓冲中获取数据
    // 创建缓冲
    const positionBuffer = gl.createBuffer();
    // 绑定位置信息缓冲 gl.ARRAY_BUFFER 约等于 webgl的一个全局变量此处是为了bufferData
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [// ?? 坐标
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    const texcoords = [// ?? 和位置坐标一致？
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    function loadImageAndCreateTextureInfo(url) {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // 讲解的时候没有
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        const textureInfo = {
            width: 1,
            height: 1,
            texture: tex
        }
        const img = new Image();
        img.addEventListener('load', () => {
            textureInfo.width = img.width;
            textureInfo.height = img.height;

            gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        })
        // 讲解的时候没有
        img.src = url;
        return textureInfo;
    }

    const textureInfos = [
        loadImageAndCreateTextureInfo('./images/955875.png'),
        loadImageAndCreateTextureInfo('./images/955880.png'),
        loadImageAndCreateTextureInfo('./images/955878.png')
    ];

    var drawInfos = [];
    var numToDraw = 9;
    var speed = 60;
    for (var ii = 0; ii < numToDraw; ++ii) {
        var drawInfo = {
            x: Math.random() * gl.canvas.width,
            y: Math.random() * gl.canvas.height,
            dx: Math.random() > 0.5 ? -1 : 1,
            dy: Math.random() > 0.5 ? -1 : 1,
            textureInfo: textureInfos[Math.random() * textureInfos.length | 0],
        };
        drawInfos.push(drawInfo);
    }

    function update(deltaTime) {
        drawInfos.forEach(function (drawInfo) {
            drawInfo.x += drawInfo.dx * speed * deltaTime;
            drawInfo.y += drawInfo.dy * speed * deltaTime;
            if (drawInfo.x < 0) {
                drawInfo.dx = 1;
            }
            if (drawInfo.x >= gl.canvas.width) {
                drawInfo.dx = -1;
            }
            if (drawInfo.y < 0) {
                drawInfo.dy = 1;
            }
            if (drawInfo.y >= gl.canvas.height) {
                drawInfo.dy = -1;
            }
        });
    }

    function draw() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        drawInfos.forEach(function (drawInfo) {
            drawImage(
                drawInfo.textureInfo.texture,
                drawInfo.textureInfo.width,
                drawInfo.textureInfo.height,
                drawInfo.x,
                drawInfo.y);
        });
    }

    var then = 0;
    // 制作一个动画，没有停止的动画， 我想到了setInterval
    function render(time) {
        var now = time * 0.001;
        var deltaTime = Math.min(0.1, now - then);
        then = now;

        update(deltaTime);
        draw();

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


    const drawImage = (tex, texWidth, texHeight, dstX, dstY) => {
        // 这里绑定texture的作用？
        gl.bindTexture(gl.TEXTURE_2D, tex);

        // 每一次都需要使用程序吗？
        gl.useProgram(program);

        //从缓冲中获取位置信息
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        //从缓冲中获取坐标信息
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordLocation);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        //从像素空间转换到裁剪空间
        var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

        // 平移到dstx， dstY
        matrix = m4.translate(matrix, dstX, dstY, 0);

        // 缩放单位矩阵的高宽到texWidth， texHeight个单位长度 ？？
        matrix = m4.scale(matrix, texWidth, texHeight, 1);

        // 设置矩阵
        gl.uniformMatrix4fv(martixLocation, false, matrix);

        // 告诉着色器使用纹理单元 0， 为什么是零？
        gl.uniform1i(textureLocation, 0);

        // 绘制矩形
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}


main();