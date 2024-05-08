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
          exercicios: [
            { nome: "Supino inclinado", repeticoes: 10, quantidadeSeries: 4, variacao: "Drop na Ultima série", feito: false },
            { nome: "Supino reto", repeticoes: 10, quantidadeSeries: 4, feito: false },
            { nome: "Voador", repeticoes: 10, quantidadeSeries: 4, feito: false },
            { nome: "CrossOver", repeticoes: 10, quantidadeSeries: 4, feito: false },

          ]
        },
        {
          id: 2,
          grupo: "Costas",
          exercicios: [
            { nome: "Puxada frontal", repeticoes: 10, quantidadeSeries: 4, feito: false },
            { nome: "Remada baixa neutra", repeticoes: 10, quantidadeSeries: 4, feito: false },
            { nome: "Cavalinho", repeticoes: 10, quantidadeSeries: 4, feito: false },
            { nome: "Remada baixa pronada", repeticoes: 10, quantidadeSeries: 4, feito: false },
          ]
        },
        {
          id: 3,
          grupo: "Pernas",
          exercicios: [
            { nome: "Agachamento Livre", repeticoes: 10, quantidadeSeries: 4, feito: false },
            { nome: "Leg press", repeticoes: 10, quantidadeSeries: 4, feito: false },
            { nome: "Cadeira extensora", repeticoes: 10, quantidadeSeries: 4, feito: false },
            { nome: "Cadeira Flexora", repeticoes: 10, quantidadeSeries: 4, feito: false },
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
              id: 4,
              grupo: "Pernas",
              exercicios: [
                { nome: "Agachamento", repeticoes: 10, quantidadeSeries: 4, feito: false },
                { nome: "Leg press", repeticoes: 10, quantidadeSeries: 4, feito: false },
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
