// import { FastifyRequest, FastifyReply } from 'fastify';
// import { TrainingWeekRepository } from '../interfaces/trainingWeek.interface';
// import { TrainingWeekService } from '../services/trainingWeekService';

// class TrainingWeekController {
//   private trainingWeekRepository: TrainingWeekRepository;

//   constructor() {
//     this.trainingWeekRepository = new TrainingWeekService();
//   }
//   async createTrainingWeekController(request: FastifyRequest, reply: FastifyReply) {
//     const { userId, weekNumber, information } = request.body as {
//       userId: string;
//       weekNumber: number;
//       information?: string;
//     };

//     try {
//       const newWeek = await this.trainingWeekRepository.createTrainingWeek(
//         userId,
//         weekNumber,
//         information
//       );
//       reply.status(201).send(newWeek);
//     } catch (error) {
//       reply.status(500).send({ error: 'Erro ao criar semana de treino' });
//     }
//   }
// }
