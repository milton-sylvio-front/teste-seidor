Precisamos desenvolver um sistema web que permita-nos gerenciar nossos funcionários e o cálculo de Imposto de Renda Retido na Fonte (IRRF) de cada um deles. Para isso construiremos uma aplicação com as seguintes funcionalidades:

· Cadastrar um novo Funcionário a partir dos campos manuais:
. Nome
. CPF
· Salário Bruto
· Desconto da previdência
· Número de dependentes
. Atualizar um Funcionário cadastrado
. Excluir um Funcionário cadastrado
. Listar os Funcionário cadastrados com os campos:
. Nome
. CPF
· Salário
. Desconto
. Dependentes
. Desconto IRPF
. Filtrar a lista de Funcionários cadastrados por Nome e CPF

A cada novo funcionário cadastrado, com base nas informações inseridas, o sistema deve calcular o valor de salário base para calculo do IR, o desconto do IRRF e apresentar essas informações na listagem dos funcionários cadastrados.

Salário Base IR = Salario bruto - Desconto da Previdência - Dedução por Dependente x Quantidade de Dependentes

Desconto IRRF = Salário Base IR x Alíquota - Parcela a Deduzir

A tabela progressiva do IRRF que deve ser utilizada:
Base de cálculo

Alíquota Parcela a deduzir do IRPF
Até 2.259,20 				Isento		R$ 0,00	
De R$ 2.259,21 até R$ 2.826,65 		7,5%		R$ 169,44
De R$ 2.826,66 até R$ 3.751,05 		15% 		R$ 381,44
De R$ 3.751,06 até R$ 4.664,68 		22,5% 		R$ 662,77
Acima de R$ 4.664,68 			27,5% 		R$ 896,00

Dedução por dependente: R$ 189,59

Para testes, também foi disponibilizado um arquivo JSON com alguns exemplos de funcionários.

Teste Técnico Prático

O que você deve entregar?
· O código fonte da sua aplicação, as instruções de como executar e testar a sua aplicação. Deve ser entregue um link para um repositório git público (ex: Github,
Bitbucket, Gitlab, etc).

O que será avaliado?
. Funcionalidades: sua aplicação cobre as funcionalidades que foram solicitadas?
. Estrutura do código: Se o código foi bem escrito, se esta organizado, se e fácil de ler (nomes de variáveis, funções, etc).

Observações:
· É necessário que o teste seja desenvolvido utilizando o framework React.js.
· É necessário utilizar o Redux ou Context para persistir os dados de funcionários
. Teste desenvolvido utilizando TypeScript e/ou RTL será um diferencial

É importante que o projeto esteja funcional, mas não avaliaremos somente esse ponto no teste prático então mesmo que não consiga terminar a solução, envie-nos seu trabalho.





