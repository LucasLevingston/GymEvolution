import { UserType } from "@/types/userType";

const usersData: UserType[] = [
  {
    id: 1,
    nome: "Lucas",
    email: "lucas@example.com",
    idade: "21",
    pesoAtual: 96,
    pesos: [{ peso: 96, data: "20210-05-01", bf: 25 }],
    TreinoDaSemana: {
      semana: 1,
      diaDeTreino: [
        {
          id: 1,
          grupo: "Peito",
          diaDaSemana: 'Segunda-feira',
          feito: true,
          exercicios: [
            {
              nome: "Supino inclinado", repeticoes: 10, quantidadeSeries: 3, variacao: "Drop na Ultima série", feito: true, resultado: [
                {
                  "carga": 1,
                  "repeticoes": 1,
                  "serie": 1
                },
                {
                  "carga": 1,
                  "repeticoes": 1,
                  "serie": 2
                },
                {
                  "carga": 1,
                  "repeticoes": 1,
                  "serie": 3
                },
                {
                  "carga": 1,
                  "repeticoes": 1,
                  "serie": 4
                },
              ]
            },
            { nome: "Supino reto", repeticoes: 10, quantidadeSeries: 3, feito: true },
            { nome: "Voador", repeticoes: 10, quantidadeSeries: 3, feito: true },
            { nome: "CrossOver", repeticoes: 10, quantidadeSeries: 3, feito: true },

          ]
        },
        {
          id: 2,
          grupo: "Costas",
          diaDaSemana: 'Terça-feira',
          feito: false,
          exercicios: [
            { nome: "Puxada frontal", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Remada baixa neutra", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Cavalinho", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Remada baixa pronada", repeticoes: 10, quantidadeSeries: 3, feito: false },
          ]
        },
        {
          id: 3,
          grupo: "Pernas",
          diaDaSemana: 'Quarta-feira',
          feito: false,
          exercicios: [
            { nome: "Agachamento Livre", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Leg press", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Cadeira extensora", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Cadeira Flexora", repeticoes: 10, quantidadeSeries: 3, feito: false },
          ]
        },
        {
          id: 5,
          grupo: "Bíceps e tríceps",
          diaDaSemana: 'Quarta-feira',
          feito: false,
          exercicios: [
            { nome: "Rosca alternada", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Rosca direta", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Rosca Scott", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Triceps Francês", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Triceps testa", repeticoes: 10, quantidadeSeries: 3, feito: false },
            { nome: "Tríceps corda", repeticoes: 10, quantidadeSeries: 3, feito: false },
          ]
        }
      ]
    },
    TreinosAntigos: [
      {
        semana: 0,
        treino: {
          semana: 0,
          diaDeTreino: [
            {
              id: 0,
              grupo: "Pernas",
              diaDaSemana: 'Quarta-feira',
              feito: false,
              exercicios: [
                { nome: "Agachamento", repeticoes: 10, quantidadeSeries: 3, feito: false },
                { nome: "Leg press", repeticoes: 10, quantidadeSeries: 3, feito: false },
              ]
            }
          ]
        },
        serie: {
          repeticoes: 10,
          carga: 80
        }
      }
    ]
  }
];

export default usersData;
