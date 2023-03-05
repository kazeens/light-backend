import { Document } from 'mongoose';

export interface INftCollectionManager extends Document {
  readonly contractAddress: string;
  readonly ownerAddress: string;
  readonly collectionAddress: string;
}
