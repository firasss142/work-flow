export abstract class AbstractCronJobService {
  abstract execute(): Promise<void> | void;
}
