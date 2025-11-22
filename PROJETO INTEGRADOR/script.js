// Espera o site carregar 100% antes de rodar o código
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DADOS INICIAIS (LOCAL STORAGE)
    // ==========================================
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
            titulo: "Álbuns para programar",
            categoria: "Músicas",
            autor: "DevJunior",
            itens: ["Daft Punk - TRON", "Pink Floyd - Dark Side", "Lo-fi Hip Hop Radio"],
            likes: 42
        }
    ];

    // Carrega o que está salvo ou usa o padrão
    let listas = JSON.parse(localStorage.getItem('top3_listas')) || DADOS_PADRAO;

    // ==========================================
    // 2. REFERÊNCIAS DO HTML
    // ==========================================
    const feedContainer = document.getElementById('feed-container');
    const emptyState = document.getElementById('empty-state');
    const modal = document.getElementById('modal-criar');
    const btnNovaLista = document.getElementById('btn-nova-lista');
    const btnFecharModal = document.getElementById('close-modal');
    const formTop3 = document.getElementById('form-top3');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const toast = document.getElementById('toast');

    // ==========================================
    // 3. FUNÇÕES PRINCIPAIS
    // ==========================================

    function salvarDados() {
        localStorage.setItem('top3_listas', JSON.stringify(listas));
    }

    function renderizarFeed(filtro = "todos") {
        feedContainer.innerHTML = "";
        
        const listasFiltradas = filtro === "todos" 
            ? listas 
            : listas.filter(lista => lista.categoria === filtro);

        if (listasFiltradas.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }

        listasFiltradas.forEach(lista => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="card-title">${lista.titulo}</div>
                        <span class="card-author">por @${lista.autor}</span>
                    </div>
                    <div style="display:flex; align-items:center;">
                        <span class="card-category">${lista.categoria}</span>
                        <button class="btn-delete" data-id="${lista.id}" title="Excluir">&times;</button>
                    </div>
                </div>
                <ul class="top-list">
                    <li><span class="rank-number">1</span> ${lista.itens[0]}</li>
                    <li><span class="rank-number">2</span> ${lista.itens[1]}</li>
                    <li><span class="rank-number">3</span> ${lista.itens[2]}</li>
                </ul>
                <div class="card-actions" data-id="${lista.id}">
                    <span>❤️ ${lista.likes} Curtidas</span>
                </div>
            `;
            feedContainer.appendChild(card);
        });

        // Re-adicionar eventos aos botões dinâmicos (Excluir e Curtir)
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.target.getAttribute('data-id'));
                deletarLista(id);
            });
        });

        document.querySelectorAll('.card-actions').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Pega o ID do elemento pai caso clique no texto
                const id = Number(e.currentTarget.getAttribute('data-id'));
                curtirLista(id);
            });
        });
    }

    // ==========================================
    // 4. LÓGICA DE CRIAÇÃO (O CORAÇÃO DO PROBLEMA)
    // ==========================================
    
    if (formTop3) {
        formTop3.addEventListener('submit', (e) => {
            e.preventDefault(); // IMPEDE O RECARREGAMENTO DA PÁGINA
            console.log("Botão Publicar clicado!");

            // Captura os valores
            const titulo = document.getElementById('titulo').value;
            const categoria = document.getElementById('categoria').value;
            const item1 = document.getElementById('item1').value;
            const item2 = document.getElementById('item2').value;
            const item3 = document.getElementById('item3').value;

            // Cria o objeto
            const novaLista = {
                id: Date.now(),
                titulo: titulo,
                categoria: categoria,
                autor: "UsuarioAtual",
                itens: [item1, item2, item3],
                likes: 0
            };

            // Salva e Atualiza
            listas.unshift(novaLista);
            salvarDados();
            renderizarFeed();
            
            // Fecha e Limpa
            modal.style.display = "none";
            formTop3.reset();
            
            // Feedback
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
        });
    } else {
        console.error("ERRO CRÍTICO: Formulário 'form-top3' não encontrado no HTML.");
    }

    // ==========================================
    // 5. OUTRAS FUNÇÕES
    // ==========================================

    function deletarLista(id) {
        if(confirm("Deseja apagar esta lista?")) {
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

    // Abrir Modal
    if(btnNovaLista) {
        btnNovaLista.addEventListener('click', () => {
            modal.style.display = "flex";
        });
    }

    // Fechar Modal
    if(btnFecharModal) {
        btnFecharModal.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    // Clicar fora do modal fecha ele
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });

    // Filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderizarFeed(btn.getAttribute('data-filter'));
        });
    });

    // Inicia tudo
    renderizarFeed();
});