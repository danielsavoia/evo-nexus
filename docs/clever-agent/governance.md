# Clever Agent — Estratégia de separação, branches e governança

## Visão geral

O Clever Agent é o white-label Clever baseado no Evo Nexus, mantido como produto separado do Clever AI.

O objetivo é transformar o Evo Nexus em uma plataforma Clever para orquestração de agentes de IA, mantendo rastreabilidade com o upstream da Evolution Foundation e separação operacional em relação ao Clever AI.

## Upstream

Repositório upstream:

https://github.com/evolution-foundation/evo-nexus

## Repositório Clever

Fork técnico:

https://github.com/danielsavoia/evo-nexus

Produto/branding:

Clever Agent

## Separação em relação ao Clever AI

O Clever Agent não deve ser incorporado ao agregador Clever AI e não deve ser submódulo de `evo-crm-community`.

Motivos:

1. O Clever AI é o produto de CRM, atendimento, canais, IA aplicada ao atendimento, pipelines e automações.
2. O Clever Agent é um produto separado para orquestração de agentes de IA.
3. O Agent/Nexus cria contexto, memória, histórico, ferramentas, agentes, instruções e comportamento específicos de cada empresa.
4. Uma instância global compartilhada poderia misturar contexto, memória, agentes e dados entre clientes.
5. Cada cliente que contratar Clever Agent deve ter instalação dedicada e isolada.

## Estratégia futura de instalação

O Clever Agent será opcional por cliente.

Cenários futuros:

- Cliente contrata apenas Clever AI.
- Cliente contrata Clever AI + Clever Agent.
- Cliente contrata Clever Agent em instalação própria dedicada.

Quando instalado junto com Clever AI, o Clever Agent poderá rodar no mesmo servidor do cliente, mas com stack, domínio/subdomínio, banco, volumes e configuração próprios.

Exemplos futuros:

- CRM: `cliente1.cleverai.com.br`
- Agent: `agent-cliente1.cleverai.com.br`

Ou em domínio próprio:

- CRM: `crm.cliente.com.br`
- Agent: `agent.cliente.com.br`

## Branches

A estratégia de branches segue o padrão operacional da Clever AI:

- `upstream-sync`: espelho limpo do upstream Evolution Foundation.
- `clever-dev`: desenvolvimento Clever e white-label.
- `clever-beta`: homologação futura.
- `clever-prod`: produção futura.

## Regras de governança

1. Não alterar `upstream-sync` com patches Clever.
2. White-label e customizações devem entrar primeiro em `clever-dev`.
3. Não promover para `clever-beta` sem validação.
4. Não promover para `clever-prod` sem homologação.
5. Não usar force push.
6. Não commitar secrets, tokens, `.env` reais ou credenciais.
7. Não usar `latest` como estratégia final de imagem em fases futuras.
8. Não fazer deploy direto a partir da VPS.
9. Fluxo correto futuro: PC local → commit/push GitHub → ambiente consome repositório/imagem versionada.

## Integração futura com Perfex

A integração com Perfex para bloqueio/desbloqueio do Clever Agent por inadimplência será tratada em fase posterior.

Nesta fase inicial, não há integração Perfex, deploy, imagem GHCR ou provisionamento de cliente.
