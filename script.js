document.addEventListener('DOMContentLoaded', () => {
    // --- INICIALIZAÇÃO E SELETORES ---
    const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
    const sections = document.querySelectorAll('.main-content > section');
    const copyButtons = document.querySelectorAll('.copy-button');

    // Seletores do Playground
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('css-editor');
    const jsEditor = document.getElementById('javascript-editor');
    const previewFrame = document.getElementById('preview-frame');

    // --- NAVEGAÇÃO DA SIDEBAR ---
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Atualiza a classe 'active'
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Mostra a seção correta
            sections.forEach(section => {
                const sectionId = section.id.replace('-section', '');
                section.style.display = sectionId === targetId ? 'block' : 'none';
            });
        });
    });

    // --- LÓGICA DO PLAYGROUND ---
    function updatePreview() {
        const htmlCode = htmlEditor.value;
        const cssCode = cssEditor.value;
        const jsCode = jsEditor.value;

        const documentContent = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
                <script>${jsCode}<\/script>
            </body>
            </html>
        `;
        
        const doc = previewFrame.contentWindow.document;
        doc.open();
        doc.write(documentContent);
        doc.close();
    }
    
    // Define o conteúdo inicial do playground
    function setInitialPlaygroundContent() {
        htmlEditor.value = `<h1>Olá, Playground!</h1>
<p>Edite o código para ver as mudanças.</p>
<button onclick="mudarCor()">Mudar cor do Título</button>`;
        
        cssEditor.value = `body {
    font-family: sans-serif;
    padding: 15px;
}
h1 {
    color: #3498db;
}`

        jsEditor.value = `function mudarCor() {
    const h1 = document.querySelector('h1');
    const cores = ['#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6'];
    const corAtual = h1.style.color;
    let novaCor = cores[Math.floor(Math.random() * cores.length)];
    
    // Garante que a nova cor seja diferente da atual
    while (novaCor === corAtual) {
        novaCor = cores[Math.floor(Math.random() * cores.length)];
    }
    
    h1.style.color = novaCor;
}`;
        updatePreview();
    }

    // Adiciona event listeners para atualização em tempo real
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.addEventListener('keyup', updatePreview);
    });

    // --- FUNCIONALIDADE DE COPIAR CÓDIGO ---
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pre = button.previousElementSibling;
            const code = pre.querySelector('code').innerText;

            navigator.clipboard.writeText(code).then(() => {
                // Feedback visual para o usuário
                const notification = document.createElement('div');
                notification.innerText = '✅ Código copiado!';
                notification.style.position = 'fixed';
                notification.style.bottom = '20px';
                notification.style.right = '20px';
                notification.style.backgroundColor = '#2ecc71';
                notification.style.color = '#fff';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '8px';
                notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                notification.style.zIndex = '9999';
                document.body.appendChild(notification);

                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 2000);
            }).catch(err => {
                console.error('Falha ao copiar texto: ', err);
            });
        });
    });
    
    // --- ESTADO INICIAL ---
    // Inicializa o conteúdo do playground
    setInitialPlaygroundContent();
    // Ativa o realce de sintaxe
    hljs.highlightAll();
});
