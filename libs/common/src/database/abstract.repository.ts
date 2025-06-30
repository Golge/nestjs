import { Logger, NotFoundException } from "@nestjs/common";
import { Model, Types, FilterQuery, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";


export abstract class AbstractRepository<TDocument extends AbstractDocument> {

    protected abstract readonly logger: Logger

    constructor(protected readonly model: Model<TDocument>) {}
 
    // create a new document in the database
    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId() // Ensure a new ObjectId is generated
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument;
    }

    // find a document by its ID
    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model
            .findOne(filterQuery)
            .lean<TDocument>(true);
       
        if (!document) {
            this.logger.warn(`Document not found for query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found for query: ${JSON.stringify(filterQuery)}`);
        }

        return document;
    }

    // update a document by its ID
    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ): Promise<TDocument> {
        const document = await this.model
            .findOneAndUpdate(filterQuery, update, {
                new: true, // Return the updated document
            })
            .lean<TDocument>(true);

        if (!document) {
            this.logger.warn(`Document not found for query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found for query: ${JSON.stringify(filterQuery)}`);
        }
        return document;
    }

    // find all documents
    async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
        return this.model.find(filterQuery).lean<TDocument[]>(true);
    }

    // delete a document by its ID
    async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
        if (!document) {
            this.logger.warn(`Document not found for query: ${JSON.stringify(filterQuery)}`);
            throw new NotFoundException(`Document not found for query: ${JSON.stringify(filterQuery)}`);
        }
        return document;
    }

}