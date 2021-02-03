# @vicentecalfo/pastagem-lapig-api-wrapper

Pacote para facilitar a busca de informações na API do [Atlas Digital das Pastagens Brasileiras](https://pastagem.org/atlas/map) do Laboratório de Processamento de Imagens e Geoprocessamento ([LAPIG](https://www.lapig.iesa.ufg.br/lapig/)).

Para saber mais sobre o projeto **Pastagem.org**, [clique aqui](https://pastagem.org/index.php/pt-br/).

## Instalação
`npm install @vicentecalfo/pastagem-lapig-api-wrapper --save`

## Utilização
Para buscar os relatórios disponíveis basta chamar o método `buscarDados` e informar os parâmetros desejados.

Todas as APIs retorna o formato CSV. Para converter em JSON, [utilize este método](#convert-json).

Os dados obtidos podem ser filtrados por município, para isso basta informar o código do IBGE. Para ver todos os códigos, [clique aqui](https://www.ibge.gov.br/explica/codigos-dos-municipios.php).


```javascript
import { PastagemLapigApi } from '@vicentecalfo/pastagem-lapig-api-wrapper';

const pastagemLapigApi = new PastagemLapigApi();

// Busca informações sobre área de pastagem de um determinado município
pastagemLapigApi
	.buscarDados({
		relatorio: 'areaDePastagem',
		codigoMunicipio: 3301702, // código do IBGE (Duque de Caxias/RJ)
		ano: 2015
	}).subscribe(
		(data) => console.log(data.body),
		(error) => console.log(error)
	);
```

## Relatórios disponíveis
### Área de pastagem
`areaDePastagem`

**Parâmetros**
```javascript
{
	relatorio: 'areaDePastagem', // Tipo de relatório (obrigatório)
	codigoMunicipio: 3301702, // código do IBGE (opcional)
	ano: 2015 // Ano do relatório (obrigatório)
}
```
**Utilização**
```javascript
pastagemLapigApi
	.buscarDados({
		relatorio: 'areaDePastagem',
		codigoMunicipio: 3301702,
		ano: 2019
	}).subscribe(
		(data) => console.log(data.body),
		(error) => console.log(error)
	);
```

### Pastagem Degradada (2018)
`pastagemDegradada`

**Observação:** Só está disponível o relatório do ano de 2018.

**Parâmetros**
```javascript
{
	relatorio: 'pastagemDegradada', // Tipo de relatório (obrigatório)
	codigoMunicipio: 3301702, // código do IBGE (opcional)
}
```
**Utilização**
```javascript
pastagemLapigApi
	.buscarDados({
		relatorio: 'pastagemDegradada',
		codigoMunicipio: 3301702,
	}).subscribe(
		(data) => console.log(data.body),
		(error) => console.log(error)
	);
```

### Rebanho Bovino - UA
`rebanhoBovinoUA`

**Parâmetros**
```javascript
{
	relatorio: 'rebanhoBovinoUA', // Tipo de relatório (obrigatório)
	codigoMunicipio: 3301702, // código do IBGE (opcional)
	ano: 2019 // Ano do relatório (obrigatório)
}
```
**Utilização**
```javascript
pastagemLapigApi
	.buscarDados({
		relatorio: 'rebanhoBovinoUA',
        codigoMunicipio: 3301702,
        ano: 2019
	}).subscribe(
		(data) => console.log(data.body),
		(error) => console.log(error)
	);
```

### Potencial de Intensificação da Pecuária
`potencialDeIntensificacaoPecuaria`

**Parâmetros**
```javascript
{
	relatorio: 'potencialDeIntensificacaoPecuaria', // Tipo de relatório (obrigatório)
	codigoMunicipio: 3301702, // código do IBGE (opcional)
}
```
**Utilização**
```javascript
pastagemLapigApi
	.buscarDados({
		relatorio: 'potencialDeIntensificacaoPecuaria',
		codigoMunicipio: 3301702,
	}).subscribe(
		(data) => console.log(data.body),
		(error) => console.log(error)
	);
```
<a id="#convert-json"></a>
### Converter em JSON

`converteParaJson`

**Utilização**
```javascript
pastagemLapigApi
	.buscarDados({
		relatorio: 'potencialDeIntensificacaoPecuaria',
		codigoMunicipio: 3301702,
	}).subscribe(
		(data) => {
            // Com o CSV obtido, basta converter para JSON
            pastagemLapigApi
				.converteParaJson(data.body)
				.toPromise()
                .then((convertedData) => 
                    convertedData // Objeto JSON
                    console.log(convertedData)
                );
        },
		(error) => console.log(error)
	);
```
**Saída em CSV**
```
"cd_geouf","cd_geocmu","uf","estado","municipio","potencial_intensificacao"
"33","3301702","RJ","RIO DE JANEIRO","DUQUE DE CAXIAS","0.26235000000000000000"
```
**Saída convertida em JSON**
```javascript
[
  {
    cd_geouf: 33,
    cd_geocmu: 3301702,
    uf: 'RJ',
    estado: 'RIO DE JANEIRO',
    municipio: 'DUQUE DE CAXIAS',
    potencial_intensificacao: 0.26235
  }
]
```

## Considerações gerais
* Esta **não** é uma ferramenta oficial do projeto [**Pastagem.org**](https://pastagem.org/index.php/pt-br/apresentacao).
* Os dados obtidos usando o pacote `pastagem-lapig-api-wrapper` acessam os recusos de API do [Atlas Digital das Pastagens Brasileiras](https://pastagem.org/atlas/map).