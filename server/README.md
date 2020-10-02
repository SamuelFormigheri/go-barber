## REC SENHA

**RF**

- O usuário deve poder recuperar sua senha informando o e-mail;
- O usuário deve receber e-mail com instruções para recuperar a senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar mailtrap para testar envio em desenvolvimento.
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano;

**RN**

- O link enviado deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar a senha;

## ATUALIZAÇÃO DO PERFIL

**RF**

- O usuário deve poder atualizar nome, email, senha;

**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar a senha é necessário informar a nova senha

## PAINEL DO PRESTADOR


**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador por dia deve ser carregado em cache
- As notificações do prestador dever ser armazenadas no MongoDB;
- As notificações do prestador dever ser enviadas em tempo-real usando Socket.io;

**RN**

- A notificação deve ter status lida e não lida;

## AGENDAMENTO DE SERVIÇOS

**RF**

- O usuário deve poder listar os prestadores de serviços cadastrados;
- O usuário deve poder listar os dias de um mês com um horário disponível de um prestador;
- O usuário deve poder listar os horários disponíveis de um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h;
- Os agendamentos devem estar disponível entre 8h as 18hrs;
- O usuário não pode agendar em um horário passado ou ocupado;
- O usuário não pode agendar horário consigo mesmo;