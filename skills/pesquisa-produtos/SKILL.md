# Skill: Pesquisa de Produtos

## Objetivo
Pesquisar produtos em plataformas de e-commerce e catálogo web, consolidando as informações em um relatório estruturado e resumido em Markdown.

## Entradas
- **Site (URL alvo):** Endereço da loja virtual ou catálogo a ser pesquisado.
- **Termos de busca:** Palavras-chave ou categoria de interesse para filtragem.
- **Limite de páginas:** Quantidade máxima de páginas a serem navegadas (padrão máximo: 5 páginas).

## Passo a Passo Operacional
1. **Identificar Categoria/Busca:** Navegar para o endereço especificado ou subcategoria correspondente aos termos de busca.
2. **Aplicar Limite de Paginação:** Percorrer até no máximo 5 páginas para manter a busca controlada e veloz.
3. **Extração Estrita de Dados:** Coletar exclusivamente os dados presentes no DOM (título, preço, disponibilidade, avaliação e descrição) sem inventar, inferir ou alucinar informações ausentes.
4. **Estruturação do Relatório:** Gerar o resumo analítico final em formato Markdown com tabela comparativa, métricas quantitativas (médias e extremos de preços) e resumos traduzidos.

## Arquitetura: Pipeline Híbrido e Data Reduction

### O Problema do Alto Consumo de Tokens
Enviar páginas web completas ou nós extensos do DOM diretamente ao contexto de Large Language Models (LLMs) via ferramentas MCP (Model Context Protocol) gera sobrecarga crítica:
- Estouro rápido da janela de contexto.
- Latência elevada no processamento das respostas.
- Custos operacionais desnecessários para leitura de tags HTML e scripts sem valor semântico direto.

### A Abordagem de Redução de Dados (Data Reduction)
Para contornar esse gargalo, esta skill fundamenta-se no conceito de **Pipeline Híbrido**:
1. **Extração Heurística Prévia (Agente de Código):** Scripts leves (como Node.js/Puppeteer ou BeautifulSoup) realizam o parsing inicial, extraindo estritamente os campos textuais de interesse (título, preço numérico, status de estoque, texto de resenha).
2. **Transferência de Dados Estruturados/Brutos Sintéticos:** Apenas os dados filtrados (`dados-brutos.md` ou JSON compacto) são repassados ao agente inteligente.
3. **Análise e Síntese de IA (Agente Analítico):** O modelo LLM atua onde gera maior valor: tradução contextual, cálculos analíticos, sumarização de descrições e apresentação executiva dos dados.

Dessa forma, atinge-se máxima eficiência de tokens, garantindo acurácia, confiabilidade e alta performance.
