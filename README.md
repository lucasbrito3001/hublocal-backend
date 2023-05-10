# **Controle de instalações de empresas - HubLocal**

A ideia inicial do projeto é oferecer para o usuário a possibilidade de controlar, de forma simples, os locais onde suas empresas estão, e, posteriormente, usá-los para inserir suas marcas nos principais mapas e listas da internet. Neste reposítório você encontra a API utilizada pela aplicação, que registra os usuários e suas empresas e locais.

## **Lista de linguagens, tecnologias e frameworks utilizados**
- Nest JS
- TypeORM
- Postgres
- bcrypt
- joi
- swagger

## **Instalação e uso do projeto**
O setup pode ser feito de 2 formas, instalando as dependências e levantando a aplicação manualmente ou utilizando o Docker, fica a critério do usuário.

Porém, independente da forma escolhida, será necessário a criação de um arquivo ***.env*** com as variáveis de ambiente e ele deve seguir o template do arquivo ***.env.template*** que se encontra na raíz do projeto. Feito isso podemos iniciar a instalação do projeto.

### **Setup manual**
Primeiro será necessário que você tenha acesso ao postgres na sua máquina para fazer a conexão com o TypeORM, você pode instalar o banco na sua máquina ou levantar um container docker com a imagem dele, o que achar melhor.

Depois, será necessário instalar as dependências do projeto, abra um terminal e vá até o diretório raíz do repositório, onde está o arquivo package.json e rode um dos comandos abaixo

```bash
npm install
yarn
```
E pronto, já ta tudo pronto para levantar o projeto, basta iniciar o servidor em modo desenvolvimento usando um dos comandos abaixo

```bash
npm run start:dev
yarn start:dev
```

### **Setup docker**
Para isso, irei considerar que você já tem o ***Docker*** e o ***docker-compose*** instalado e configurado na sua máquina. Sendo assim, é simples, vá até o diretório raiz do projeto e rode o comando

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```
E pronto, o projeto já vai estar rodando e fazendo o live-reload ao alterar os arquivos.

## **Documentação da API**
Após ter iniciado a aplicação, você pode ver a documentação da API feita com o ***nextjs/swagger*** no link:

`http://localhost:{API_PORT}/api`

Nela você irá encontrar todos os endpoints que existem na API com marcação de quais são protegidos via token, suas possíveis respostas, parâmetros esperados e schemas das entidades.

> <div style="padding: 8px 0">This is a challenge by <a href="https://coodesh.com/" target="_blank">Coodesh</a></div>