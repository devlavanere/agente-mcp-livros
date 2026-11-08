<p align="center">
  <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85" alt="Ilustração de um agente de inteligência artificial" width="720">
</p>

<h1 align="center">Agente MCP de Pesquisa de Produtos e Livros</h1>

<p align="center">
  Projeto de raspagem automatizada com Puppeteer e análise assistida por IA, com foco em extração objetiva, redução de dados e relatórios em Markdown.
</p>

## Sobre o projeto

Este projeto demonstra uma abordagem híbrida para pesquisar livros e produtos na web. Em vez de enviar páginas inteiras ou grandes trechos do DOM para um modelo de IA, scripts em Node.js usam seletores do HTML para coletar apenas os campos necessários. Os dados reduzidos podem então ser organizados e analisados com assistência de IA.

O repositório contém:

- Um scraper de livros da categoria Fantasy do [Books to Scrape](https://books.toscrape.com/).
- Um teste de navegação que procura livros e pesquisa jeans no [Automation Exercise](https://automationexercise.com/products).
- Relatórios Markdown, uma captura de tela e documentação da skill e das decisões de arquitetura.

## Tecnologias e ferramentas

- **Node.js** — execução dos scripts e gravação dos arquivos de resultado.
- **Puppeteer** — automação do navegador, navegação, interação com a busca e captura de tela.
- **Turndown** — conversão do HTML extraído em Markdown no scraper de livros.
- **Seletores CSS e DOM** — extração direcionada dos títulos, preços e outros campos publicados nos sites.
- **Git e GitHub** — versionamento e publicação do projeto.
- **Assistência de IA/Copilot** — apoio ao desenvolvimento e à documentação; a coleta dos dados é executada por código.

## Como executar

Requer Node.js e npm. Na raiz do projeto:

```bash
npm install
npm run scrape
```

O comando `npm run scrape` executa `scraper-bruto.js` e grava os dados extraídos em `dados-brutos.md`.

Para executar o teste final de navegação, screenshots e pesquisa de produtos:

```bash
node teste-final.js
```

O teste pesquisa **Jeans** no Automation Exercise, grava os três primeiros produtos com seus preços em `resultado-automation.md` e tenta localizar os livros pedidos na categoria Fantasy do Books to Scrape. Como “The Chronicles of Narnia” não foi encontrado nessa categoria durante a execução, o script informa o título ausente e termina com código de erro; não cria um screenshot que não conseguiu capturar. O screenshot de Harry Potter incluído neste repositório é `print-harry.png`.

> Os sites são externos e podem mudar o conteúdo, os seletores ou a disponibilidade. Os resultados existentes representam os dados obtidos na execução registrada; execute os scripts novamente para atualizar os arquivos.

## Arquivos do projeto

| Arquivo | Conteúdo |
|---|---|
| `scraper-bruto.js` | Percorre páginas da categoria Fantasy, filtra livros pelos termos configurados, extrai título, preço, disponibilidade, avaliação e descrição e grava `dados-brutos.md`. |
| `teste-final.js` | Procura os livros solicitados e tenta capturar screenshots; também pesquisa Jeans no Automation Exercise e gera `resultado-automation.md`. |
| `dados-brutos.md` | Dados textuais extraídos pelo scraper de livros. |
| `resultado-busca.md` | Relatório comparativo dos livros, com preços, disponibilidade, avaliações, estatísticas e resumos. |
| `resultado-automation.md` | Tabela com os três primeiros produtos Jeans encontrados e seus preços. |
| `print-harry.png` | Screenshot da página do livro Harry Potter localizado na categoria Fantasy. |
| `PROMPTS.md` | Registro das decisões de arquitetura e do contexto do projeto. |
| `skills/pesquisa-produtos/SKILL.md` | Objetivo, entradas, procedimento de pesquisa e abordagem híbrida da skill. |
| `package.json` e `package-lock.json` | Scripts npm e dependências do projeto. |

## Abordagem híbrida

1. **Extração por código:** Puppeteer navega pelas páginas e coleta campos específicos do DOM.
2. **Redução de dados:** o script grava apenas as informações relevantes em Markdown, evitando transferir páginas inteiras para a IA.
3. **Análise assistida:** os dados estruturados podem ser resumidos, comparados e apresentados em relatórios sem delegar a navegação e a leitura bruta do DOM ao modelo.

O contexto e as decisões dessa abordagem estão documentados em [`PROMPTS.md`](./PROMPTS.md) e [`skills/pesquisa-produtos/SKILL.md`](./skills/pesquisa-produtos/SKILL.md).
