export const sexoOpcoes = [
  {
    id: 'masculino',
    opcao: 'Masculino',
  },
  {
    id: 'feminino',
    opcao: 'Feminino',
  },
];
export function formatDate(data: string | Date): string {
  const dataObj = new Date(data);
  const dia = dataObj.getDate().toString().padStart(2, '0');
  const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
  const ano = dataObj.getFullYear();
  const horas = dataObj.getHours().toString().padStart(2, '0');
  const minutos = dataObj.getMinutes().toString().padStart(2, '0');
  const segundos = dataObj.getSeconds().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}
export const brazilianStates = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' },
] as const;

export const cargoOpcoes = [
  {
    id: 'estagiario',
    opcao: 'Estagiário',
  },
  {
    id: 'junior',
    opcao: 'Júnior',
  },
  {
    id: 'pleno',
    opcao: 'Pleno',
  },
  {
    id: 'senior',
    opcao: 'Sênior',
  },
];

export const setorOpcoes = [
  {
    id: 'tecnologia',
    opcao: 'Tecnologia da Informação',
  },
  {
    id: 'rh',
    opcao: 'Recursos Humanos',
  },
  {
    id: 'financeiro',
    opcao: 'Financeiro',
  },
  {
    id: 'vendas',
    opcao: 'Vendas',
  },
];

export function formatarDataParaNumeros(data: string): string {
  const numeros = data.replace(/\D/g, '');

  const ano = numeros.slice(0, 4);
  const mes = numeros.slice(4, 6);
  const dia = numeros.slice(6, 8);

  return `${dia}${mes}${ano}`;
}

export function DataFormatada(data: string): string {
  const numeros = data.replace(/\D/g, '');

  if (numeros.length !== 8) {
    return '';
  }

  const dia = numeros.slice(0, 2);
  const mes = numeros.slice(2, 4);
  const ano = numeros.slice(4, 8);

  return `${dia}/${mes}/${ano}`;
}

export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, '');

  if (numeros.length !== 10 && numeros.length !== 11) {
    return '';
  }

  const ddd = numeros.slice(0, 2);
  const parte1 = numeros.slice(2, 7);
  const parte2 = numeros.slice(7, 11);

  const telefoneFormatado =
    numeros.length === 11
      ? `(${ddd}) 9${parte1}-${parte2}`
      : `(${ddd}) ${parte1}-${parte2}`;

  return telefoneFormatado;
}

export function formatarCEP(cep: string): string {
  const numeros = cep.replace(/\D/g, '');

  if (numeros.length !== 8) {
    return '';
  }

  const parte1 = numeros.slice(0, 5);
  const parte2 = numeros.slice(5, 8);

  return `${parte1}-${parte2}`;
}

// export function limparTelefone(telefone: string) {
// 	return telefone.replace(/[\(\)\-\s]/g, '');
// }

export function getDataAtual() {
  const dataAtual = new Date();
  const dia = String(dataAtual.getDate()).padStart(2, '0');

  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const ano = dataAtual.getFullYear().toString();

  return `${dia}${mes}${ano}`;
}

export function formatarTelefoneParaNumeros(telefone: string): string {
  return telefone.replace(/[()\- ]/g, '');
}

export function formatarDataHistorico(data: string): string {
  const dataObj = new Date(data);

  const dia = dataObj.getDate().toString().padStart(2, '0');
  const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
  const ano = dataObj.getFullYear().toString();
  const hora = dataObj.getHours().toString().padStart(2, '0');
  const minuto = dataObj.getMinutes().toString().padStart(2, '0');
  const segundo = dataObj.getSeconds().toString().padStart(2, '0');

  const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

  return dataFormatada;
}

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
