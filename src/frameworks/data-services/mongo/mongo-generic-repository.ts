import { Model } from "mongoose";
import { IGenericRepository } from "../../../core";

export class MongoGenericRepository<T> implements IGenericRepository<T> {
  private _repository: Model<T>;
  private _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  async getAll(): Promise<T[]> {
    return await this._repository
      .find({ deletedAt: null })
      .populate(this._populateOnFind)
      .exec();
  }

  async get(id: any): Promise<T | null> {
    const result = await this._repository
      .findById(id)
      .where("deletedAt", null)
      .populate(this._populateOnFind)
      .lean()
      .exec();

    return result ? (result as T) : null;
  }

  findByAttribute(attribute: string, value: any): Promise<T> {
    return this._repository
      .findOne({ [attribute]: value, deletedAt: null })
      .populate(this._populateOnFind)
      .exec()
      .then((result) => result as T);
  }

  async findAllByAttribute(attribute: string, value: any): Promise<T[]> {
    return this._repository
      .find({ [attribute]: value, deletedAt: null })
      .populate(this._populateOnFind)
      .exec();
  }
  findAllByAttributes(attributes: any): Promise<T[]> {
    console.log(JSON.stringify(attributes));
    return this._repository
      .find(attributes)
      .where("deletedAt", null)
      .populate(this._populateOnFind)
      .exec();
  }

  create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  async update(id: string, item: T) {
    return this._repository.findByIdAndUpdate(id, item, {
      returnOriginal: false,
    });
  }
  //soft delete
  async delete(id: string): Promise<T> {
    return this._repository.findByIdAndUpdate(id, { deletedAt: new Date() });
  }

  countByCriteria(criteria: any): Promise<number> {
    return this._repository.countDocuments(criteria).exec();
  }
}
