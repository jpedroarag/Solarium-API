# Solarium-API
Este repositório contém a implementação de uma API para ser usada pelo projeto [Solarium](https://github.com/jpedroarag/Solarium-UI).



# Autenticação

## Cadastro e Login
### /auth/signup
Deve receber três valores: nome, email e senha.
```javascript
{
    "name": "Someone",
    "email": "someone@email.com",
    "password": "1234"
}
```

### /auth/signin
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
### /auth/sendPasswordResetLink
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

### /auth/resetPassword
Redefine a senha de um usuário, dada um token de redefição gerado anteriormente. Deve receber o token, id do usuário e a nova senha.
```javascript
{
    "token": "...",
    "id": "...",
    "password": "4321"
}
```


# Aulas
