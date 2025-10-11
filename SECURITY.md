🛡️ Política de Segurança — Lista de Presença Élida
🔢 Versões Suportadas

A tabela abaixo mostra quais versões do projeto Lista de Presença Élida recebem atualizações de segurança ativamente.
Versões que não estão mais na lista de suporte não recebem correções nem patches relacionados à segurança.

Versão	Status de Suporte
5.1.x	✅ Suportada
5.0.x	❌ Não suportada
4.0.x	✅ Suportada
< 4.0	❌ Não suportada
🚨 Relato de Vulnerabilidades

Se você identificar uma vulnerabilidade ou comportamento suspeito no projeto Lista de Presença Élida, siga as instruções abaixo:

Não abra uma issue pública.
Para manter a segurança dos usuários, evite divulgar a vulnerabilidade em locais acessíveis ao público.

Envie um e-mail privado para o mantenedor:
👉 diemersoninformatica@gmail.com

Inclua no e-mail:

Uma descrição clara e detalhada da vulnerabilidade;

Etapas para reproduzir o problema;

Versão afetada e ambiente (navegador, sistema operacional, etc.);

Sugestão de correção ou solução, se possível.

Tempo de resposta esperado:
Você receberá uma resposta inicial em até 5 dias úteis.
Atualizações sobre o status do relato serão enviadas conforme o andamento da investigação.

Após o relato:

A vulnerabilidade será analisada cuidadosamente.

Caso confirmada, uma correção será desenvolvida e publicada o mais rápido possível.

O colaborador que reportar a falha poderá, se desejar, ser mencionado nas notas da versão que contém a correção.

🔐 Boas Práticas de Segurança

Para garantir a segurança dos dados e usuários do projeto Lista de Presença Élida, siga as recomendações abaixo durante o desenvolvimento e implantação:

🔸 1. Proteção de Credenciais

Nunca exponha chaves de API, tokens do Firebase ou credenciais sensíveis em arquivos públicos (HTML, JS ou repositórios Git).

Utilize variáveis de ambiente (.env) e mantenha esse arquivo fora do versionamento.

Configure permissões restritas no console do Firebase para limitar o acesso de leitura e gravação apenas ao necessário.

🔸 2. Regras de Segurança do Firebase

Mantenha as regras de segurança do Firestore atualizadas e validadas.

Use verificações baseadas em autenticação (auth.uid) para evitar acesso indevido.

Teste as regras periodicamente com dados simulados antes de aplicar em produção.

🔸 3. Atualizações e Dependências

Mantenha todas as dependências do projeto (bibliotecas, frameworks e SDKs) sempre atualizadas.

Evite pacotes não oficiais ou fontes desconhecidas.

Execute verificações de vulnerabilidade com ferramentas como npm audit ou GitHub Dependabot.

🔸 4. Controle de Acesso

Limite privilégios de usuários conforme o papel no sistema (ex: administrador, líder, membro).

Nunca exiba informações confidenciais no front-end ou no console do navegador.

🔸 5. Armazenamento de Dados

Evite armazenar dados pessoais sensíveis (como CPF, endereço ou contatos) sem necessidade.

Utilize criptografia para dados críticos e anonimização quando possível.

🔸 6. Backups e Monitoramento

Mantenha backups automáticos e periódicos do banco de dados.

Monitore logs de erro e eventos suspeitos para agir rapidamente em caso de incidentes.

🤝 Compromisso com a Segurança

A equipe do Lista de Presença Élida está comprometida em manter este projeto seguro e confiável.
A colaboração da comunidade é essencial — cada relatório de vulnerabilidade ajuda a proteger todos os usuários e fortalecer o projeto.
