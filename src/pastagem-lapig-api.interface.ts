export interface QuerySearch {
	ano?: number;
	codigoMunicipio?: number;
    municipio?: string;
    file?: string;
    relatorio:string;
}

export interface QueryParameters {
	file?: string;
	filter?: string;
	region?: string;
}
