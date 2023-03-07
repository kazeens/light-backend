import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { INftCollectionManager } from 'src/interface/nftCollectionManager.interface';
import { CreateNftCollectionManagerDto } from 'src/dto/createNftCollectionManager.dto';
import { UpdateNftCollectionManagerDto } from 'src/dto/updateNftCollectionManager.dto';

@Injectable()
export class NftCollectionManagerService {
  constructor(
    @InjectModel('NftCollectionManager')
    private nftCollectionManagerModel: Model<INftCollectionManager>,
  ) {}

  async createNftCollectionManager(
    createNftCollectionManagerDto: CreateNftCollectionManagerDto,
  ): Promise<INftCollectionManager> {
    const newNftCollectionManager = new this.nftCollectionManagerModel(
      createNftCollectionManagerDto,
    );
    return newNftCollectionManager.save();
  }

  async updateByNftCollectionManagerAddress(
    contractAddress: string,
    nftCollectionManagerDto: UpdateNftCollectionManagerDto,
  ): Promise<INftCollectionManager> {
    const newNftCollectionManager =
      await this.nftCollectionManagerModel.updateOne(
        {
          contractAddress,
        },
        { $set: nftCollectionManagerDto },
      );

      console.log('newNftCollectionManager', newNftCollectionManager)

      const updated = this.findByCollectionManagerAddress(contractAddress);
      console.log('updated', updated)

      return updated;
  }

  async findByCollectionManagerAddress(address: string) {
    const existingManagerContract =
      await this.nftCollectionManagerModel.findOne({
        contractAddress: address,
      });

    return existingManagerContract;
  }

  async findByOwnerAddress(
    ownerAddress: string,
  ): Promise<(INftCollectionManager & { _id: ObjectId })[]> {
    const existingManagerContractsByOwner =
      await this.nftCollectionManagerModel.find({ ownerAddress });

    return existingManagerContractsByOwner;
  }

  async findByCollectionAddress(
    collectionAddress: string,
  ): Promise<INftCollectionManager & { _id: ObjectId }> {
    const existingManagerContractsByOwner =
      await this.nftCollectionManagerModel.findOne({ collectionAddress });

    return existingManagerContractsByOwner;
  }

  async findAll(query, skip = 0, limit: number) {
    const result = await this.nftCollectionManagerModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const countOfDocs = await this.nftCollectionManagerModel.count(query);

    return {
      result,
      count: countOfDocs,
    };
  }
}
