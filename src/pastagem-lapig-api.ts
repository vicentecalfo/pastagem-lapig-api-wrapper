import { RxHR, RxHttpRequestResponse } from '@akanass/rx-http-request';
import { Observable } from 'rxjs';
import { QueryParameters, QuerySearch } from './pastagem-lapig-api.interface';
const csvToJson = require('csvtojson');

/**
 * @name PastagemLapigApi
 * @class
 * @classdesc Pacote para facilitar a busca de informações na API do Atlas Digital das Pastagens Brasileiras do Laboratório de Processamento de Imagens e Geoprocessamento (LAPIG). Obs.: Classes de degradação: Não Degradada (1),
 * Leve (2), Moderada (3), Severa (4).
 */

export class PastagemLapigApi {
	private basePath = 'https://pastagem.org/atlas/service/map/downloadCSV';
	private reports: { [key: string]: string } = {
		areaDePastagem: 'pasture',
		pastagemDegradada: 'classes_degradacao_pastagem',
		rebanhoBovinoUA: 'lotacao_bovina_regions',
		potencialDeIntensificacaoPecuaria: 'potencial_intensificacao_pecuaria'
	};
	/**
     * @constructor
     * @function
     */
	constructor() {}

	/**
	 * @name buscarDados
	 * @function
	 * @param {QuerySearch} qs - Parâmetros de busca (ano, e/ou município e relatório).
	 * @param reqOptions - Request options (https://github.com/request/request#requestoptions-callback).
	 * @description Busca os dados da API. Todas as APIs retornam um CSV (é preciso converter para JSON posteriormente).
	 */
	buscarDados(qs: QuerySearch, reqOptions = {}): Observable<RxHttpRequestResponse<any>> {
		this.checkRequiredParams(qs);
		const qp = this.buildRequest(qs);
		return RxHR.get(this.basePath, { qs: qp, ...reqOptions });
	}

	/**
	 * @name checkRequiredParams
	 * @function
	 * @param {QuerySearch} qs - Parâmetros de busca (ano, e/ou município e relatório).
	 * @description Testa se os paramêtros obrigatórios foram inseridos.
	 */
	private checkRequiredParams(qs: QuerySearch): void {
		const hasReport = typeof qs.relatorio !== 'undefined';
		if (!hasReport) throw 'O campo relatório é obrigatório.';
	}

	/**
	 * @name buildRequest
	 * @function
	 * @param {QuerySearchPrivate} qs - Parâmetros de busca (ano e/ou município).
	 * @description Monta o endpoint (url) conforme os parâmetros passados, podendo filtrar por município.
	 */
	private buildRequest(qs: QuerySearch): QueryParameters {
		const report = typeof qs.relatorio === undefined ? 'pasture' : qs.relatorio;
		const file = this.reports[report];
		const newQs: any = { file };
		const hasMunicipality = typeof qs.codigoMunicipio !== 'undefined';
		const hasYear = typeof qs.ano !== 'undefined';
		const year = `year=${qs.ano}`;
		const municipality = `cd_geocmu='${qs.codigoMunicipio}'`;
		newQs['filter'] = '';
		switch (file) {
			case 'potencial_intensificacao_pecuaria':
				if (hasMunicipality) {
					newQs['filter'] = municipality;
				}
				return newQs;
			case 'classes_degradacao_pastagem':
				if (hasMunicipality) {
					newQs['filter'] = municipality;
				}
				return newQs;
			default:
				// pasture , lotacao_bovina_regions
				newQs['region'] = year;
				if (hasMunicipality) {
					newQs['region'] = `${year} AND ${municipality}`;
					newQs['filter'] = municipality;
				}
				return newQs;
		}
	}

	/**
	 * @name converteParaJson
	 * @function
	 * @param {string} csv - String csv para ser convertida em objeto JSON.
	 * @description - Os retornos da API são em CSV, por isso essa função é útil, pois converte CSV em objeto JSON.
	 */
	converteParaJson(csv: string): Observable<any> {
		return new Observable((observer) => {
			csvToJson({
				output: 'json'
			})
				.fromString(csv)
				.then((json: Array<{ [key: string]: any }>) => {
					observer.next(this.correctTypes(json));
					observer.complete();
				});
		});
	}

	/**
	 * @name correctTypes
	 * @function
	 * @param {object} json - Objeto JSON para conversão do tipo do valor de cada propriedade.
	 * @description - Depois da conversão do CSV para JSON os valores de todos os atributos estão em formato string, mesmo os campos que deveriam ser números, por isso essa função foi criada, para transformar números em números (type number). 
	 */
	private correctTypes(json: Array<{ [key: string]: any }>): any {
		return json.map((row) => {
			const convertedRow: any = {};
			Object.keys(row).forEach((property) => {
				const isNumber = Number(row[property]).toString() !== 'NaN';
				convertedRow[property] = isNumber ? Number(row[property]) : row[property];
			});
			return convertedRow;
		});
	}
}
