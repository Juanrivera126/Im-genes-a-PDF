// --- PLANTILLA DE MODELO.HTML EMBEBIDA ---
const TEMPLATE_MODELO = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=yes,minimal-ui">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>Presentador de diapositivas</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            height: 100%;
            overflow: hidden;
            background-color: #1a1a1a;
        }
        .presentation {
            position: relative;
            background-color: #1a1a1a;
            color: white;
            box-sizing: border-box;
        }
        /* SIZE: será reemplazado por la selección del usuario (horizontal/vertical) */
        %%PRESENTATION_STYLE%%
        .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            padding-bottom: 40px;
            box-sizing: border-box;
            opacity: 0;
            pointer-events: none;
        }
        .slide.active {
            opacity: 1;
            z-index: 1;
            pointer-events: auto;
        }
        .slide h2 {
            font-size: 2.3em;
            margin-bottom: 20px;
            text-align: center;
        }
        .slide p {
            font-size: 1.2em;
            max-width: 800px;
            text-align: center;
            margin-bottom: 20px;
        }
        .slide img, .slide video {
            max-width: 100%;
            max-height: 85%;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }
        .slide iframe {
            width: calc(100% - 120px);
            height: 85%;
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }
        .slide-link-badge {
            position: absolute;
            bottom: 55px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33,150,243,0.85);
            color: white;
            font-size: 0.8em;
            padding: 4px 12px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 2;
            backdrop-filter: blur(4px);
            white-space: nowrap;
        }
        .slide-link-badge:hover {
            background: rgba(33,150,243,1);
        }
        .nav-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            font-size: 1.5em;
            border-radius: 50%;
            z-index: 2;
        }
        .nav-button:hover {
            background-color: rgba(255,255,255,0.3);
        }
        #prevBtn {
            left: 20px;
        }
        #nextBtn {
            right: 20px;
        }
        .indicators {
            position: absolute;
            bottom: 35px; /* Subido un poco para dejar espacio al footer */
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            z-index: 2;
        }
        .indicator {
            width: 12px;
            height: 12px;
            background-color: rgba(255,255,255,0.3);
            border-radius: 50%;
            margin: 0 5px;
            cursor: pointer;
        }
        .indicator.active {
            background-color: white;
        }
        
        /* Estilo del footer DE LA PRESENTACIÓN GENERADA */
        footer {
            position: absolute;
            bottom: 5px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.4);
            z-index: 3;
            pointer-events: none;
            font-family: sans-serif;
        }
    </style>
</head>
<body>
    <div class="presentation">
        <div id="slideContainer">
            <!-- Las diapositivas se generarán dinámicamente aquí -->
        </div>
        
        <button id="prevBtn" class="nav-button">&#10094;</button>
        <button id="nextBtn" class="nav-button">&#10095;</button>
        
        <div class="indicators"></div>

        <!-- FOOTER EN EL HTML GENERADO -->
        <footer>Diseñado por Juan Guillermo Rivera Berrío con tecnología Gemini 3 Pro</footer>
    </div>

<script type="module">
    const slideContainer = document.getElementById('slideContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelector('.indicators');

    let slides = [];
    let currentSlide = 0;

    const transitions = [
        { name: 'fade',           duration: '0.6s', easing: 'ease-in-out' },
        { name: 'slideLeft',      duration: '0.5s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'slideRight',     duration: '0.5s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'slideUp',        duration: '0.5s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'slideDown',      duration: '0.5s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'rotate',         duration: '0.7s', easing: 'ease-in-out' },
        { name: 'scale',          duration: '0.5s', easing: 'ease-out' },
        { name: 'flipX',          duration: '0.7s', easing: 'ease-in-out' },
        { name: 'flipY',          duration: '0.7s', easing: 'ease-in-out' },
        { name: 'zoomBlur',       duration: '0.6s', easing: 'ease-out' },
        { name: 'swingIn',        duration: '0.7s', easing: 'ease-out' },
        { name: 'bounceIn',       duration: '0.8s', easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
        { name: 'glitch',         duration: '0.5s', easing: 'steps(4, end)' },
        { name: 'spiralIn',       duration: '0.7s', easing: 'ease-out' },
        { name: 'dropIn',         duration: '0.6s', easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
        { name: 'unfold',         duration: '0.6s', easing: 'ease-in-out' },
        { name: 'skewIn',         duration: '0.55s', easing: 'ease-out' },
        { name: 'slideTopLeft',   duration: '0.55s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'slideBottomRight',duration: '0.55s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'flipDiagonal',   duration: '0.75s', easing: 'ease-in-out' },
        { name: 'rotateScale',    duration: '0.7s', easing: 'ease-in-out' },
        { name: 'blurIn',         duration: '0.6s', easing: 'ease-out' },
        { name: 'lightSpeed',     duration: '0.6s', easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' },
        { name: 'jackInTheBox',   duration: '0.8s', easing: 'cubic-bezier(0.68,-0.55,0.27,1.55)' },
        { name: 'perspectiveFlip',duration: '0.8s', easing: 'ease-in-out' },
    ];

    function initSlides() {
        // Crear diapositivas dinámicamente
        mediaItems.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide' + (index === 0 ? ' active' : '');

            if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.url;
                video.controls = true;
                video.autoplay = false;
                video.style.maxWidth = '100%';
                video.style.height = 'auto';
                video.style.borderRadius = '10px';
                video.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
                slide.appendChild(video);
            } else if (item.type === 'html') {
                const iframe = document.createElement('iframe');
                // Decodificar base64 → texto HTML
                const b64 = item.url.split(',')[1];
                iframe.srcdoc = decodeURIComponent(escape(atob(b64)));
                iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
                slide.appendChild(iframe);
            } else {
                const img = document.createElement('img');
                img.src = item.url;
                img.alt = \`Imagen \${index + 1}\`;
                img.onerror = function () {
                    this.style.display = 'none';
                    const errorMsg = document.createElement('p');
                    errorMsg.textContent = \`Imagen \${index + 1} no encontrada\`;
                    slide.appendChild(errorMsg);
                };
                slide.appendChild(img);
            }

            // Badge de enlace si existe
            if (item.link) {
                const badge = document.createElement('span');
                badge.className = 'slide-link-badge';
                badge.textContent = '🔗 Ver enlace';
                badge.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const w = 900, h = 600;
                    const left = Math.round((screen.width - w) / 2);
                    const top = Math.round((screen.height - h) / 2);
                    window.open(item.link, '_blank', \`noopener,noreferrer,width=\${w},height=\${h},left=\${left},top=\${top}\`);
                });
                slide.appendChild(badge);
            }

            slideContainer.appendChild(slide);
        });

        slides = document.querySelectorAll('.slide');

        updateIndicators();
        updateButtonState();
    }

    function showSlide(index) {
        slides[currentSlide].style.animation = '';
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;

        updateIndicators();
        applyRandomTransition();
        updateButtonState();
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }

    function updateIndicators() {
        indicators.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (index === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => showSlide(index));
            indicators.appendChild(dot);
        });
    }

    function updateButtonState() {
        prevBtn.disabled = (currentSlide === 0);
        nextBtn.disabled = (currentSlide === slides.length - 1);
    }

    function applyRandomTransition() {
        const t = transitions[Math.floor(Math.random() * transitions.length)];
        const el = slides[currentSlide];
        el.style.animation = 'none';
        el.offsetHeight; // forzar reflow
        el.style.animation = \`\${t.name} \${t.duration} \${t.easing} forwards\`;
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Add transition animations
    const style = document.createElement('style');
    style.textContent = \`
        @keyframes fade        { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideLeft   { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideRight  { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideUp     { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown   { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes rotate      { from { transform: rotate(180deg) scale(0); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }
        @keyframes scale       { from { transform: scale(0.2); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes flipX       { from { transform: perspective(600px) rotateX(90deg); opacity: 0; } to { transform: perspective(600px) rotateX(0deg); opacity: 1; } }
        @keyframes flipY       { from { transform: perspective(600px) rotateY(90deg); opacity: 0; } to { transform: perspective(600px) rotateY(0deg); opacity: 1; } }
        @keyframes zoomBlur    { from { transform: scale(1.4); filter: blur(18px); opacity: 0; } to { transform: scale(1); filter: blur(0); opacity: 1; } }
        @keyframes swingIn     { from { transform: perspective(600px) rotateY(-70deg) translateX(-60px); opacity: 0; } to { transform: perspective(600px) rotateY(0deg) translateX(0); opacity: 1; } }
        @keyframes bounceIn    { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes glitch      {
            0%   { transform: translate(-4px, 0) skewX(-3deg); opacity: 0.6; }
            25%  { transform: translate(4px, -2px) skewX(3deg); opacity: 0.8; }
            50%  { transform: translate(-2px, 2px) skewX(-1deg); opacity: 0.9; }
            75%  { transform: translate(2px, 0) skewX(1deg); opacity: 1; }
            100% { transform: translate(0, 0) skewX(0); opacity: 1; }
        }
        @keyframes spiralIn    { from { transform: rotate(360deg) scale(0); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }
        @keyframes dropIn      { from { transform: translateY(-80px) scale(0.8); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes unfold      {
            0%   { transform: scaleY(0) translateY(-50%); opacity: 0; }
            60%  { transform: scaleY(1.05) translateY(0); opacity: 1; }
            100% { transform: scaleY(1) translateY(0); opacity: 1; }
        }
        @keyframes skewIn      { from { transform: skew(-20deg, -8deg) scale(0.9); opacity: 0; } to { transform: skew(0,0) scale(1); opacity: 1; } }
        @keyframes slideTopLeft { from { transform: translate(-50%, -50%); opacity: 0; } to { transform: translate(0,0); opacity: 1; } }
        @keyframes slideBottomRight { from { transform: translate(50%, 50%); opacity: 0; } to { transform: translate(0,0); opacity: 1; } }
        @keyframes flipDiagonal { from { transform: rotate3d(1,1,0,120deg) scale(0.6); opacity: 0; } to { transform: rotate3d(0,0,0,0deg) scale(1); opacity: 1; } }
        @keyframes rotateScale  { from { transform: rotate(180deg) scale(0); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }
        @keyframes blurIn       { from { filter: blur(30px); opacity: 0; transform: scale(1.05); } to { filter: blur(0); opacity: 1; transform: scale(1); } }
        @keyframes lightSpeed   { from { transform: translateX(100%) skewX(-30deg); opacity: 0; } to { transform: translateX(0) skewX(0); opacity: 1; } }
        @keyframes jackInTheBox { 0% {opacity:0;transform:scale(.1) rotate(30deg);transform-origin:center bottom;} 50%{transform:rotate(-10deg);} 70%{transform:rotate(3deg);} 100%{opacity:1;transform:scale(1) rotate(0);} }
        @keyframes perspectiveFlip { from { transform: perspective(800px) rotateY(90deg); opacity: 0; } to { transform: perspective(800px) rotateY(0deg); opacity: 1; } }
    \`;
    document.head.appendChild(style);

    // ----------- MEDIOS INYECTADOS -----------
    const mediaItems = [
        // PLACEHOLDER_FOR_MEDIA
    ];

    // Ajuste de tamaño responsivo: calcula ancho desde la altura del viewport
    function resizePresentation() {
        const pres = document.querySelector('.presentation');
        if (!pres) return;
        const style = getComputedStyle(pres);
        const aspectWVal = style.getPropertyValue('--aspect-w');
        const aspectHVal = style.getPropertyValue('--aspect-h');
        const aspectW = (aspectWVal !== "" && !isNaN(parseFloat(aspectWVal))) ? parseFloat(aspectWVal) : 16;
        const aspectH = (aspectHVal !== "" && !isNaN(parseFloat(aspectHVal))) ? parseFloat(aspectHVal) : 9;
        const ratio = aspectW / aspectH;
        const maxWRaw = style.getPropertyValue('--preset-maxw') || '';
        const maxW = maxWRaw ? parseInt(maxWRaw) : 1280;

        // Si es modo responsive (proporción 0), no intervenimos con JS
        if (aspectW === 0 || isNaN(ratio)) {
            return;
        }

        // Cálculo de espacio reservado (márgenes y otros elementos fuera del presentador)
        let reservedH = 40; // Base: margen superior (20px) + margen inferior (20px)
        const possibleSelectors = ['.controls', '.top-controls', '#topControls', '.page-controls', '.page-footer', 'body > footer', '#pageFooter', '.controls-wrapper'];
        possibleSelectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el && !pres.contains(el) && el.offsetParent !== null) {
                reservedH += el.offsetHeight || 0;
            }
        });

        const availH = Math.max(200, window.innerHeight - reservedH);
        const availW = Math.max(200, document.documentElement.clientWidth - 40); // 20px de margen a cada lado

        let targetW, targetH;

        // Determinar si limitar por ancho o por alto basándose en la relación de aspecto
        if (availW / availH > ratio) {
            // El viewport es más ancho que la proporción -> limitar por altura
            targetH = availH;
            targetW = targetH * ratio;
        } else {
            // El viewport es más alto que la proporción -> limitar por ancho
            targetW = availW;
            targetH = targetW / ratio;
        }

        // No exceder el ancho máximo definido para el preset
        if (targetW > maxW) {
            targetW = maxW;
            targetH = targetW / ratio;
        }

        // Aplicar dimensiones
        pres.style.width = Math.round(targetW) + 'px';
        pres.style.height = Math.round(targetH) + 'px';
        pres.style.maxWidth = 'none'; 
        pres.style.minWidth = 'none';
        pres.style.margin = '0'; // Flexbox en body maneja el centrado
        pres.style.overflow = 'hidden';

        // Asegurar que las diapositivas ocupen todo el contenedor calculado
        const slds = pres.querySelectorAll('.slide');
        slds.forEach(s => { 
            s.style.height = pres.clientHeight + 'px'; 
            s.style.width = pres.clientWidth + 'px';
            s.style.padding = '20px';
            s.style.paddingBottom = '50px';
        });
    }

    window.addEventListener('resize', resizePresentation);
    window.addEventListener('orientationchange', resizePresentation);
    window.addEventListener('load', resizePresentation);
    document.addEventListener('DOMContentLoaded', resizePresentation);

    initSlides();
    // run after slides created and after media load
    // Asegurar redimensionamiento después de que se carguen las imágenes/videos
    setTimeout(()=>{
        const pres = document.querySelector('.presentation');
        if (!pres) return;
        const imgs = Array.from(pres.querySelectorAll('img'));
        
        imgs.forEach(img => {
            if (!img.complete) img.addEventListener('load', () => resizePresentation());
        });
        pres.querySelectorAll('video').forEach(v => {
            v.addEventListener('loadedmetadata', () => resizePresentation());
        });
        
        resizePresentation();
    }, 100);
<\/script>
</body>
</html>
`;

// Simplified file-selection handler for the PDF converter UI
function onFilesSelected() {
    const files = document.getElementById("imageFiles").files;
    const btn = document.querySelector("button");
    if (btn) btn.disabled = (files.length === 0);
}

async function fileToBase64(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function procesar(){

    const imagesInput = document.getElementById("imageFiles").files;

    if(imagesInput.length === 0){
        alert("Debes seleccionar al menos una imagen o video.");
        return;
    }

    // Ordenar archivos por nombre (numérico si es posible)
    const files = Array.from(imagesInput).sort((a,b)=>{
        return a.name.localeCompare(b.name, undefined, {numeric:true});
    });

    const btn = document.querySelector("button");
    const originalText = btn.innerText;
    btn.innerText = "Procesando...";
    btn.disabled = true;

    try {

        const mediaItems = [];

        for(const file of files){
            if (file.type === 'text/html' || file.name.endsWith('.html')) {
                const base64 = await fileToBase64(file);
                mediaItems.push({ type: 'html', url: base64 });
            } else {
                const base64 = await fileToBase64(file);
                const type = file.type.startsWith('video/') ? 'video' : 'image';
                mediaItems.push({ url: base64, type });
            }
        }

        // Filtrar solo imágenes (el PDF será generado con las imágenes subidas)
        const onlyImages = mediaItems.filter(m => m.type === 'image');
        if (onlyImages.length === 0) {
            alert('No hay imágenes para generar el PDF. Selecciona al menos una imagen.');
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        // Selección de orientación/formato basada en el preset
        const sizeSel = (document.getElementById('sizeSelector') && document.getElementById('sizeSelector').value) ? document.getElementById('sizeSelector').value : 'horizontal';
        let pdfOrientation = 'portrait';
        let pdfFormat = 'a4';
        switch (sizeSel) {
            case 'horizontal-full':
                pdfOrientation = 'landscape';
                pdfFormat = 'a4';
                break;
            case 'horizontal':
                pdfOrientation = 'landscape';
                pdfFormat = 'a4';
                break;
            case 'responsive':
                pdfOrientation = 'portrait';
                pdfFormat = 'a4';
                break;
            case 'ppt-4-3':
                pdfOrientation = 'landscape';
                pdfFormat = 'a4';
                break;
            case 'square-1-1':
                pdfOrientation = 'portrait';
                pdfFormat = [210,210];
                break;
            case 'ig-post-4-5':
            case 'tiktok-9-16':
            case 'vertical':
            case 'a4-portrait':
                pdfOrientation = 'portrait';
                pdfFormat = 'a4';
                break;
            default:
                pdfOrientation = 'portrait';
                pdfFormat = 'a4';
                break;
        }

        // Crear PDF usando jsPDF (cargado desde CDN en index.html)
        const { jsPDF } = window.jspdf || window.jspdf || {};
        if (!jsPDF) {
            alert('No se pudo cargar jsPDF. Asegúrate de tener conexión y recarga la página.');
            btn.innerText = originalText;
            btn.disabled = false;
            return;
        }

        const pdf = new jsPDF({ unit: 'mm', format: pdfFormat, orientation: pdfOrientation });

        // Margen en mm (puede ajustarse según el preset)
        let M = 10;

        // Si el usuario pidió full horizontal, quitar márgenes
        if (sizeSel === 'horizontal-full') {
            M = 0;
        }

        // Helper para añadir una imagen en una página nueva (o primera)
        async function addImageToPdf(dataUrl, isFirst) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = function() {
                    const pageW = pdf.internal.pageSize.getWidth();
                    const pageH = pdf.internal.pageSize.getHeight();

                    const imgW = img.naturalWidth;
                    const imgH = img.naturalHeight;
                    const imgRatio = imgW / imgH;

                    let drawW = pageW - 2 * M;
                    let drawH = drawW / imgRatio;
                    if (drawH > (pageH - 2 * M)) {
                        drawH = pageH - 2 * M;
                        drawW = drawH * imgRatio;
                    }

                    const x = (pageW - drawW) / 2;
                    const y = (pageH - drawH) / 2;

                    const fmt = dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';

                    if (!isFirst) pdf.addPage();
                    pdf.addImage(dataUrl, fmt, x, y, drawW, drawH);
                    resolve();
                };
                img.onerror = function() {
                    // Si falla la carga, añadir una página con un mensaje simple
                    if (!isFirst) pdf.addPage();
                    pdf.setFontSize(14);
                    pdf.text('Imagen no disponible', 20, 30);
                    resolve();
                };
                img.src = dataUrl;
            });
        }

        // Añadir cada imagen al PDF
        for (let i = 0; i < onlyImages.length; i++) {
            const item = onlyImages[i];
            const isFirst = (i === 0);
            await addImageToPdf(item.url, isFirst);
        }

        // Guardar archivo
        pdf.save('presentacion_slides.pdf');
        // PDF generado y descargado arriba

    } catch (err) {
        alert("Hubo un error al procesar los archivos.");
        console.error(err);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}