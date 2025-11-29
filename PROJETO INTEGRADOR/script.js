document.addEventListener('DOMContentLoaded', () => {
    //DADOS INICIAIS

    const DADOS_PADRAO = [
        {
            id: 1715623456789,
            titulo: "Melhores Filmes de Sci-Fi",
            categoria: "Filmes",
            autor: "GabrielCabral",
            itens: ["Interstellar", "Blade Runner 2049", "Matrix"],
            likes: 15
        },
        {
            id: 1715623999999,
            titulo: "Séries para Maratonar",
            categoria: "Séries",
            autor: "TopBinge",
            itens: ["Breaking Bad", "Succession", "The Bear"],
            likes: 99
        }
    ];

    // Carrega do LocalStorage ou usa o padrão
    let listas = JSON.parse(localStorage.getItem('top3_listas')) || DADOS_PADRAO;

 
    //SELETORES
 
    const feedContainer = document.getElementById('feed-container');
    const emptyState = document.getElementById('empty-state');
    const modal = document.getElementById('modal-criar');
    const btnNovaLista = document.getElementById('btn-nova-lista');
    const btnFecharModal = document.getElementById('close-modal');
    const formTop3 = document.getElementById('form-top3');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const toast = document.getElementById('toast');

    // 3. FUNÇÕES

    function salvarDados() {
        localStorage.setItem('top3_listas', JSON.stringify(listas));
    }

    function renderizarFeed(filtro = "todos") {
        feedContainer.innerHTML = "";
        
        const listasFiltradas = filtro === "todos" 
            ? listas 
            : listas.filter(lista => lista.categoria === filtro);

        // Controla o estado vazio
        if (listasFiltradas.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }

        // Cria os cards
        listasFiltradas.forEach(lista => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Renderiza HTML do card
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="card-title">${escaparHTML(lista.titulo)}</div>
                        <span class="card-author">por @${lista.autor}</span>
                    </div>
                    <div>
                        <span class="card-category">${lista.categoria}</span>
                        <button class="btn-delete" aria-label="Excluir lista">&times;</button>
                    </div>
                </div>
                <ul class="top-list">
                    <li class="rank-1"><span class="rank-number">1</span> ${escaparHTML(lista.itens[0])}</li>
                    <li class="rank-2"><span class="rank-number">2</span> ${escaparHTML(lista.itens[1])}</li>
                    <li class="rank-3"><span class="rank-number">3</span> ${escaparHTML(lista.itens[2])}</li>
                </ul>
                <div class="card-actions">
                    <span>❤️ ${lista.likes} Curtidas</span>
                </div>
            `;

            // EVENTOS DO CARD
            
            // Botão Excluir
            const btnDelete = card.querySelector('.btn-delete');
            btnDelete.addEventListener('click', () => deletarLista(lista.id));

            // Botão Curtir
            const btnLike = card.querySelector('.card-actions');
            btnLike.addEventListener('click', () => curtirLista(lista.id));

            feedContainer.appendChild(card);
        });
    }

    // Função auxiliar para segurança (evita injeção de código HTML)
    function escaparHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }

    // 4. LÓGICA DE CRIAÇÃO
    
    if (formTop3) {
        formTop3.addEventListener('submit', (e) => {
            e.preventDefault();

            const titulo = document.getElementById('titulo').value.trim();
            const categoria = document.getElementById('categoria').value;
            const item1 = document.getElementById('item1').value.trim();
            const item2 = document.getElementById('item2').value.trim();
            const item3 = document.getElementById('item3').value.trim();

            if (!titulo || !item1 || !item2 || !item3) {
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const novaLista = {
                id: Date.now(),
                titulo: titulo,
                categoria: categoria,
                autor: "Voce", // Pode ser dinâmico no futuro
                itens: [item1, item2, item3],
                likes: 0
            };

            listas.unshift(novaLista); // Adiciona no topo
            salvarDados();
            renderizarFeed(); // Atualiza a tela
            
            fecharModal();
            formTop3.reset();
            mostrarToast();
        });
    }

    // 5. GERENCIAMENTO DO MODAL E FILTROS

    function abrirModal() {
        modal.classList.remove('hidden');
    }

    function fecharModal() {
        modal.classList.add('hidden');
    }

    function mostrarToast() {
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    function deletarLista(id) {
        if(confirm("Tem certeza que deseja apagar este Top 3?")) {
            listas = listas.filter(l => l.id !== id);
            salvarDados();
            renderizarFeed();
        }
    }

    function curtirLista(id) {
        const lista = listas.find(l => l.id === id);
        if(lista) {
            lista.likes++;
            salvarDados();
            renderizarFeed();
        }
    }

    // Event Listeners
    if(btnNovaLista) btnNovaLista.addEventListener('click', abrirModal);
    if(btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filtro = btn.getAttribute('data-filter');
            renderizarFeed(filtro);
        });
    });

    // Inicialização
    renderizarFeed();
});