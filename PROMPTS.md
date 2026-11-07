# Registro de Arquitetura e Decisões de Prompts

## Contexto e Desafio Encontrado

Durante a fase inicial do laboratório, a estratégia puramente autônoma baseada em navegação e leitura direta do DOM via ferramentas MCP enfrentou limitações severas:
- **Consumo Excessivo de Tokens:** A renderização e leitura contínua de páginas web e árvores completas do DOM pelo LLM esgotaram o limite de contexto de forma rápida e dispendiosa.
- **Instabilidade de Navegação:** Depender do agente inteligente para realizar ações interativas microscópicas (cliques, paginação repetitiva e parsing de seletores CSS dinâmicos) aumentou a latência e a propensão a falhas operacionais.

## Arquitetura Adotada: Sistema Misto (Pipeline Híbrido)

A arquitetura escolhida para solucionar o laboratório com robustez e eficiência foi o **Sistema Misto**:

1. **Agente de Código (Extração Heurística e Data Reduction):**
   - Utilização de script automatizado (`scraper-bruto.js`) executando com Puppeteer.
   - O script cuida do acesso aos sites, paginação controlada (limite estipulado) e extração focada dos seletores HTML relevantes.
   - Gera um artefato intermediário enxuto contendo apenas texto relevante (`dados-brutos.md`), eliminando ruídos de scripts, estilos e marcação desnecessária do DOM.

2. **Agente Analítico / IA (Síntese, Transformação e Tradução):**
   - Recebe apenas os dados pré-filtrados e estruturados.
   - Executa a análise comparativa, o cálculo de médias e extremos de preços, a tradução das sinopses para português e a formatação executiva final em Markdown (`resultado-busca.md`).

## Conclusão e Benefícios
- **Economia Drástica de Tokens:** Redução de milhares de tokens de marcação HTML desnecessária.
- **Determinismo e Velocidade:** Processamento de extração rápido e sem alucinações de dados.
- **Foco Cognitivo:** A IA é utilizada estritamente para tarefas analíticas e de síntese de linguagem natural, aproveitando o melhor de cada paradigma computacional.

## Tentativa Final com MCP e Validação da Arquitetura

A tentativa final de usar o MCP falhou porque as APIs do Groq e do Gemini estouraram os limites gratuitos de tokens e de requisições diárias. Isso prova definitivamente que a **Arquitetura Híbrida** — na qual o Copilot cria código de raspagem nativa em vez de ler o DOM pela IA — é a única solução viável e escalável em planos gratuitos.
