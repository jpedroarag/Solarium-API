# Solarium-API
Este repositório contém a implementação de uma API para ser usada pelo projeto [Solarium](https://github.com/jpedroarag/Solarium-Interface).



# Autenticação

## Cadastro e Login
### /auth/signup (POST)
Deve receber três valores: nome, email e senha.
```javascript
{
    "name": "Someone",
    "email": "someone@email.com",
    "password": "1234"
}
```

### /auth/signin (POST)
Deve receber dois valores: email e senha.
```javascript
{
    "email": "someone@email.com",
    "password": "1234"
}
```
<br/>

Tanto o cadastro como o login, ao serem bem sucedidos, retornam nome e token de acesso, que deve ser usado para acessar as [Aulas](#Aulas).
```javascript
{
    "name": "Someone",
    "accessToken": "..."
}
```

## Redefinir senha
### /auth/sendPasswordResetLink (POST)
Envia um email com um link para redefinir a senha. Deve receber o email cadastrado e retorna o link da tela para redefinir senha. 
```javascript
{
    "email": "someone@email.com"
}
```

O link tem como parâmetros um token (usado para validar a operação de redefinir) e um id (que é o id do usuário), para serem usados no endpoint de redefinição de fato, que é o seguinte. O token tem prazo de validade de uma hora.
```javascript
{
    "resetLink": "http://.../passwordReset?token=...&id=..."
}
```

### /auth/resetPassword (POST)
Redefine a senha de um usuário, dada um token de redefição gerado anteriormente. Deve receber o token, id do usuário e a nova senha.
```javascript
{
    "token": "...",
    "id": "...",
    "password": "4321"
}
```


# Aulas
Todos os seguites endpoints usam o modelo Lesson, equivalente a uma aula.
```javascript
// Modelo de Lesson
{
    name: String
    htmlString: String
    createdBy: ObjectId
    createdAt: Date
}
```

Para os seguintes endpoints se faz necessário informar o token de acesso na key "x-access-token" do header da requisição, tanto para autorizar como para filtrar as aulas do banco por usuário.

### /lessons/fetch (GET)
Retorna todas as aulas criadas pelo usuário logado.

### /lessons/create (POST)
Cria uma nova aula, sendo necessário receber o nome e o html da aula. O parâmetro nome deve ser único, ou seja, caso haja outra aula com o mesmo valor, retornará erro.
```javascript
{
    "name": "Nova aula",
    "htmlString": "<p>Nova aula!</p>"
}
```

### /lessons/update (POST)
Edita uma aula. Deve receber o nome e as atualizações a serem feitas nela, seguindo o modelo abaixo.
```javascript
{
    "name": "Nova aula",
    "update": { "htmlString": "<h1>Agora, aula velha...</h1>" }
}
```

### /lessons/delete (POST)
Remove uma aula. Deve receber o nome da aula.
```javascript
{
    "name": "Nova aula"
}
```
